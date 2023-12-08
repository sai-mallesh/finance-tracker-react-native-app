import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {globalStyles} from '../Styles';
import PropTypes from 'prop-types';

const data = [
  {label: 'INR ₹', value: '₹'},
  {label: 'AUD A$', value: 'A$'},
  {label: 'USD $', value: '$'},
  {label: 'GBP £', value: '£'},
  {label: 'EUR €', value: '€'},
  {label: 'CAD C$', value: 'C$'},
  {label: 'JPY ¥', value: '¥'},
];

const CurrencyPickerComponent = ({setTxnRecord, txnRecord}) => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  useEffect(()=>{
    setValue(txnRecord.currency);
  },[txnRecord]);

  return (
    <View style={styles.container}>
      <Dropdown
        style={[styles.dropdown]}
        selectedTextStyle={[globalStyles.text,styles.selectedCurFontSize]}
        inputSearchStyle={styles.inputSearchStyle}
        containerStyle={styles.containerStyle}
        itemTextStyle={globalStyles.text}
        activeColor={'#B7B78A'}
        data={data}
        search
        autoScroll={false}
        maxHeight={225}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? 'Currency' : '...'}
        placeholderStyle={[globalStyles.text,styles.selectedCurFontSize]}
        searchPlaceholder="Search"
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          setValue(item.value);
          setTxnRecord({...txnRecord, currency: item.value});
          setIsFocus(false);
        }}
      />
    </View>
  );
};

CurrencyPickerComponent.propTypes = {
  setTxnRecord: PropTypes.func.isRequired,
  txnRecord: PropTypes.object.isRequired,
};

export default CurrencyPickerComponent;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  selectedCurFontSize:{
    fontSize:13,
  },
  dropdown: {
    height: 40,
    width: 100,
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
