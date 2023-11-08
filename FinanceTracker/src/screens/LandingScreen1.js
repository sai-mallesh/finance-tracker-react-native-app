/* eslint-disable prettier/prettier */
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Pressable,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Voice from '@react-native-voice/voice';
import Icon from 'react-native-vector-icons/FontAwesome';

const LandingScreen = ({navigation}) => {
  const [voiceInputState, setVoiceInputState] = useState('inactive');
  const [iconColor, setIconColor] = useState('#0E8388');
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
    setVoiceInputState('active');
    setIconColor('red');
  };

  const onSpeechEnd = e => {
    console.log(e);
    setVoiceInputState('inactive');
    setIconColor('#0E8388');
  };

  const onSpeechResults = e => {
    console.log(e);
    setResult(e.value);
    setVoiceInputState('inactive');
  };

  const startRecognization = async () => {
    try {
      await Voice.start('en-US');
      setVoiceInputState('active');
      setResult([]);
    } catch (error) {
      console.log(error);
    }
  };

  const stopRecognization = async () => {
    try {
      await Voice.stop();
      await Voice.destroy();
      setVoiceInputState('inactive');
      setIconColor('#0E8388');
      setResult([]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.contentContainer}>
        <Text style={styles.headerText}>Speech to Text</Text>
        <Pressable
          style={styles.button}
          onPress={() => {
            startRecognization();
            setVoiceInputState('active');
          }}>
          <Icon name="microphone" size={100} color={iconColor} />
        </Pressable>
        {voiceInputState === 'active' && (
          <View style={styles.outputContainer}>
            <Text style={styles.text}>Listening</Text>
            <Pressable
              style={styles.stopButton}
              onPress={() => stopRecognization()}>
              <Text style={styles.text}>Stop</Text>
            </Pressable>
          </View>
        )}
        {result.length > 0 && (
          <View style={styles.outputContainer}>
            <Text style={styles.outputHeader}>Did you say?</Text>
            <View style={styles.scrollView}>
              <ScrollView >
                <View >
                  {result.map((item, i) => {
                    return (
                      <View key={i}>
                        <Text style={styles.text}>{item}</Text>
                      </View>
                    );
                  })}
                </View>
              </ScrollView>
              </View>
            <Text style={styles.text}>Could you give me a quick feedback?</Text>
            <Pressable style={[styles.button,styles.feedbackButon]} onPress={()=>navigation.navigate('Feedback')}>
              <Text style={styles.text}>Sure! lets do it</Text>
            </Pressable>
          </View>
        )}
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
    marginTop: '25%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 30,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
    marginVertical: 10,
  },
  outputContainer: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outputHeader: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
    marginTop: 50,
  },
  scrollView:{
    height:150,
  },
  button: {
    alignSelf: 'center',
    marginTop: 10,
  },
  stopButton: {
    height: 50,
    borderRadius: 10,
    width: 200,
    backgroundColor: 'red',
    alignItems: 'center',
  },
  feedbackButon: {
    height: 50,
    borderRadius: 10,
    width: 200,
    backgroundColor: '#26577C',
    alignItems: 'center',
  },
});
