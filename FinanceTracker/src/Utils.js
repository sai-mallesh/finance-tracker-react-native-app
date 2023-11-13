/* eslint-disable prettier/prettier */
import {ToastAndroid} from 'react-native';
import supabase from '../config/supabaseClient';

export const makeToastMessage = message => {
  ToastAndroid.showWithGravity(
    message,
    ToastAndroid.SHORT,
    ToastAndroid.CENTER,
  );
};

export const generateRandomId = () => {
  return Array.from({length: 8}, () => Math.random().toString(36)[2]).join('');
};

export const addRecordDB = async recordToAdd => {
  const {status} = await supabase.from('transactions').insert(recordToAdd);
  console.log(status, recordToAdd);
  return status;
};

export const removeRecordDB = async (
  userId,
  itemToRemove,
  updatedTimeStamp,
) => {
  console.log(itemToRemove);
  const s = await supabase
    .from('transactions')
    .delete()
    .eq('user_id', userId)
    .eq('record', itemToRemove);
  console.log(s, updatedTimeStamp);
  const {status} = await supabase
    .from('user_data_last_refreshed')
    .update({last_updated_timestamp: updatedTimeStamp})
    .eq('user_id', userId);
  console.log(status);
  return status;
};

export const updateRecordDB = async (userId, newValue, recordToUpdate) => {
  const {status} = await supabase
    .from('transactions')
    .update(newValue)
    .eq('user_id', userId)
    .eq('record', recordToUpdate);
  return status;
};

export const getDataDB = async (table, userId) => {
  const response = await supabase.from(table).select('*').eq('user_id', userId);
  return response;
};
