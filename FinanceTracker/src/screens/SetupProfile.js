import {
  StyleSheet,
  TextInput,
  View,
  SafeAreaView,
  TouchableOpacity,
  Text,
} from 'react-native';
import React, {useState} from 'react';
import {globalStyles} from '../Styles';
import {useAuth} from '../providers/AuthProvider';
import {addRecordToDB, makeToastMessage} from '../Utils';

const SetupProfile = ({navigation}) => {
  const [name, setName] = useState('');
  const [currency, setCurrency] = useState('');
  const {getUserData, setUserData, userMetadata, setUserMetadata} = useAuth();

  const handleSubmit = async () => {
    setUserData('name', name);
    setUserData('currency', currency);
    const userIdTemp = await getUserData('userId');
    const status = await addRecordToDB('profile', {
      id: userIdTemp,
      name: name,
      currency: currency,
    });
    if (status === 201) {
      setUserMetadata({
        ...userMetadata,
        userId:userIdTemp,
        userType:'hybrid',
        name: name,
        currency: currency,
      });
      navigation.navigate('PostAuthScreens');
    } else {
      makeToastMessage('There was some error');
    }
  };
  return (
    <SafeAreaView style={globalStyles.mainContainer}>
      <View
        style={[globalStyles.contentContainer, styles.viewContainerPosition]}>
        <TextInput
          placeholder={'Name'}
          placeholderTextColor="#EEEDED"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        <TextInput
          placeholder={'Currency'}
          placeholderTextColor="#EEEDED"
          style={styles.input}
          value={currency}
          onChangeText={setCurrency}
        />
        <TouchableOpacity
          style={[styles.button, styles.loginBtnText]}
          onPress={handleSubmit}>
          <Text style={[styles.loginBtnText]}>Setup</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SetupProfile;

const styles = StyleSheet.create({
  viewContainerPosition: {
    marginVertical: '50%',
  },
  input: {
    height: 40,
    width: '90%',
    borderWidth: 1,
    marginVertical: 10,
    borderRadius: 15,
    padding: 10,
    color: '#ffffff',
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
});
