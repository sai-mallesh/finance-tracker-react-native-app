import React, {useState} from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {globalStyles} from '../Styles';
import AddTransactionModal from './AddTransactionModal';
import PropTypes from 'prop-types';

const AddTransactionFloatingButton = ({groupInfo,fromGroupScreen,data, setRefresh}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.buttonFloat, globalStyles.button]}
        onPress={toggleModal}>
        <Icon name="plus" size={20} color="#ffffff" />
        <Text
          style={[
            globalStyles.buttonText,
            globalStyles.text,
            globalStyles.iconButton,
          ]}>
          Add Transaction
        </Text>
      </TouchableOpacity>
      {isModalVisible && (
        <AddTransactionModal
          isVisible={isModalVisible}
          toggleModal={toggleModal}
          groupInfo={groupInfo}
          fromGroupScreen={fromGroupScreen}
          data={data}
          setRefresh={setRefresh}
        />
      )}
    </>
  );
};

AddTransactionFloatingButton.propTypes = {
  groupInfo: PropTypes.any.isRequired,
  fromGroupScreen: PropTypes.bool.isRequired,
  data:PropTypes.array,
  setRefresh:PropTypes.func,
};

export default AddTransactionFloatingButton;

const styles = StyleSheet.create({
  buttonFloat: {
    position: 'absolute',
    bottom: 20,
    right: 10,
  },
});
