import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {globalStyles} from '../Styles';
import PropTypes from 'prop-types';

const TransactionPayorPickerComponent = ({
  memberData,
  setTxnRecord,
  txnRecord,
}) => {
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
        data={memberData}
        search
        autoScroll={false}
        maxHeight={225}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? 'Paid By' : '...'}
        placeholderStyle={globalStyles.text}
        searchPlaceholder="Search"
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          let itemValue = item === null ? '' : item.value;
          setValue(itemValue);
          setTxnRecord({...txnRecord, payor_user_id: itemValue});
          setIsFocus(false);
        }}
      />
    </View>
  );
};
export default TransactionPayorPickerComponent;

TransactionPayorPickerComponent.propTypes = {
  memberData: PropTypes.array.isRequired,
  setTxnRecord: PropTypes.func.isRequired,
  txnRecord: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
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
});
