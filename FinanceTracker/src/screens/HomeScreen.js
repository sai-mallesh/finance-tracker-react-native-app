import {StyleSheet, Text, View, SafeAreaView} from 'react-native';
import {globalStyles} from '../Styles';
import React, {useEffect, useState} from 'react';
import {useAsyncStorageData} from '../providers/AsyncStorageDataProvider';
import AddTransactionFloatingButton from '../components/AddTransactionFloatingButton';

const HomeScreen = () => {
  const { groupsInfo} = useAsyncStorageData();

  const [greeting, setGreeting] = useState('');
  const {userMetadata} = useAsyncStorageData();

  async function fetchData() {
    const currentHour = new Date().getHours();
    if (currentHour >= 0 && currentHour < 12) {
      setGreeting('Good morning!');
    } else if (currentHour >= 12 && currentHour < 18) {
      setGreeting('Good afternoon!');
    } else {
      setGreeting('Good evening!');
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  

  return (
    <SafeAreaView style={globalStyles.mainContainer}>
      <View style={globalStyles.contentContainer}>
        <Text style={styles.text}>
          {greeting} {userMetadata.name}
        </Text>
        <Text style={styles.text}>
          Total amount spent: {userMetadata.currency}
          {userMetadata.spendings === '' ? 0 : userMetadata.spendings}
        </Text>
      </View>
      <AddTransactionFloatingButton
        groupInfo={groupsInfo}
        fromGroupScreen={false}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  text: {
    marginVertical: 10,
    marginHorizontal: 10,
    fontSize: 20,
    color: '#ffffff',
  },
});
