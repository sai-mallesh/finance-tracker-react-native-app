/* eslint-disable prettier/prettier */
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useAuth} from '../providers/AuthProvider';
import supabase from '../../config/supabaseClient';
import Voice from '@react-native-voice/voice';

const LandingScreen = ({navigation}) => {
  const [startState, setStartState] = useState('');
  const [endState, setEndState] = useState('');
  const [result, setResult] = useState([]);

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechResults = onSpeechResults;
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStart = e => {
    console.log(e);
    setStartState('Started');
  };

  const onSpeechEnd = e => {
    console.log(e);
    setEndState('Stopped');
  };

  const onSpeechResults = e => {
    console.log(e);
    setResult(e.value);
  };

  async function signOut() {
    const {error} = await supabase.auth.signOut();
    if (error) {
      console.log(error);
      return;
    }
    navigation.navigate('Login');
  }

  async function SessionDetails() {
    console.log('Hello');
    const {data, error} = await supabase.auth.getSession();
    console.log('Details', data, error);
    const s = supabase.auth.onAuthStateChange((event, session) => {
      console.log(event, session);
    });
  }

  const startRecognization = async () => {
    try {
      await Voice.start('en-US');
      setStartState('');
      setEndState('');
      setResult([]);
    } catch (error) {
      console.log(error);
    }
  };

  const stopRecognization = async () => {
    try {
      await Voice.stop();
      await Voice.destroy();
      setStartState('');
      setEndState('');
      setResult([]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View>
      {/* <Pressable onPress={signOut}>
        <Text>Sign Out</Text>
      </Pressable>
      <Pressable onPress={SessionDetails}>
        <Text>SessionDetails</Text>
      </Pressable>
      <Pressable
        onPress={() => {
          navigation.navigate('Home');
        }}>
        <Text>Go to Home Screen</Text>
      </Pressable> */}
      
      <TouchableOpacity
        style={{alignSelf: 'center', marginTop: 50}}
        onPress={() => startRecognization()}>
        <Text style={{fontSize: 20}}>Press to Start</Text>
      </TouchableOpacity>
      <View
        style={{
          flexDirection: 'row',
          marginTop: 50,
          justifyContent: 'space-evenly',
        }}>
        <Text>{startState}</Text>
        <Text>{endState}</Text>
      </View>
      <TouchableOpacity
        style={{alignSelf: 'center', marginTop: 50}}
        onPress={() => stopRecognization()}>
        <Text style={{fontSize: 20}}>Press to Stop</Text>
      </TouchableOpacity>
      <ScrollView>
        {result.map((item,i) => {
          return <View key={i}><Text>{item}</Text></View>;
        })}
      </ScrollView>
    </View>
  );
};

export default LandingScreen;

const styles = StyleSheet.create({});
