import AsyncStorage from '@react-native-async-storage/async-storage';

export const getDataLocal = async key => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.log('Error getting data', error);
  }
};

export const setDataLocal = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.log('Error storing data', error);
  }
};

export const getObjectDataLocal = async key => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.log('Error getting data', error);
  }
};

export const setObjectDataLocal = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.log('Error storing data', error);
  }
};

export const modifyTransactionLocal = async (operation, group, value, newValue) => {
  let data = await getObjectDataLocal(keys.TRANSACTIONS);
  let index = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i].groupName === group) {
      index = i;
      break;
    }
  }
  switch (operation) {
    case 'add':
      data[index][group].push(value);
      await setObjectDataLocal(keys.TRANSACTIONS, data);
      break;
    case 'del':
      data[index][group] = data[index][group].filter(
        record => JSON.stringify(record) !== JSON.stringify(value),
      );
      await setObjectDataLocal(keys.TRANSACTIONS, data);
      return data[index][group];
    case 'update':{
      let recIndex = data[index][group].findIndex(element => element.id === value.id);
      data[index][group][recIndex] = newValue;
      await setObjectDataLocal(keys.TRANSACTIONS, data);
      return data[index][group];
    }
  }
};

export const modifyObjectDataLocal = async (
  operation,
  key,
  value,
  newValue,
) => {
  let data = await getObjectDataLocal(key);
  switch (operation) {
    case 'add':
      data.push(value);
      break;
    case 'del':
      data = data.filter(record => record !== value);
      break;
    case 'update':{
      let index = data.findIndex(element => element === value);
      data[index] = newValue;
      break;
    }
  }
  await setObjectDataLocal(key, data);
  console.log(data);
};

export const getGroupName = async groupId => {
  const data = await getObjectDataLocal(keys.GROUPS_LIST);
  for (const element of data) {
    if (element.group_id === groupId) {
      return element.group_name;
    }
  }
};

export const keys = {
  SESSION_EXISTS: 'SESSION_EXISTS',
  USER_METADATA: 'USER_METADATA',
  GROUPS_LIST: 'GROUPS_LIST',
  TRANSACTIONS: 'TRANSACTIONS',
};
