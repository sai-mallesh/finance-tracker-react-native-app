/* eslint-disable prettier/prettier */
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ToastAndroid,
  SafeAreaView,
} from 'react-native';
import React from 'react';
import supabase from '../../config/supabaseClient';
import Icon from 'react-native-vector-icons/FontAwesome';

const LandingScreen = ({navigation}) => {
  const handleSignout = async () => {
    const {error} = await supabase.auth.signOut();
    if (error) {
      ToastAndroid.showWithGravity(
        error.message,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      return;
    }
    ToastAndroid.showWithGravity(
      'Logged Out',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
    navigation.navigate('Login');
  };
  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.contentContainer}>
        <Pressable
          onPress={handleSignout}
          style={styles.signOutButton}>
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </Pressable>
        <View style={styles.buttonsSectionContainer}>
          <View style={styles.button}>
            <Pressable onPress={() => navigation.navigate('SpeechToText')}>
            <View style={styles.buttonContent}>
            <Icon name="language" size={30} color="#ffffff" />
              <Text style={styles.buttontText}>Speech to Text</Text>
            </View>
            </Pressable>
          </View>
          <View View style={styles.button}>
            <Pressable onPress={() => navigation.navigate('Home')}>
            <View style={styles.buttonContent}>
            <Icon name="list" size={30} color="#ffffff" />
              <Text style={styles.buttontText}>List View</Text>
            </View>
            </Pressable>
          </View>
        </View>
        <View style={styles.buttonsSectionContainer}>
          <View style={styles.button}>
            <Pressable onPress={() => navigation.navigate('Feedback')}>
            <View style={styles.buttonContent}>
            <Icon name="comment" size={30} color="#ffffff" />
              <Text style={styles.buttontText}>User Feedback</Text>
            </View>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LandingScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#151515',
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  buttonsSectionContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    width: '100%',
    height: '40%',
    marginVertical: 10,
    marginHorizontal:10,
  },
  signOutButton:{
    height: 40,
    borderRadius: 15,
    alignSelf:'flex-end',
    marginRight: 10,
    width: '45%',
    backgroundColor: '#0E8388',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  button: {
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#A7D397',
    padding: 30,
    height: '100%',
    width: '45%',
    marginHorizontal: 10,
    borderRadius: 20,
  },
  buttonContent:{
    marginTop:'75%',
    alignItems:'center',
    justifyContent:'center',
  },
  buttontText: {
    fontSize: 20,
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    color: '#ffffff',
  },
  signOutButtonText:{
    fontSize:15, 
    fontWeight:'bold',
  },
});
