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
} from 'react-native';
import supabase from '../../config/supabaseClient';
import Card from '../components/Card';

const HomeScreen = () => {
  const [dbData, setDbData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);

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
  }, []);

  const addRecord = async (record, quantity) => {
    setDbData([...dbData, {id: count, record: record, quantity: quantity}]);
    await supabase
      .from('records_table')
      .insert({id: count, record: record, quantity: quantity});
  };

  const removeRecord = async itemToRemove => {
    console.log(itemToRemove);

    setDbData(dbData.filter(item => item.record !== itemToRemove));
    await supabase.from('records_table').delete().eq('record', itemToRemove);
  };

  const modifyRecord = async (itemToModiy, newValue) => {
    console.log(itemToModiy);
    await supabase
      .from('records_table')
      .update({quantity: newValue})
      .eq('record', itemToModiy);
  };

  const [inputText, setInputText] = useState('');
  return (
    <SafeAreaView style={styles.containerMain}>
      {!loading && (
        <View style={styles.listContainer}>
          <Card data={dbData} />
        </View>
      )}

      <View style={styles.bottomContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            onChangeText={setInputText}
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
                switch (inputTextSplit[0]) {
                  case 'add':
                    addRecord(inputTextSplit[1], inputTextSplit[2]);
                    setCount(count + 1);
                    ToastAndroid.showWithGravity(
                      'Added Item',
                      ToastAndroid.SHORT,
                      ToastAndroid.CENTER,
                    );
                    break;
                  case 'remove':
                    ToastAndroid.showWithGravity(
                      'Removed Item',
                      ToastAndroid.SHORT,
                      ToastAndroid.CENTER,
                    );
                    removeRecord(inputTextSplit[1]);
                    break;
                  case 'modify':
                    ToastAndroid.showWithGravity(
                      'Modify Item',
                      ToastAndroid.SHORT,
                      ToastAndroid.CENTER,
                    );
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
            <Text style={styles.text}>Add</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  listContainer: {
    flex: 1,
    width: '100%',
  },

  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
  },

  textInput: {
    height: 40,
    width: '82.5%',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },

  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'white',
  },

  inputContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginVertical: 10,
  },

  wrapperCustom: {
    height: 40,
    borderRadius: 8,
    padding: 10,
  },

  text: {
    fontSize: 16,
  },
});
