import {StyleSheet, Text, View, SafeAreaView, Pressable, ScrollView} from 'react-native';
import React, {useState, useEffect} from 'react';
import {globalStyles} from '../Styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AddTransactionFloatingButton from '../components/AddTransactionFloatingButton';
import {getDataFromDB} from '../Utils';
import EditTransactionModal from '../components/EditTransactionModal';
import PropTypes from 'prop-types';

const GroupScreen = ({navigation, route}) => {
  let group_info = route.params.group;
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [refresh, setRefresh] = useState(null);
  const [txnData, setTxnData] = useState({
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
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };
  const fetchData = async () => {
    const x = await getDataFromDB(
      'transactions_sandbox',
      group_info.group_id,
      '*',
      'group_id',
    );
    setData(x.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (refresh !== null) {
      setData(data);
    }
  }, [refresh]);
  return (
    <SafeAreaView style={globalStyles.mainContainer}>
      <View style={globalStyles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={[globalStyles.textHeading, globalStyles.text]}>
            {group_info.group_name}
          </Text>
          <Pressable
            onPress={() =>
              navigation.navigate('Group', {
                screen: 'Group Settings',
                params: {group: group_info},
              })
            }>
            <MaterialCommunityIcons name="cog" color="#ffffff" size={25} />
          </Pressable>
        </View>
        <ScrollView style={styles.scrollView}>
          {data.length > 0 &&
            data.map((transaction) => {
              return (
                <Pressable
                  key={transaction.id}
                  onPress={() => {
                    setTxnData(transaction);
                    toggleModal();
                  }}>
                  <View style={globalStyles.cardLevelOne}>
                    <Text style={[globalStyles.text, globalStyles.textHeading]}>
                      {transaction.record}
                    </Text>
                    <Text style={globalStyles.text}>
                      {transaction.currency} {transaction.amount}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
        </ScrollView>
      </View>
      <AddTransactionFloatingButton
        groupInfo={route.params}
        fromGroupScreen={true}
        data={data}
        setRefresh={setRefresh}
      />
      <EditTransactionModal
        isVisible={isModalVisible}
        toggleModal={toggleModal}
        txnData={txnData}
        data={data}
        setData={setData}
      />
    </SafeAreaView>
  );
};

GroupScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
};

export default GroupScreen;

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scrollView:{
    width:'100%',
    height:'95%',
  },
});
