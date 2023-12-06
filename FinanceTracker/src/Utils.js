import {ToastAndroid} from 'react-native';
import supabase from '../config/supabaseClient';

export const currency = [
  {name: 'USD - $', symbol: '$'},
  {name: 'INR - ₹', symbol: '₹'},
  {name: 'EURO - €', symbol: '€'},
  {name: 'POUND - £', symbol: '£'},
  {name: 'YEN - ¥', symbol: '¥'},
];

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

export const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
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

export const getTransactionDataDb = async (userId, record) => {
  const response = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .eq('record', record);
  console.log('Response:', response);
  return response;
};

export const addRecordToDB = async (table, record) => {
  const {status} = await supabase.from(table).insert(record);
  return status;
};

export const getDataFromDB = async (table, userId, columns, primaryKey) => {
  const response = await supabase
    .from(table)
    .select(columns)
    .eq(primaryKey, userId);
  return response;
};

export const inviteMemberToGroup = async (groupId, email) => {
  try {
    const {error} = await supabase.rpc('invite_member_to_group', {
      group_id: groupId,
      new_member_email: email,
    });

    if (error) {
      makeToastMessage(`There was an error while inviting ${email}`);
    } else {
      makeToastMessage(`Invitation sent to ${email}`);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
};

export const acceptGroupInvite = async (groupId, userId) => {
  try {
    let {error} = await supabase.rpc('accept_group_invite', {
      invite_group_id: groupId,
      user_id: userId,
    });
    if (error) {
      console.error(error);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
};

export const rejectGroupInvite = async (groupId, userId) => {
  try {
    let {error} = await supabase.rpc('reject_group_invite', {
      invite_group_id: groupId,
      user_id: userId,
    });
    if (error) {
      console.error(error);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
};
