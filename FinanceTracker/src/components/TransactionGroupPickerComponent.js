import React, {useEffect, useState} from 'react';
import {StyleSheet, View, TextInput} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {globalStyles} from '../Styles';
import PropTypes from 'prop-types';
import TransactionPayorPickerComponent from './TransactionPayorPickerComponent';

const TransactionGroupPickerComponent = ({
  groupInfo,
  setTxnRecord,
  txnRecord,
}) => {
  const [groupData, setGroupData] = useState([]);
  const [memberData, setMemberData] = useState([]);

  const prepareMemberData = groupId => {
    let temp = [];
    const filteredRecord = groupInfo.find(
      record => record.group_id === groupId,
    );
    for (let i = 0; i < filteredRecord.members.length; i++) {
      temp.push({
        label: filteredRecord.memberNames[i],
        value: filteredRecord.members[i],
      });
    }
    if (temp.length === 1) {
      setTxnRecord({
        ...txnRecord,
        payor_user_id: temp[0].value,
        group_id: filteredRecord.group_id,
      });
    } else {
      setTxnRecord({...txnRecord, group_id: filteredRecord.group_id});
    }
    setMemberData(temp);
  };

  useEffect(() => {
    let tempGroupData = [];
    for (const element of groupInfo) {
      tempGroupData.push({label: element.group_name, value: element.group_id});
    }
    setGroupData(tempGroupData);
  }, []);

  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  return (
    <View style={styles.container}>
      <Dropdown
        style={[styles.dropdown]}
        selectedTextStyle={globalStyles.text}
        inputSearchStyle={styles.inputSearchStyle}
        containerStyle={styles.containerStyle}
        itemTextStyle={globalStyles.text}
        activeColor={'#B7B78A'}
        data={groupData}
        search
        autoScroll={false}
        maxHeight={225}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? 'Group' : '...'}
        placeholderStyle={globalStyles.text}
        searchPlaceholder="Search"
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          setValue(item.value);
          setTxnRecord({...txnRecord, group_id: item.value});
          prepareMemberData(item.value);
          setIsFocus(false);
        }}
      />
      {memberData.length === 1 ? (
        <TextInput
          style={[styles.input1]}
          value={memberData[0].label}
          editable={false}
          readOnly={true}
          selectTextOnFocus={false}
        />
      ) : (
        <>
          {memberData.length > 1 && (
            <TransactionPayorPickerComponent
              memberData={memberData}
              setTxnRecord={setTxnRecord}
              txnRecord={txnRecord}
            />
          )}
        </>
      )}
    </View>
  );
};

TransactionGroupPickerComponent.propTypes = {
  groupInfo: PropTypes.array.isRequired,
  setTxnRecord: PropTypes.func.isRequired,
  txnRecord: PropTypes.object.isRequired,
};

export default TransactionGroupPickerComponent;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  dropdown: {
    height: 40,
    width: 250,
    borderWidth: 1,
    borderRadius: 15,
    padding: 10,
    backgroundColor: '#363636',
    borderColor: '#0E8388',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    borderRadius: 10,
    color: '#fff',
  },
  containerStyle: {
    backgroundColor: '#363636',
    borderRadius: 10,
    padding: 5,
    marginTop: 10,
  },

  input1: {
    height: 40,
    width: 250,
    borderWidth: 1,
    marginTop: 10,
    borderRadius: 15,
    padding: 10,
    color: '#ffffff',
    backgroundColor: '#363636',
    borderColor: '#0E8388',
  },

});
