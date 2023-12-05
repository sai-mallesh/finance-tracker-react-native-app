import React, {createContext, useContext, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import supabase from '../../config/supabaseClient';
import {makeToastMessage} from '../Utils';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [userId, setUserId] = useState();
  const [userType, setUserType] = useState();
  const getUserData = async key => {
    try {
      const userId_ = await AsyncStorage.getItem(key);
      return userId_ != null ? userId_ : null;
    } catch (e) {
      console.log(e);
    }
  };

  const setUserData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      console.log(e);
    }
  };

  const getUserSession = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('userSession');
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.log(e);
    }
  };

  const setUserSession = async value => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('userSession', jsonValue);
      try {
        await setUserData('userId', value != null ? value.user.id : ''); //for hybrid user
      } catch {
        await setUserData('userId', value); //for local user
      }
    } catch (e) {
      console.log(e);
    }
  };

  const signOut = async () => {
    try {
      const {error} = await supabase.auth.signOut();
      if (error) {
        makeToastMessage(error.message);
        return;
      }
      makeToastMessage('Logged Out');
      setUserId('');
      setUserType('');
      await AsyncStorage.clear();
    } catch (e) {
      console.log(e);
      makeToastMessage(e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        getUserSession,
        setUserSession,
        getUserData,
        setUserData,
        signOut,
        userId,
        setUserId,
        userType,
        setUserType,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
