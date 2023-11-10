/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  TextInput,
  StyleSheet,
  Text,
  Pressable,
  View,
  ScrollView,
  Modal,
} from 'react-native';
import supabase from '../../config/supabaseClient';
import Icon from 'react-native-vector-icons/FontAwesome';
import {generateRandomId, makeToastMessage} from '../Utils';
import {useAuth} from '../providers/AuthProvider';
import {useAsyncStorageData} from '../providers/AsyncStorageDataProvider';

const HomeScreen = () => {
  const [dbData, setDbData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [inputText, setInputText] = useState('');
  const [userId, setUserId] = useState();
  const [userType, setUserType] = useState();

  const {getUserData} = useAuth();
  const {
    checkNetworkConnectivity,
    getData,
    setData,
    updateData,
    addToRequestQueue,
  } = useAsyncStorageData();

  async function fetchData() {
    const userIdTemp = await getUserData('userId');
    const userTypeTemp = await getUserData('userType');
    setUserType(userTypeTemp);
    const isConnected = await checkNetworkConnectivity();
    if (isConnected && userTypeTemp === 'hybrid') {
      setUserId(userIdTemp);
      const {data, error} = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userIdTemp);
      if (error) {
        console.error('Error fetching data:', error.message);
      } else {
        setDbData(data);
        await setData('transactions', data);
      }
      return;
    }
    try {
      const existingLocalData = await getData('transactions');
      if (existingLocalData === null) {
        await setData('transactions', []);
        setDbData([]);
        return;
      }
      setDbData(existingLocalData);
    } catch (e) {
      makeToastMessage(e);
    }
  }

  useEffect(() => {
    fetchData();
    setLoading(false);
  }, []);

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
    const isConnected = await checkNetworkConnectivity();
    const recordToSave = {
      id: generateRandomId(),
      record: record,
      amount: amount,
    };
    if (isConnected && userType === 'hybrid') {
      const {status} = await supabase.from('transactions').insert({
        user_id: userId,
        record: record,
        amount: amount,
        last_updated: new Date().toISOString(),
      });
      if (status === 201) {
        const updatedData = await updateData(
          'transactions',
          recordToSave,
          'add',
        );
        setDbData(updatedData);
        return;
      }
      makeToastMessage('There was an error');
      return;
    } else if (!isConnected && userType === 'hybrid') {
      await addToRequestQueue({
        requestType: 'add',
        record: record,
        amount: amount,
        last_updated: new Date().toISOString(),
      });
      const temp1 = await getData('requestQueue');
      makeToastMessage(JSON.stringify(temp1));
    }
    const updatedData = await updateData('transactions', recordToSave, 'add');
    setDbData(updatedData);
  };

  const removeRecord = async itemToRemove => {
    if (elementExists(itemToRemove)) {
      const isConnected = await checkNetworkConnectivity();
      if (isConnected && userType === 'hybrid') {
        const {status} = await supabase
          .from('transactions')
          .delete()
          .eq('user_id', userId)
          .eq('record', itemToRemove);
        if (status === 204) {
          const updatedData = await updateData(
            'transactions',
            itemToRemove,
            'remove',
          );
          setDbData(updatedData);
          return;
        }
        console.log(status);
        makeToastMessage('There was an error');
        return;
      } else if (!isConnected && userType === 'hybrid') {
        await addToRequestQueue({
          requestType: 'remove',
          record: itemToRemove,
          last_updated: new Date().toISOString(),
        });
      }
      const updatedData = await updateData(
        'transactions',
        itemToRemove,
        'remove',
      );
      setDbData(updatedData);
      return;
    }
    makeToastMessage('Item not found');
  };

  const modifyRecord = async (itemToModiy, newValue) => {
    if (elementExists(itemToModiy)) {
      const isConnected = await checkNetworkConnectivity();
      if (isConnected && userType === 'hybrid') {
        const {status} = await supabase
          .from('transactions')
          .update({amount: newValue})
          .eq('user_id', userId)
          .eq('record', itemToModiy);
        if (status === 204) {
          makeToastMessage('Modified Item ' + itemToModiy);
          const updatedData = await updateData(
            'transactions',
            {record: itemToModiy, amount: newValue},
            'modify',
          );
          setDbData(updatedData);
          return;
        }
        console.log(status);
        makeToastMessage('There was an error');
        return;
      } else if (!isConnected && userType === 'hybrid') {
        await addToRequestQueue({
          requestType: 'add',
          record: itemToModiy,
          amount: newValue,
          last_updated: new Date().toISOString(),
        });
      }
      const updatedData = await updateData(
        'transactions',
        {record: itemToModiy, amount: newValue},
        'modify',
      );
      setDbData(updatedData);
      return;
    }
    makeToastMessage('Item not found');
  };

  const handleSyncData = async () => {
    const pendingRequests = await getData('requestQueue');
    makeToastMessage(JSON.stringify(pendingRequests));
  };

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
            placeholder="Enter the command..."
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
                    var recordText = inputTextSplit.slice(1, -1).join(' ');
                    var amount = parseFloat(
                      inputTextSplit[inputTextSplit.length - 1],
                    );
                    typeof amount === 'number'
                      ? addRecord(recordText, amount)
                      : makeToastMessage('Amount should be a number');
                    break;
                  case 'remove':
                    var recordText = inputTextSplit.slice(1).join(' ');
                    removeRecord(recordText);
                    break;
                  case 'modify':
                    var recordText = inputTextSplit.slice(1, -1).join(' ');
                    var newAmount = parseFloat(
                      inputTextSplit[inputTextSplit.length - 1],
                    );
                    typeof newAmount === 'number'
                      ? modifyRecord(recordText, newAmount)
                      : makeToastMessage('Amount should be a number');
                    break;
                  case 'sync_data':
                    handleSyncData();
                    break;
                  default:
                    makeToastMessage('Invalid Command');
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
    color: 'black',
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
