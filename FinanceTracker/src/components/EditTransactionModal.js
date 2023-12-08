import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TextInput,
  Pressable,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {globalStyles} from '../Styles';
import CurrencyPickerComponent from './CurrencyPickerComponent';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {deleteDataFromDB, makeToastMessage, updateDataInDB} from '../Utils';
import PropTypes from 'prop-types';

const EditTransactionModal = ({
  isVisible,
  toggleModal,
  txnData,
  data,
  setData,
}) => {
  const [txnRecord, setTxnRecord] = useState({
    id: '',
    group_id: '',
    payor_user_id: '',
    record: '',
    amount: '',
    split: null,
    date: new Date().toLocaleDateString('en-US'),
    currency: '',
    last_updated: new Date().toISOString(),
  });

  const handleUpdateTransaction = async () => {
    const staus = await updateDataInDB(
      'transactions_sandbox',
      txnRecord.id,
      txnRecord,
      'id',
    );
    if (staus === 200) {
      let index = data.findIndex(element => element.id === txnRecord.id);
      data[index] = txnRecord;
      setData(data);
      toggleModal();
    } else {
      makeToastMessage('There was an error');
    }
  };

  const handleDeleteTransaction = async () => {
    const {error, status} = await deleteDataFromDB(
      'transactions_sandbox',
      txnRecord.id,
      'id',
    );
    if (status === 204) {
      let temp = data.filter(item => item.id !== txnRecord.id);
      setData(temp);
      toggleModal();
    } else {
      makeToastMessage('There was an error');
      console.log(error);
    }
  };
  useEffect(() => {
    setTxnRecord(txnData);
  }, [txnData]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={toggleModal}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={globalStyles.containerFlexDirRow}>
            <Text style={[globalStyles.textHeading, globalStyles.text]}>
              Edit Transaction
            </Text>
            <Pressable
              onPress={handleDeleteTransaction}
              style={styles.delIconButton}>
              <MaterialCommunityIcons
                name="trash-can"
                color="#BE3144"
                size={25}
              />
            </Pressable>
          </View>

          <TextInput
            placeholder={'Transaction for ...'}
            placeholderTextColor="#EEEDED"
            style={styles.input}
            value={txnRecord.record}
            onChangeText={newValue => {
              setTxnRecord({...txnRecord, record: newValue});
            }}
          />
          <View
            style={[globalStyles.containerFlexDirRow, styles.currencyPicker]}>
            <CurrencyPickerComponent
              setTxnRecord={setTxnRecord}
              txnRecord={txnRecord}
            />
            <TextInput
              placeholder={'Amount'}
              placeholderTextColor="#EEEDED"
              style={[styles.input, styles.input2]}
              value={txnRecord.amount.toString()}
              onChangeText={newValue =>
                setTxnRecord({...txnRecord, amount: newValue})
              }
            />
          </View>

          <TouchableOpacity
            onPress={handleUpdateTransaction}
            style={globalStyles.button}>
            <Text style={[globalStyles.buttonText, globalStyles.text]}>
              Update
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

EditTransactionModal.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    toggleModal: PropTypes.func.isRequired,
    txnData: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
    setData:PropTypes.func.isRequired,
  };

export default EditTransactionModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    backgroundColor: '#191919',
    padding: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
  input: {
    height: 40,
    width: 250,
    borderWidth: 1,
    marginVertical: 5,
    borderRadius: 15,
    padding: 10,
    color: '#ffffff',
    backgroundColor: '#363636',
    borderColor: '#0E8388',
  },
  input2: {
    width: 135,
  },
  currencyPicker: {
    marginLeft: -15,
  },
  delIconButton: {
    marginLeft: 40,
  },
});
