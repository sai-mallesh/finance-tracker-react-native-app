/* eslint-disable prettier/prettier */
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Pressable,
  ScrollView,
  Modal,
  TextInput,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import supabase from '../../config/supabaseClient';

const FeedbackScreen = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [userFeedback, setUserFeedback] = useState('');
  const [name, setName] = useState('');
  const [counter, setCounter] = useState(0);

  const getFeedback = async () => {
    let {data, error} = await supabase.from('feedback').select('*');
    if (error) {
      console.log(error.message);
      return;
    }
    setFeedbackData(data);
    setCounter(data.length + 1);
    console.log(data);
  };
  useEffect(() => {
    getFeedback();
  }, []);

  const addFeedback = async () => {
    var formData = {
      name: name === '' ? null : name,
      message: userFeedback,
    };
    setFeedbackData([...feedbackData, formData]);
    const {status} = await supabase.from('feedback').insert(formData);
    if (status === 201) {
      ToastAndroid.showWithGravity(
        'Thank you for your feedback.',
        ToastAndroid.LONG,
        ToastAndroid.CENTER,
      );
      setCounter(counter + 1);
      return;
    }
    ToastAndroid.showWithGravity(
      'There was an error',
      ToastAndroid.LONG,
      ToastAndroid.CENTER,
    );
  };
  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.centeredView}>
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TextInput
                placeholder={'Name (Optional)'}
                placeholderTextColor="grey"
                style={styles.input}
                value={name}
                onChangeText={setName}
              />
              <TextInput
                placeholder={'Feedback'}
                placeholderTextColor="grey"
                multiline={true}
                numberOfLines={4}
                style={[styles.input, styles.feedbackInput]}
                value={userFeedback}
                onChangeText={setUserFeedback}
              />
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  if (userFeedback === '') {
                    ToastAndroid.showWithGravity(
                      'Please enter the feedback.',
                      ToastAndroid.LONG,
                      ToastAndroid.CENTER,
                    );
                    return;
                  }
                  addFeedback();
                  setUserFeedback('');
                  setName('');
                  setModalVisible(!modalVisible);
                }}>
                <Text style={styles.textStyle}>Submit</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.headerText}>What others said</Text>
        <ScrollView style={[styles.scrollView]}>
          {feedbackData.length > 0 &&
            feedbackData.map((item, i) => {
              return (
                <View key={i} style={styles.card}>
                  <Text style={styles.feedbackText}>{item.message}</Text>
                  <Text style={styles.feedbackText}>
                    - {item.name === null ? 'Anonymous' : item.name}
                  </Text>
                </View>
              );
            })}
            {feedbackData.length === 0 && (
                <Text style={styles.noContentText}>Nothing to show here...</Text>
            )}
        </ScrollView>
      </View>
      <View style={styles.bottomContainer}>
        <Pressable
          style={styles.feedbackButton}
          onPress={() => setModalVisible(true)}>
          <Text style={styles.feedbackButtonText}>Write Feedback</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default FeedbackScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#151515',
  },
  contentContainer: {
    height:'100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noContentText:{
    marginTop:'50%',
    color:'#ffffff',
    fontSize:30,
    alignContent:'center',
    alignSelf:'center',
    justifyContent:'space-around',
  },
  headerText: {
    fontSize: 25,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'center',
  },
  scrollView:{
    width: '100%',
    marginBottom: 80,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    width: '100%',
    backgroundColor: '#151515',
  },
  feedbackButton: {
    backgroundColor: '#0E8388',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 20,
  },
  feedbackButtonText: {
    alignSelf: 'center',
    fontSize: 20,
    color: '#ffffff',
  },
  card: {
    backgroundColor: 'grey',
    padding: 10,
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 10,
  },
  feedbackText: {
    fontSize: 20,
    color: '#ffffff',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  modalView: {
    margin: 20,
    backgroundColor: '#F5F7F8',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    width: '90%',
    height: 240,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#0E8388',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    height: 40,
    width: '100%',
    borderWidth: 1,
    marginVertical: 10,
    borderRadius: 10,
    padding: 10,
    color: '#000000',
    backgroundColor: '#fffff',
    borderColor: '#0E8388',
  },
  feedbackInput: {
    minHeight: 85,
    borderRadius: 15,
  },
});
