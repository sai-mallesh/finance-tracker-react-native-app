import {StyleSheet, Text, View, SafeAreaView, Pressable} from 'react-native';
import React from 'react';
import {globalStyles} from '../Styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const GroupScreen = ({navigation, route}) => {
  let group_info = route.params.group;
  return (
    <SafeAreaView style={globalStyles.mainContainer}>
      <View style={globalStyles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={[globalStyles.textHeading, globalStyles.text]}>
            {group_info.group_name}
          </Text>
          <Pressable
            onPress={() =>
              navigation.navigate('Group', {screen: 'Group Settings', params: {group: group_info}})
            }>
            <MaterialCommunityIcons name="cog" color="#ffffff" size={25} />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default GroupScreen;

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
