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
import {
  generateRandomId,
  makeToastMessage,
  addRecordDB,
  removeRecordDB,
  updateRecordDB,
  getDataDB,
} from '../Utils';
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
    const localTransLastUpdated = await getData('localTransactionsLastUpdated');
    setUserType(userTypeTemp);
    const isConnected = await checkNetworkConnectivity();
    if (isConnected && userTypeTemp === 'hybrid') {
      setUserId(userIdTemp);
      const lastRefreshed = await getDataDB(
        'user_data_last_refreshed',
        userIdTemp,
      );
      if (lastRefreshed.error) {
        console.log(lastRefreshed.error);
        return;
      }
      const dbUpdatedTimestamp = lastRefreshed.data[0].last_updated_timestamp;
      const timestampDB = new Date(dbUpdatedTimestamp);
      const timestampLocal = new Date(localTransLastUpdated);
      if (timestampDB > timestampLocal) {
        const responseData = await getDataDB('transactions', userIdTemp);
        if (responseData.error) {
          console.error('Error fetching data:', responseData.error.message);
        } else {
          setDbData(responseData.data);
          await setData('transactions', responseData.data);
        }
      } else if (timestampDB < timestampLocal) {
        console.log('Local data needs to be synced');
        const temp = await getData('transactions');
        if (temp === null) {
          const {data, error} = await getDataDB('transactions', userIdTemp);
          if (error) {
            console.error('Error fetching data:', error.message);
          } else {
            setDbData(data);
            await setData('transactions', data);
          }
          return;
        }
        setDbData(temp);
        handleSyncData(userIdTemp,userTypeTemp);
      } else {
        console.log('Here');
        const temp = await getData('transactions');
        console.log(temp);
        if (temp === null) {
          const {data, error} = await getDataDB('transactions', userIdTemp);
          if (error) {
            console.error('Error fetching data:', error.message);
          } else {
            setDbData(data);
            await setData('transactions', data);
          }
          return;
        }
        setDbData(temp);
      }
    } else if (!isConnected && userTypeTemp === 'hybrid') {
      setDbData(await getData('transactions'));
    } else {
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
  }

  useEffect(() => {
    fetchData();
    console.log('Refreshed');
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
    var updatedTimeStamp = new Date().toISOString();
    const recordToSave = {
      id: generateRandomId(),
      record: record,
      amount: amount,
      last_updated: updatedTimeStamp,
    };
    if (isConnected && userType === 'hybrid') {
      const status = await addRecordDB({
        user_id: userId,
        record: record,
        amount: amount,
        last_updated: updatedTimeStamp,
      });
      if (status === 201) {
        const updatedData = await updateData(
          'transactions',
          recordToSave,
          'add',
        );
        setDbData(updatedData);
        setData('localTransactionsLastUpdated', updatedTimeStamp);
        return;
      }
      console.log(status);
      makeToastMessage('There was an error');
      return;
    } else if (!isConnected && userType === 'hybrid') {
      await addToRequestQueue({requestType: 'add', record: recordToSave});
    }
    const updatedData = await updateData('transactions', recordToSave, 'add');
    setDbData(updatedData);
    return;
  };

  const removeRecord = async itemToRemove => {
    if (elementExists(itemToRemove)) {
      const isConnected = await checkNetworkConnectivity();
      var updatedTimeStamp = new Date().toISOString();
      if (isConnected && userType === 'hybrid') {
        const status = await removeRecordDB(
          userId,
          itemToRemove,
          updatedTimeStamp,
        );
        if (status === 204) {
          const updatedData = await updateData(
            'transactions',
            {record: itemToRemove, last_updated: updatedTimeStamp},
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
          last_updated: updatedTimeStamp,
        });
      }
      const updatedData = await updateData(
        'transactions',
        {record: itemToRemove, last_updated: updatedTimeStamp},
        'remove',
      );
      setDbData(updatedData);
      return;
    }
    makeToastMessage('Item not found');
  };

  const modifyRecord = async (itemToModiy, newValue) => {
    if (elementExists(itemToModiy)) {
      var updatedTimeStamp = new Date().toISOString();
      const isConnected = await checkNetworkConnectivity();
      if (isConnected && userType === 'hybrid') {
        const status = await updateRecordDB(
          userId,
          {amount: newValue, last_updated: updatedTimeStamp},
          itemToModiy,
        );
        if (status === 204) {
          const updatedData = await updateData(
            'transactions',
            {
              record: itemToModiy,
              amount: newValue,
              last_updated: updatedTimeStamp,
            },
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
          requestType: 'modify',
          record: itemToModiy,
          amount: newValue,
          last_updated: updatedTimeStamp,
        });
      }
      const updatedData = await updateData(
        'transactions',
        {record: itemToModiy, amount: newValue, last_updated: updatedTimeStamp},
        'modify',
      );
      setDbData(updatedData);
      return;
    }
    makeToastMessage('Item not found');
  };

  const handleSyncData = async (userId_,userType_) => {
    const pendingRequests = await getData('requestQueue');
    var modifiedRecords = [
      ...new Set(
        pendingRequests
          .filter(item => item.type !== 'add')
          .map(item => item.record),
      ),
    ];
    console.log(modifiedRecords, pendingRequests);
    const isConnected = await checkNetworkConnectivity();
    var tempData = [];
    if (isConnected && userType_ === 'hybrid') {
      if (modifiedRecords.length > 0) {
        const {data, error} = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', userId_)
          .in('record', modifiedRecords);
        console.log('Line 255', data);
        var tempData = data;
        if (error) {
          console.error('Error fetching data:', error.message);
          return;
        }
      }
      var lenPendingRequests = pendingRequests.length;
      for (var i = 0; i < lenPendingRequests; i++) {
        const curRequest = pendingRequests.shift();
        console.log('Current Request', curRequest, i);
        const localLastUpdate = new Date(curRequest.record.last_updated);
        switch (curRequest.requestType) {
          case 'add':
            const status = await addRecordDB({
              user_id: userId_,
              record: curRequest.record.record,
              amount: curRequest.record.amount,
              last_updated: curRequest.record.last_updated,
            });
            console.log(status);
            break;

          case 'remove':
            console.log(curRequest.record);
            await removeRecordDB(
              userId_,
              curRequest.record,
              curRequest.last_updated,
            );
            break;

          case 'modify':
            await updateRecordDB(
              userId_,
              {
                amount: curRequest.amount,
                last_updated: curRequest.last_updated,
              },
              curRequest.record,
            );
            break;
          default:
            makeToastMessage('Invalid Command');
            break;
        }
      }
      setData('requestQueue', []);
    } else {
      console.log(userId_, pendingRequests);
      makeToastMessage('Not Conncted to internet');
    }
  };

  async function checkLocalDBUpdateTime() {
    const localTransLastUpdated = await getData('localTransactionsLastUpdated');
    console.log(localTransLastUpdated);
  }

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
                  case 'sync':
                    handleSyncData(userId,userType);
                    break;
                  case 'check':
                    checkLocalDBUpdateTime();
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
