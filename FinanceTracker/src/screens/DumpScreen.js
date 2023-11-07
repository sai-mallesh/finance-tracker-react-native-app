/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import 'react-native-url-polyfill/auto';
import {
  SafeAreaView,
  TextInput,
  FlatList,
  StyleSheet,
  Text,
  Pressable,
  View,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import supabase from './config/supabaseClient';

const Item = ({title, quantity}) => (
  <View style={styles.item}>
    <Text style={styles.title}>
      Record: {title} Quantity: {quantity}
    </Text>
  </View>
);

export default function App() {
  const [data, setData] = useState([]);
  const addRecord = async (record, quantity) => {
    setData([...data, {id: count, record: record, quantity: quantity}]);
    await supabase
      .from('records_table')
      .insert({id: count, record: record, quantity: quantity});
  };
  const [loading, setLoading] = useState(false);

  async function fetchSomeData() {
    const {dbData, error} = await supabase.from('records_table').select('*');
    if (error) {
      console.error('Error fetching data:', error.message);
      setData([]);
    } else {
      console.log('Fetched data:', dbData);
      setData(dbData);
    }
  }
  useEffect(() => {
    fetchSomeData();
    setLoading(true);
  }, []);

  console.log(data);

  const removeRecord = async itemToRemove => {
    console.log(itemToRemove);

    setData(data.filter(item => item.record !== itemToRemove));
    await supabase.from('records_table').delete().eq('record', itemToRemove);
  };

  const modifyRecord = async (itemToModiy, newValue) => {
    console.log(itemToModiy);
    await supabase
      .from('records_table')
      .update({quantity: newValue})
      .eq('record', itemToModiy);
  };

  let count = data.length + 1;
  const [inputText, setInputText] = useState('');
  return (
    <SafeAreaView style={styles.containerMain}>
      {loading && (
        <ScrollView style={styles.listContainer}>
          <View style={styles.listContainer}>
            <FlatList
              data={data}
              renderItem={({item}) => (
                <Item title={item.record} quantity={item.quantity} />
              )}
            />
          </View>
        </ScrollView>
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
                    count += 1;
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
}

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
