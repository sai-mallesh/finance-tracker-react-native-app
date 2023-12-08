import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {globalStyles} from '../Styles';
import CurrencyPickerComponent from './CurrencyPickerComponent';
import PropTypes from 'prop-types';
import TransactionGroupPickerComponent from './TransactionGroupPickerComponent';
import {addRecordToDB, generateRandomId, generateUUID, makeToastMessage} from '../Utils';
import TransactionPayorPickerComponent from './TransactionPayorPickerComponent';

const AddTransactionModal = ({
  isVisible,
  toggleModal,
  groupInfo,
  fromGroupScreen,
  data,
  setRefresh,
}) => {
  const [txnRecord, setTxnRecord] = useState({
    id: generateUUID(),
    group_id: '',
    payor_user_id: '',
    record: '',
    amount: '',
    split: null,
    date: new Date().toLocaleDateString('en-US'),
    currency: '',
    last_updated: new Date().toISOString(),
  });
  const [memberData, setMemberData] = useState([]);
  const [loading, setLoading] = useState(true);
  const handleAddTransaction = async () => {
    const status = await addRecordToDB('transactions_sandbox', txnRecord);
    if (status === 201) {
      if (fromGroupScreen === true) {
        data.push(txnRecord);
        setRefresh(generateRandomId);
      }
      toggleModal();
    } else {
      makeToastMessage('There was an error');
    }
  };

  useEffect(() => {
    if (fromGroupScreen === true) {
      let temp = [];
      for (let i = 0; i < groupInfo.group.members.length; i++) {
        temp.push({
          label: groupInfo.group.memberNames[i],
          value: groupInfo.group.members[i],
        });
      }
      setMemberData(temp);
      if (temp.length === 1) {
        setTxnRecord({
          ...txnRecord,
          payor_user_id: temp[0].value,
          group_id: groupInfo.group.group_id,
        });
      } else {
        setTxnRecord({...txnRecord, group_id: groupInfo.group.group_id});
      }
    }
    setLoading(false);
  }, []);
  return (
    <>
      {!loading && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={isVisible}
          onRequestClose={toggleModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={[globalStyles.textHeading, globalStyles.text]}>
                Add transaction
              </Text>
              <TextInput
                placeholder={'Transaction for ...'}
                placeholderTextColor="#EEEDED"
                style={styles.input}
                value={txnRecord.record}
                onChangeText={newValue =>
                  setTxnRecord({...txnRecord, record: newValue})
                }
              />
              <View
                style={[
                  globalStyles.containerFlexDirRow,
                  styles.currencyPicker,
                ]}>
                <CurrencyPickerComponent
                  setTxnRecord={setTxnRecord}
                  txnRecord={txnRecord}
                />
                <TextInput
                  placeholder={'Amount'}
                  placeholderTextColor="#EEEDED"
                  style={[styles.input, styles.input2]}
                  value={txnRecord.amount}
                  onChangeText={newValue =>
                    setTxnRecord({...txnRecord, amount: newValue})
                  }
                  keyboardType="number-pad"
                />
              </View>
              {fromGroupScreen ? (
                <>
                  <TextInput
                    style={[styles.input]}
                    value={groupInfo.group.group_name}
                    editable={false}
                    readOnly={true}
                    selectTextOnFocus={false}
                  />
                  {memberData.length === 1 ? (
                    <TextInput
                      style={[styles.input]}
                      value={memberData[0].label}
                      editable={false}
                      readOnly={true}
                      selectTextOnFocus={false}
                    />
                  ) : (
                    <TransactionPayorPickerComponent
                      memberData={memberData}
                      setTxnRecord={setTxnRecord}
                      txnRecord={txnRecord}
                    />
                  )}
                </>
              ) : (
                <View>
                  <TransactionGroupPickerComponent
                    groupInfo={groupInfo}
                    setTxnRecord={setTxnRecord}
                    txnRecord={txnRecord}
                  />
                </View>
              )}
              <TouchableOpacity
                onPress={handleAddTransaction}
                style={globalStyles.button}>
                <Text style={[globalStyles.buttonText, globalStyles.text]}>
                  Add
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};

AddTransactionModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  groupInfo: PropTypes.any.isRequired,
  fromGroupScreen: PropTypes.bool.isRequired,
  data: PropTypes.array,
  setRefresh: PropTypes.func,
};

export default AddTransactionModal;

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
});
