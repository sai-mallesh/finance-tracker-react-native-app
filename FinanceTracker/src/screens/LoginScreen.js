/* eslint-disable prettier/prettier */
import {
  StyleSheet,
  Text,
  ToastAndroid,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Pressable,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import supabase from '../../config/supabaseClient';
import {useAuth} from '../providers/AuthProvider';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {localSessionActive, setLocalSessionActive} = useAuth();

  async function CheckUserSession() {
    const {data, error} = await supabase.auth.getSession();
    if (data.session !== null) {
      navigation.navigate('Landing');
    }
  }

  useEffect(() => {
    CheckUserSession();
  }, []);

  async function SessionDetails() {
    console.log('Hello');
    const {data, error} = await supabase.auth.getSession();
    console.log('Details', data, error);
    supabase.auth.onAuthStateChange((event, session) => {
      console.log('Event', event, 'Session', session);
    });
  }

  async function handleLogin() {
    const {data, error} = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error !== null) {
      console.log(error);
      ToastAndroid.showWithGravity(
        error.message,
        ToastAndroid.LONG,
        ToastAndroid.CENTER,
      );
      return;
    }
    console.log(data);
    setEmail('');
    setPassword('');
    setLocalSessionActive(true);
    navigation.navigate('Landing');
  }
  return (
    <SafeAreaView style={styles.mainContainer}>
      <Text style={{fontSize: 20}}>Login</Text>
      <TextInput
        placeholder={'Email'}
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder={'Password'}
        secureTextEntry={true}
        autoCorrect={false}
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={() => handleLogin()}>
        <Text style={[styles.loginBtnText]}>Login</Text>
      </TouchableOpacity>
      <Pressable onPress={() => navigation.navigate('Sign Up')}>
        <Text>Click here for sign up</Text>
      </Pressable>

      <Pressable onPress={SessionDetails}>
        <Text>SessionDetails</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  mainContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: '50%',
  },
  input: {
    height: 50,
    width: '90%',
    borderWidth: 2,
    marginVertical: 10,
    borderRadius: 15,
    padding: 10,
  },

  button: {
    height: 50,
    borderRadius: 15,
    width: 200,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
  },

  loginBtnText: {
    fontSize: 15,
    margin: 0,
  },
});
