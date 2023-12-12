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
import {
  addRecordDB,
  generateUUID,
  makeToastMessage,
  getGroupData,
} from '../Utils';
import PropTypes from 'prop-types';
import {useAsyncStorageData} from '../providers/AsyncStorageDataProvider';
import {setObjectDataLocal, keys, setDataLocal} from '../AsyncStorageUtils';

const SetupProfile = ({navigation}) => {
  const [name, setName] = useState('');
  const [currency, setCurrency] = useState('');
  const {userMetadata, setUserMetadata, setGroupsInfo} = useAsyncStorageData();

  const handleSubmit = async () => {
    if (userMetadata.userType === 'hybrid') {
      const status = await addRecordDB('profile', {
        id: userMetadata.userId,
        name: name,
        currency: currency,
      });
      if (status === 201) {
        await setUserMetadata(prevState => ({
          ...prevState,
          userId: userMetadata.userId,
          name: name,
          currency: currency,
        }));
        await setObjectDataLocal(keys.USER_METADATA, {
          name: name,
          email: userMetadata.email,
          userId: userMetadata.userId,
          userType: userMetadata.userType,
          currency: currency,
          spendings: 0,
        });
        const grpData = await getGroupData(userMetadata.userId);
        setGroupsInfo(grpData);
        console.log(grpData);
        await setObjectDataLocal(keys.GROUPS_LIST,grpData);
        navigation.navigate('PostAuthScreens');
      } else {
        makeToastMessage('There was some error');
      }
    } else {
      let userId = generateUUID();
      await setUserMetadata(prevState => ({
        ...prevState,
        userId: userId,
        name: name,
        currency: currency,
      }));
      setObjectDataLocal(keys.USER_METADATA, {
        name: name,
        email: userMetadata.email,
        userId: userId,
        userType: userMetadata.userType,
        currency: currency,
        spendings: 0,
      });
      const grp = [
        {
          group_id: generateUUID(),
          group_name: 'Personal',
          members: [userId],
          memberNames: [name],
        },
      ];
      await setObjectDataLocal(keys.GROUPS_LIST, grp);
      await setObjectDataLocal(keys.TRANSACTIONS, [
        {Personal: [], groupName: 'Personal'},
      ]);
      await setGroupsInfo(grp);
      await setDataLocal(keys.SESSION_EXISTS, 'true');
      navigation.navigate('PostAuthScreens');
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

SetupProfile.propTypes = {
  navigation: PropTypes.object.isRequired,
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
