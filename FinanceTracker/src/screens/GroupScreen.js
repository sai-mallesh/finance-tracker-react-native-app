import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect} from 'react';
import {globalStyles} from '../Styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const GroupScreen = () => {
  const fetchData = async () => {
    console.log('Hello');
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <SafeAreaView style={globalStyles.mainContainer}>
      <View>
        <TouchableOpacity
          style={[globalStyles.button, styles.buttonPosition]}
          onPress={() => console.log('Hello')}>
          <MaterialCommunityIcons
            name="account-multiple-plus"
            color="#ffffff"
            size={25}
          />
          <Text style={[globalStyles.buttonText, globalStyles.text]}>
            Create a new group
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default GroupScreen;

const styles = StyleSheet.create({
  buttonPosition: {
    alignSelf: 'flex-end',
    marginRight: 10,
  },
});
