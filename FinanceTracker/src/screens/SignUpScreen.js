/* eslint-disable prettier/prettier */
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ToastAndroid,
  Pressable,
} from 'react-native';
import React, {useState} from 'react';
import supabase from '../../config/supabaseClient';

export default function SignUpScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSignUp() {
    const {data, error} = await supabase.auth.signUp({
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
    navigation.navigate('Home');
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <Text style={{fontSize: 20}}>Sign Up</Text>
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
      <TouchableOpacity style={styles.button} onPress={() => handleSignUp()}>
        <Text style={[styles.loginBtnText]}>Sign Up</Text>
      </TouchableOpacity>
      <Pressable onPress={() => navigation.navigate('Login')}>
        <Text>Click here for login</Text>
      </Pressable>
    </SafeAreaView>
  );
}

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
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
  },

  loginBtnText: {
    fontSize: 15,
    margin: 0,
  },
});
