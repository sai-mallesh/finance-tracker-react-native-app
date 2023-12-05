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
  getTransactionDataDb,
} from '../Utils';
import {useAuth} from '../providers/AuthProvider';
import {useAsyncStorageData} from '../providers/AsyncStorageDataProvider';

const TransactionScreen = () => {
  const {userId, userType} = useAuth();
  const [dbData, setDbData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [inputText, setInputText] = useState('');

  const {
    checkNetworkConnectivity,
    getData,
    setData,
    updateData,
    addToRequestQueue,
  } = useAsyncStorageData();

  async function fetchData() {
    const localTransLastUpdated = await getData('localTransactionsLastUpdated');
    const isConnected = await checkNetworkConnectivity();
    console.log('Here', userId, userType);
    if (isConnected && userType === 'hybrid') {
      const lastRefreshed = await getDataDB('user_data_last_refreshed', userId);
      if (lastRefreshed.error) {
        console.log(lastRefreshed.error);
        return;
      }
      var dbUpdatedTimestamp;
      if (lastRefreshed.data.length > 0) {
        dbUpdatedTimestamp = lastRefreshed.data[0].last_updated_timestamp;
      } else {
        dbUpdatedTimestamp = new Date();
      }
      const timestampDB = new Date(dbUpdatedTimestamp);
      const timestampLocal = new Date(localTransLastUpdated);
      if (timestampDB > timestampLocal) {
        await handleSyncData();
        const responseData = await getDataDB('transactions', userId);
        if (responseData.error) {
          console.error('Error fetching data:', responseData.error.message);
        } else {
          setDbData(responseData.data);
          await setData('transactions', responseData.data);
        }
        setData('localTransactionsLastUpdated', timestampDB);
      } else if (timestampDB < timestampLocal) {
        console.log('Local data needs to be synced');
        makeToastMessage(
          JSON.stringify(timestampDB) + JSON.stringify(timestampLocal),
        );
        const temp = await getData('transactions');
        if (temp === null) {
          const {data, error} = await getDataDB('transactions', userId);
          if (error) {
            console.error('Error fetching data:', error.message);
          } else {
            setDbData(data);
            await setData('transactions', data);
          }
          setData('localTransactionsLastUpdated', timestampDB);
          return;
        }
        setDbData(temp);
        await handleSyncData();
        setData('localTransactionsLastUpdated', timestampDB);
      } else {
        console.log('Here');
        const temp = await getData('transactions');
        console.log(temp);
        if (temp === null) {
          const {data, error} = await getDataDB('transactions', userId);
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
    } else if (!isConnected && userType === 'hybrid') {
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

  async function realTimeDBChanges(payload) {
    switch (payload.eventType) {
      case 'INSERT':
        const tempTransactions = await getData('transactions');
        var exists = tempTransactions.some(
          item => item.record === payload.new.record,
        );
        if (exists) {
          return;
        } else {
          const updatedDataAdd = await updateData(
            'transactions',
            payload.new,
            'add',
          );
          setDbData(updatedDataAdd);
        }
        break;

      case 'DELETE':
        const updatedDataRemove = await updateData(
          'transactions',
          {
            record: payload.old.record,
            last_updated: payload.commit_timestamp,
          },
          'remove',
        );
        setDbData(updatedDataRemove);
        break;
      case 'UPDATE':
        const updatedData = await updateData(
          'transactions',
          {
            record: payload.new.record,
            amount: payload.new.amount,
            last_updated: payload.new.last_updated,
          },
          'modify',
        );
        setDbData(updatedData);
        break;
    }
    setData('localTransactionsLastUpdated', payload.commit_timestamp);
  }

  useEffect(() => {
    fetchData();
    if (userType === 'hybrid') {
      supabase
        .channel('custom-filter-channel')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'transactions',
            filter: 'user_id=eq.' + userId,
          },
          payload => {
            console.log('Change received!', payload);
            realTimeDBChanges(payload);
          },
        )
        .subscribe();
      console.log('Refreshed');
    }
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
    const tempTransactions = await getData('transactions');
    var exists = tempTransactions.some(item => item.record === record);
    if (exists) {
      makeToastMessage('Record ' + record + ' already exists.');
      return;
    }
    if (isConnected && userType === 'hybrid') {
      const status = await addRecordDB({
        user_id: userId,
        record: record,
        amount: amount,
        last_updated: updatedTimeStamp,
      });
      if (status === 201) {
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
  const handleSyncData = async () => {
    try {
      const pendingRequests = await getData('requestQueue');
      var lenPendingRequests = pendingRequests.length;
      for (var i = 0; i < lenPendingRequests; i++) {
        const isConnected = await checkNetworkConnectivity();
        if (isConnected) {
          const curRequest = pendingRequests.shift();
          console.log('Current Request', curRequest, i);
          switch (curRequest.requestType) {
            case 'add':
              const status = await addRecordDB({
                user_id: userId,
                record: curRequest.record.record,
                amount: curRequest.record.amount,
                last_updated: curRequest.record.last_updated,
              });
              const localLastUpdate = new Date(curRequest.record.last_updated);
              if (status === 409) {
                const res = await getTransactionDataDb(
                  userId,
                  curRequest.record.record,
                );
                var dbUpdateTime = new Date(res.data[0].last_updated);
                console.log(dbUpdateTime, localLastUpdate);
                if (dbUpdateTime > localLastUpdate) {
                  console.log(
                    dbUpdateTime > localLastUpdate,
                    'DB IS MORE RECENT',
                  );
                  const updatedData = await updateData(
                    'transactions',
                    {
                      record: res.data[0].record,
                      amount: res.data[0].amount,
                      last_updated: dbUpdateTime,
                    },
                    'modify',
                  );
                  setDbData(updatedData);
                } else if (dbUpdateTime < localLastUpdate) {
                  console.log(
                    dbUpdateTime,
                    localLastUpdate,
                    'LOCAL IS MORE RECENT',
                  );
                  await updateRecordDB(
                    userId,
                    {
                      amount: curRequest.record.amount,
                      last_updated: curRequest.record.last_updated,
                    },
                    curRequest.record.record,
                  );
                }
              }
              break;

            case 'remove':
              console.log(curRequest.record);
              makeToastMessage(
                'Running delte req:' + JSON.stringify(curRequest.record),
              );
              await removeRecordDB(
                userId,
                curRequest.record,
                curRequest.last_updated,
              );
              break;

            case 'modify':
              console.log(userId, curRequest.record);
              const res = await getTransactionDataDb(userId, curRequest.record);
              const localLastUpdate1 = new Date(curRequest.last_updated);
              var dbUpdateTime = new Date(res.data[0].last_updated);
              console.log('HERE', dbUpdateTime, localLastUpdate1);
              if (dbUpdateTime > localLastUpdate1) {
                console.log(
                  dbUpdateTime > localLastUpdate1,
                  'DB IS MORE RECENT',
                );
                makeToastMessage('DB IS MORE RECENT');
                const updatedData = await updateData(
                  'transactions',
                  {
                    record: res.data[0].record,
                    amount: res.data[0].amount,
                    last_updated: dbUpdateTime,
                  },
                  'modify',
                );
                setDbData(updatedData);
              } else if (dbUpdateTime < localLastUpdate1) {
                console.log(
                  dbUpdateTime,
                  localLastUpdate1,
                  'LOCAL IS MORE RECENT',
                );
                makeToastMessage('local is more recent');
                await updateRecordDB(
                  userId,
                  {
                    amount: curRequest.amount,
                    last_updated: curRequest.last_updated,
                  },
                  curRequest.record,
                );
              }
              break;
          }
        } else {
          makeToastMessage('Internet issue');
          i -= 1;
        }
      }
      setData('requestQueue', []);
    } catch (e) {
      makeToastMessage(JSON.stringify(e));
    }
  };

  async function checkLocalDBUpdateTime() {
    const localTransLastUpdated = await getData('localTransactionsLastUpdated');
    const pendingRequests = await getData('requestQueue');
    console.log(localTransLastUpdated, pendingRequests);
    makeToastMessage(
      JSON.stringify(localTransLastUpdated) + JSON.stringify(pendingRequests),
    );
  }

  async function handleSyncDBData() {
    const responseData = await getDataDB('transactions', userId);
    if (responseData.error) {
      console.error('Error fetching data:', responseData.error.message);
    } else {
      setDbData(responseData.data);
      await setData('transactions', responseData.data);
    }
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
                    handleSyncData();
                    break;
                  case 'syncdb':
                    handleSyncDBData();
                    break;
                  case 'check':
                    checkLocalDBUpdateTime();
                    break;
                  case 'clear':
                    setData('requestQueue', []);
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

export default TransactionScreen;

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
