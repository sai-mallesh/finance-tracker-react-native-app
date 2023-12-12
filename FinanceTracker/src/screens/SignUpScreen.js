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
import {checkNetworkConnectivity, makeToastMessage} from '../Utils';
import {useAsyncStorageData} from '../providers/AsyncStorageDataProvider';
import PropTypes from 'prop-types';
import {setObjectDataLocal, keys,setDataLocal} from '../AsyncStorageUtils';

const SignUpScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {userMetadata,setUserMetadata} = useAsyncStorageData();

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
      setEmail('');
      setPassword('');
      const value = {
        ...userMetadata,
        email: email,
        userId: data.session.user.id,
        userType: 'hybrid',
      };
      setUserMetadata(value);
      await setObjectDataLocal(keys.USER_METADATA, value);
      await setDataLocal(keys.SESSION_EXISTS, 'true');
      navigation.navigate('Setup Profile');
    } else {
      makeToastMessage('You are not connected to internet.');
    }
  }

  async function handleSkipLogin() {
    setUserMetadata({...userMetadata, userType: 'local'});
    navigation.navigate('Setup Profile');
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
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
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
};

SignUpScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default SignUpScreen;

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
