/* eslint-disable prettier/prettier */
import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
export default function Card({data}) {
  console.log(data);
  return (
    <View>
      {data.map((item, index) => (
        <View key={index} style={styles.item}>
          <Text style={styles.title}>
            Record: {item.record} Quantity: {item.quantity}
          </Text>
          <Text>Quantity: {item.quantity}</Text>
          <Text>Record: {item.record}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
  },
});
