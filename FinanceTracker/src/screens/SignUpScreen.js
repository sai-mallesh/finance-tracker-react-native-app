import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Pressable,
  View,
} from 'react-native';
import React, {useState} from 'react';
import supabase from '../../config/supabaseClient';
import {useAuth} from '../providers/AuthProvider';
import {makeToastMessage, generateRandomId} from '../Utils';
import {useAsyncStorageData} from '../providers/AsyncStorageDataProvider';

export default function SignUpScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {setUserSession, setUserData} = useAuth();
  const {checkNetworkConnectivity, setData} = useAsyncStorageData();

  async function handleSignUp() {
    const isConnected = await checkNetworkConnectivity();
    if (isConnected) {
      const {data, error} = await supabase.auth.signUp({
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
      await setData('requestQueue', []);
      await setUserData('userType', 'hybrid');
      navigation.navigate('Setup Profile');
    } else {
      makeToastMessage('You are not connected to internet.');
    }
  }

  async function handleSkipLogin() {
    setUserSession(generateRandomId());
    setUserData('userType', 'local');
    navigation.navigate('PostAuthScreens');
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.contentContainer}>
        <Text style={styles.headerText}>Sign Up</Text>
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
        <TouchableOpacity
          style={styles.button}
          onPress={handleSignUp}>
          <Text style={[styles.loginBtnText]}>Sign Up</Text>
        </TouchableOpacity>
        <Pressable onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>Click here for login</Text>
        </Pressable>

        <TouchableOpacity
          style={[styles.button, styles.skipSignUpButton]}
          onPress={() => handleSkipLogin()}>
          <Text style={[styles.loginBtnText]}>Skip Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

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

  loginText: {
    marginTop: 30,
    fontSize: 15,
    color: '#ffffff',
  },
  skipSignUpButton: {
    marginTop: 40,
  },
});
