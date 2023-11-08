/* eslint-disable prettier/prettier */
import React, {useState, useEffect, createContext, useContext} from 'react';
import {supabase} from '../../config/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [localSessionActive, setLocalSessionActive] = useState(false);

  async function authEvent() {
    try {
      supabase.auth.onAuthStateChange((event, session) => {
        console.log('Event', event, 'Session', session);
      });
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    authEvent();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{localSessionActive, setLocalSessionActive}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
