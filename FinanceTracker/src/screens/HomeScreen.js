import {StyleSheet, Text, View, SafeAreaView} from 'react-native';
import {globalStyles} from '../Styles';
import React, {useEffect, useState} from 'react';
import {useAsyncStorageData} from '../providers/AsyncStorageDataProvider';
import {useAuth} from '../providers/AuthProvider';
import AddTransactionFloatingButton from '../components/AddTransactionFloatingButton';

const HomeScreen = () => {
  const {spent} = useAsyncStorageData();
  const {setUserId, setUserType, getUserData} = useAuth();
  const [greeting, setGreeting] = useState('');

  async function fetchData() {
    const userIdTemp = await getUserData('userId');
    const userTypeTemp = await getUserData('userType');
    const userNameTemp = await getUserData('name');
    await setUserId(userIdTemp);
    await setUserType(userTypeTemp);
    const currentHour = new Date().getHours();
    if (currentHour >= 0 && currentHour < 12) {
      setGreeting('Good morning! ' + userNameTemp);
    } else if (currentHour >= 12 && currentHour < 18) {
      setGreeting('Good afternoon! ' + userNameTemp);
    } else {
      setGreeting('Good evening! ' + userNameTemp);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <SafeAreaView style={globalStyles.mainContainer}>
      <View>
        <Text style={styles.text}>{greeting}</Text>
        <Text style={styles.text}>Total amount spent: {spent}</Text>
      </View>
      <AddTransactionFloatingButton/>
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
