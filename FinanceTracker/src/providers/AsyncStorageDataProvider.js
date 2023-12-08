import React, {createContext, useContext, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import supabase from '../../config/supabaseClient';
import NetInfo from '@react-native-community/netinfo';
import {makeToastMessage} from '../Utils';

const AsyncStorageDataContext = createContext();

export const AsyncStorageDataProvider = ({children}) => {
  const [spent, setSpent] = useState(0);

  const [groupsInfo, setGroupsInfo] = useState([]);

  const saveDataToAsyncStorage = async (key, data) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(error);
    }
  };

  const checkNetworkConnectivity = async () => {
    const state = await NetInfo.fetch();
    return state.isConnected;
  };

  const getData = async key => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      makeToastMessage(e);
    }
  };

  const setData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.log(e);
    }
  };

  const updateData = async (key, value, type) => {
    try {
      let data = await getData(key);
      switch (type) {
        case 'add':
          data.push(value);
          makeToastMessage('Added Data : ' + value.record);
          break;
        case 'remove':
          data = data.filter(item => item.record !== value.record);
          makeToastMessage('Removed Data : ' + value.record);
          break;
        case 'modify':
          let index = data.findIndex(
            element => element.record === value.record,
          );
          data[index].amount = value.amount;
          makeToastMessage('Modified Data : ' + value.record);
          break;
      }
      setData(key, data);
      setData('localTransactionsLastUpdated', value.last_updated);
      const totalAmount = data.reduce((acc, entry) => acc + entry.amount, 0);
      setSpent(totalAmount);
      return data;
    } catch (error) {
      makeToastMessage(error);
    }
  };

  const addToRequestQueue = async value => {
    try {
      let data = await getData('requestQueue');
      data.push(value);
      makeToastMessage('Added to request Queue');
      setData('requestQueue', data);
    } catch (error) {
      makeToastMessage(error);
    }
  };

  const pushDataToSupabase = async () => {
    try {
      const isConnected = await checkNetworkConnectivity();
      if (isConnected) {
        const data = await AsyncStorage.getItem('your-data-key');
        if (data) {
          const jsonData = JSON.parse(data);
          const {data: response, error} = await supabase
            .from('dump_table')
            .upsert(jsonData);
          if (error) {
            console.error('Error pushing data to Supabase:', error);
            makeToastMessage('Error pushing data to Supabase:' + error.message);
          } else {
            console.log('Data pushed to Supabase successfully.', response);
            makeToastMessage(
              'Data pushed to Supabase successfully.' + response,
            );
            // Optionally, you can remove the data from AsyncStorage after pushing.
            await AsyncStorage.removeItem('your-data-key');
          }
        }
      }
    } catch (error) {
      console.error('Error checking network connectivity:', error);
      makeToastMessage('Error checking network connectivity:' + error);
    }
  };

  return (
    <AsyncStorageDataContext.Provider
      value={{
        saveDataToAsyncStorage,
        pushDataToSupabase,
        checkNetworkConnectivity,
        getData,
        setData,
        updateData,
        addToRequestQueue,
        spent,
        setSpent,
        groupsInfo,
        setGroupsInfo,
      }}>
      {children}
    </AsyncStorageDataContext.Provider>
  );
};

export const useAsyncStorageData = () => {
  return useContext(AsyncStorageDataContext);
};
