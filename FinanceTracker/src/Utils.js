/* eslint-disable prettier/prettier */
import {ToastAndroid} from 'react-native';

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
