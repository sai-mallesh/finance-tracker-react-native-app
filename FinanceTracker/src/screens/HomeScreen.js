/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  TextInput,
  StyleSheet,
  Text,
  Pressable,
  View,
  ToastAndroid,
  ScrollView,
  Modal,
} from 'react-native';
import supabase from '../../config/supabaseClient';
import Icon from 'react-native-vector-icons/FontAwesome';

const HomeScreen = () => {
  const [dbData, setDbData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [modalVisible, setModalVisible] = useState(true);

  async function fetchData() {
    const {data, error} = await supabase.from('records_table').select('*');
    if (error) {
      console.error('Error fetching data:', error.message);
    } else {
      console.log('Fetched data:', data);
      setDbData(data);
      setCount(dbData.length + 1);
    }
  }
  useEffect(() => {
    fetchData();
    setLoading(false);
  }, [dbData]);

  const toastError = () => {
    ToastAndroid.showWithGravity(
      'There was an error',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
  };

  const elementExists = element => {
    var hasMatch = false;
    for (var index = 0; index < dbData.length; ++index) {
      var item = dbData[index];
      if (item.record === element) {
        hasMatch = true;
        break;
      }
    }
    return hasMatch;
  };

  const addRecord = async (record, amount) => {
    const {status} = await supabase
      .from('records_table')
      .insert({record: record, amount: amount});
    if (status === 201) {
      ToastAndroid.showWithGravity(
        'Added Item',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      setDbData([...dbData, {id: count, record: record, amount: amount}]);
      setCount(count + 1);
      return;
    }
    console.log(status);
    toastError();
    return;
  };

  const removeRecord = async itemToRemove => {
    if (elementExists(itemToRemove)) {
      const {status} = await supabase
        .from('records_table')
        .delete()
        .eq('record', itemToRemove);
      if (status === 204) {
        ToastAndroid.showWithGravity(
          'Removed Item ' + itemToRemove,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        setDbData(dbData.filter(item => item.record !== itemToRemove));
        return;
      }
      console.log(status);
      toastError();
      return;
    }
    ToastAndroid.showWithGravity(
      'Item not found',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
  };

  const modifyRecord = async (itemToModiy, newValue) => {
    if (elementExists(itemToModiy)) {
      var index = dbData.findIndex(element => element.record === itemToModiy);
      dbData[index].quantity = newValue;
      setDbData(dbData);
      const {status} = await supabase
        .from('records_table')
        .update({amount: newValue})
        .eq('record', itemToModiy);
      if (status === 204) {
        ToastAndroid.showWithGravity(
          'Modified Item ' + itemToModiy,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        return;
      }
      console.log(status);
      toastError();
      return;
    }
    ToastAndroid.showWithGravity(
      'Item not found',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
  };

  const [inputText, setInputText] = useState('');
  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.centeredView}>
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalHeaderText}>Command</Text>
              <Text style={styles.modalCommands}>
                add {'<something>'} {'<amount>'}
              </Text>
              <Text style={styles.modalCommands}>
                modify {'<something>'} {'<amount>'}
              </Text>
              <Text style={styles.modalCommands}>remove {'<something>'}</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}>
                <Text style={styles.textStyle}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
      <View style={styles.contentContainer}>
        <ScrollView style={[styles.scrollView]}>
          {!loading &&
            dbData.length > 0 &&
            dbData.map((item, i) => {
              return (
                <View key={i} style={styles.card}>
                  <Text style={styles.record}>Record: {item.record}</Text>
                  <Text style={styles.record}>Amount: {item.amount}</Text>
                </View>
              );
            })}
        </ScrollView>
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.inputContainer}>
          <Pressable onPress={() => setModalVisible(true)}>
            <Icon name="info-circle" size={25} color="#ffffff" />
          </Pressable>
          <TextInput
            onChangeText={setInputText}
            placeholder='Enter the command...'
            placeholderTextColor="#EEEDED"
            value={inputText}
            style={styles.textInput}
          />
          <Pressable
            style={({pressed}) => [
              {
                backgroundColor: pressed ? '#64CCC5' : '#176B87',
              },
              styles.wrapperCustom,
            ]}
            onPress={() => {
              if (inputText !== '') {
                var inputTextSplit = inputText.split(' ');
                switch (inputTextSplit[0].toLowerCase()) {
                  case 'add':
                    addRecord(inputTextSplit[1], inputTextSplit[2]);
                    break;
                  case 'remove':
                    removeRecord(inputTextSplit[1]);
                    break;
                  case 'modify':
                    modifyRecord(inputTextSplit[1], inputTextSplit[2]);
                    break;
                  default:
                    ToastAndroid.showWithGravity(
                      'Invalid Command',
                      ToastAndroid.SHORT,
                      ToastAndroid.CENTER,
                    );
                    break;
                }

                setInputText('');
              }
            }}>
            <Icon name="paper-plane" size={20} color="#ffffff" />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#151515',
  },
  contentContainer: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  scrollView: {
    width: '100%',
    marginBottom: 80,
  },
  card: {
    backgroundColor: 'grey',
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderRadius: 10,
  },
  textInput: {
    height: 40,
    width: '75%',
    borderWidth: 1,
    marginVertical: 10,
    borderRadius: 15,
    padding: 10,
    color: '#fff',
    backgroundColor: '#363636',
    borderColor: '#0E8388',
  },

  bottomContainer: {
    position: 'absolute',
    backgroundColor: '#151515',
    justifyContent: 'space-between',
    width: '100%',
    bottom: 0,
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
    height: 200,
  },

  button: {
    marginTop: 10,
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#0E8388',
  },

  modalHeaderText: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
  },
  modalCommands: {
    fontSize: 15,
    marginVertical: 5,
    color:'black',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginVertical: 0,
  },
  record: {
    fontSize: 20,
    color: '#ffffff',
  },

  wrapperCustom: {
    height: 40,
    borderRadius: 8,
    padding: 10,
  },

  text: {
    fontSize: 16,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
