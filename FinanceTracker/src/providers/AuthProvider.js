/* eslint-disable prettier/prettier */
import React, {createContext, useContext} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import supabase from '../../config/supabaseClient';
import {makeToastMessage} from '../Utils';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const getUserData = async key => {
    try {
      const userId = await AsyncStorage.getItem(key);
      return userId != null ? userId : null;
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
        await setUserData('userId', value != null ? value.user.id : '');
      } catch {
        await setUserData('userId', value);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const signOut = async () => {
    try{
    const {error} = await supabase.auth.signOut();
    if (error) {
      makeToastMessage(error.message);
      return;
    }
    makeToastMessage('Logged Out');
    await AsyncStorage.removeItem('userSession');
    await AsyncStorage.removeItem('transactions');
    await AsyncStorage.removeItem('userId');
    await AsyncStorage.removeItem('requestQueue');}
    catch (e){
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
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
