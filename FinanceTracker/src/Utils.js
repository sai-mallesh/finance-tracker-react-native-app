import {ToastAndroid} from 'react-native';
import supabase from '../config/supabaseClient';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const checkNetworkConnectivity = async () => {
  const state = await NetInfo.fetch();
  return state.isConnected;
};

export const makeToastMessage = message => {
  ToastAndroid.showWithGravity(
    message,
    ToastAndroid.SHORT,
    ToastAndroid.CENTER,
  );
};

export const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const addRecordDB = async (table, record) => {
  const {status} = await supabase.from(table).insert(record);
  return status;
};

export const removeRecordDB = async (table, id, primaryKey) => {
  const status = await supabase.from(table).delete().eq(primaryKey, id);
  return status;
};

export const updateRecordDB  = async (table, id, recordToUpdate, primaryKey) => {
  const {status} = await supabase
    .from(table)
    .update(recordToUpdate)
    .eq(primaryKey, id)
    .select();
  return status;
};

export const getRecordDB  = async (table, id, columns, primaryKey) => {
  const response = await supabase
    .from(table)
    .select(columns)
    .eq(primaryKey, id);
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

export const leaveGroup = async (groupId, userId) => {
  try {
    let {error} = await supabase.rpc('leave_group', {
      leave_group_id: groupId,
      user_id: userId,
    });
    if (error) {
      console.error(error);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
};

export const getGroupData = async userId => {
  let tempGroupData = [];
  const response_groups = await getRecordDB(
    'profile',
    userId,
    'groups',
    'id',
  );
  let response_group_id_invite = response_groups.data[0].groups;
  for (const element of response_group_id_invite) {
    const response = await getRecordDB('group', element, '*', 'group_id');
    const groupData = response.data[0];
    let temp = [];
    for (const element1 of groupData.members) {
      let response_ = await getRecordDB('profile', element1, 'name', 'id');
      temp.push(response_.data[0].name);
    }
    groupData.memberNames = temp;
    tempGroupData.push(groupData);
  }
  return tempGroupData;
};

export const signOut = async () => {
  try {
    const {error} = await supabase.auth.signOut();
    if (error) {
      makeToastMessage(error.message);
      return;
    }
    await AsyncStorage.clear();
    makeToastMessage('Logged Out');
  } catch (e) {
    console.log(e);
    makeToastMessage(e);
  }
};
