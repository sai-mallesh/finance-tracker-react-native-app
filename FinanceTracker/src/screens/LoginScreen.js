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
import React, {useState} from 'react';
import supabase from '../../config/supabaseClient';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin() {
    const {data, error} = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    console.log(data, error);
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
    navigation.navigate('Home');
  }
  return (
    <SafeAreaView style={styles.mainContainer}>

    <Text style={{fontSize:20}}>Login</Text>
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
      <Pressable onPress={()=>navigation.navigate('Sign Up')}>
        <Text>Click here for sign up</Text>
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
