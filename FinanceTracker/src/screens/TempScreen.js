/* eslint-disable prettier/prettier */
import {StyleSheet, Text, View, Pressable, ToastAndroid} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useAsyncStorageData} from '../providers/AsyncStorageDataProvider';
import supabase from '../../config/supabaseClient';

const TempScreen = ({navigation}) => {
  const [localDBdata, setLocalDbData] = useState([]);
  const [loading, setLoading] = useState(true);

  const {saveDataToAsyncStorage, pushDataToSupabase, getData} =
    useAsyncStorageData();

  const dataToSave = [
    {name: 'abc345', pos: 45},
    {name: 'abc45', pos: 56},
    {name: 'abc6', pos: 66},
  ];

  async function fetchData() {
    const {data, error} = await supabase.from('dump_table').select('*');
    if (error) {
      console.error('Error fetching data:', error.message);
    } else {
      setLocalDbData(data);
    }
  }
  useEffect(() => {
    fetchData();
    setLoading(false);
  }, []);

  async function test() {
    const s = await getData();
    for (var i = 0; i < s.length; i++) {
      setLocalDbData([...localDBdata, s[i]]);
    }
    console.log('Line 25', s);
  }

  return (
    <View>
      <Pressable
        onPress={() => {
          saveDataToAsyncStorage('your-data-key', dataToSave);
          test();
        }}>
        <Text>Push Data Local</Text>
      </Pressable>
      <Pressable
        onPress={() => {
          pushDataToSupabase();
        }}>
        <Text>Push Data Global</Text>
      </Pressable>
      <Pressable onPress={() => test()}>
        <Text>Check Local dData</Text>
      </Pressable>
      {!loading &&
        localDBdata.length > 0 &&
        localDBdata.map((item, i) => {
          return (
            <View key={i}>
              <Text>
                name: {item.name} {item.pos}
              </Text>
            </View>
          );
        })}
    </View>
  );
};

export default TempScreen;
