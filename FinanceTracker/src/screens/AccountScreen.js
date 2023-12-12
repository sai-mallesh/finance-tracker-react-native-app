import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Pressable,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {useAsyncStorageData} from '../providers/AsyncStorageDataProvider';
import {globalStyles} from '../Styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {signOut} from '../Utils';

const {width} = Dimensions.get('window');

const size = width * 0.25;

const AccountScreen = ({navigation}) => {
  const {userMetadata, setUserMetadata,setGroupsInfo} = useAsyncStorageData();

  const handleSignout = async () => {
    await signOut();
    setUserMetadata({
      name: '',
      email: '',
      userId: '',
      userType: '',
      currency: '',
      spendings: '',
    });
    setGroupsInfo([]);
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={globalStyles.mainContainer}>
      <View style={globalStyles.contentContainer}>
        <TouchableOpacity
          onPress={() => console.log('Hello')}
          style={styles.profileCard}>
          <View style={styles.headerCard}>
            <Ionicons name="person-circle-sharp" size={size} color="#ffffff" />
            <View style={styles.headerCardText}>
              <Text style={[styles.text, styles.textName]}>
                {userMetadata.name}
              </Text>
              <Text style={styles.text}>{userMetadata.email}</Text>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.bottomCard}>
          <Pressable
            onPress={() => console.log('Edit Profile')}
            style={styles.headerCard}>
            <Icon name="user-edit" size={25} color="#ffffff" />
            <Text style={styles.bottomCardPressableText}>Edit Profile</Text>
          </Pressable>
          <Pressable
            onPress={() => console.log('Feedback')}
            style={styles.headerCard}>
            <Icon name="cog" size={25} color="#ffffff" solid />
            <Text style={styles.bottomCardPressableText}>Settings</Text>
          </Pressable>
          <Pressable
            onPress={() => console.log('Feedback')}
            style={styles.headerCard}>
            <Icon name="cog" size={25} color="#ffffff" solid />
            <Text style={styles.bottomCardPressableText}>Settings</Text>
          </Pressable>
          <Pressable
            onPress={() => console.log('Feedback')}
            style={styles.headerCard}>
            <Icon name="star" size={25} color="#ffffff" solid />
            <Text style={styles.bottomCardPressableText}>Feedback</Text>
          </Pressable>
          <Pressable onPress={handleSignout} style={styles.headerCard}>
            <Icon name="sign-out-alt" size={25} color="#BE3144" />
            <Text style={styles.signOutText}>Sign Out</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  profileCard: {
    width: '100%',
    height: '20%',
    marginTop: '10%',
  },
  text: {
    color: '#ffffff',
  },
  bottomCardPressableText: {
    marginLeft: 10,
    color: '#ffffff',
    fontSize: 20,
  },
  signOutText: {
    marginLeft: 10,
    color: '#BE3144',
    fontSize: 25,
  },
  textName: {
    fontSize: width * 0.075,
  },
  headerCardText: {
    marginLeft: 20,
  },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    justifyContent: 'flex-start',
  },
  bottomCard: {
    borderTopStartRadius: 50,
    borderTopEndRadius: 50,
    backgroundColor: '#151515',
    width: '105%',
    height: '80%',
    paddingLeft: 20,
    alignItems: 'flex-start',
    justifyContent: 'space-evenly',
  },
});
