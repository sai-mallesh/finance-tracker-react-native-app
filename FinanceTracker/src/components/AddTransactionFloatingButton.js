import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { globalStyles } from '../Styles';

const AddTransactionFloatingButton = () => {
  return (
    <TouchableOpacity
      style={[styles.buttonFloat,globalStyles.button]}
      onPress={() => console.log('Hello')}>
      <Icon name="plus" size={20} color="#ffffff" />
      <Text style={[globalStyles.buttonText,globalStyles.text]}>Add Transaction</Text>
    </TouchableOpacity>
  );
};

export default AddTransactionFloatingButton;

const styles = StyleSheet.create({
  buttonFloat: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
});
