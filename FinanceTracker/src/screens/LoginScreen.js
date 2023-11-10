/* eslint-disable prettier/prettier */
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Pressable,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import supabase from '../../config/supabaseClient';
import {useAuth} from '../providers/AuthProvider';
import {generateRandomId, makeToastMessage} from '../Utils';
import {useAsyncStorageData} from '../providers/AsyncStorageDataProvider';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('demo@demo.com');
  const [password, setPassword] = useState('123456');
  const {getUserSession, setUserSession, setUserData} = useAuth();
  const {checkNetworkConnectivity,setData} = useAsyncStorageData();

  async function changeScreenIfSessionExists() {
    var temp = await getUserSession();
    if (temp !== null) {
      navigation.navigate('Landing');
    }
  }

  useEffect(() => {
    changeScreenIfSessionExists();
  }, []);

  async function handleLogin() {
    const isConnected = await checkNetworkConnectivity();
    if (isConnected) {
      const {data, error} = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error !== null) {
        console.log(error);
        makeToastMessage(error.message);
        return;
      }
      console.log(data);
      setEmail('');
      setPassword('');
      await setUserSession(data);
      await setData('requestQueue',[]);
      await setUserData('userType', 'hybrid');
      navigation.navigate('Landing');
    } else {
      makeToastMessage('You are not connected to internet.');
    }
  }

  async function handleSkipLogin() {
    setUserSession(generateRandomId());
    setUserData('userType', 'local');
    navigation.navigate('Landing');
  }
  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.contentContainer}>
        <Text style={styles.headerText}>Login</Text>
        <TextInput
          placeholder={'Email'}
          placeholderTextColor="#EEEDED"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder={'Password'}
          placeholderTextColor="#EEEDED"
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
          <Text style={styles.signUpText}>Click here to sign up</Text>
        </Pressable>

        <Text style={styles.signUpText}>
          Use email : demo@demo.com / password : 123456
        </Text>

        <TouchableOpacity
          style={[styles.button, styles.skipLoginButton]}
          onPress={() => handleSkipLogin()}>
          <Text style={[styles.loginBtnText]}>Skip Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#151515',
  },
  contentContainer: {
    marginVertical: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 30,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    width: '90%',
    borderWidth: 1,
    marginVertical: 10,
    borderRadius: 15,
    padding: 10,
    color: '#fff',
    backgroundColor: '#363636',
    borderColor: '#0E8388',
  },

  button: {
    height: 40,
    borderRadius: 15,
    width: 200,
    backgroundColor: '#0E8388',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  loginBtnText: {
    fontSize: 15,
    fontWeight: 'bold',
    margin: 0,
  },

  signUpText: {
    marginTop: 30,
    fontSize: 15,
    color: '#ffffff',
  },

  skipLoginButton: {
    marginTop: 40,
  },
});
