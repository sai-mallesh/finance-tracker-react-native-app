import {StyleSheet, Text, View, SafeAreaView, Pressable} from 'react-native';
import React, {useState} from 'react';
import {globalStyles} from '../Styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import InvitePeopleToGroupComponent from '../components/InvitePeopleToGroupComponent';

const GroupSettingsScreen = ({route}) => {
  let group_info = route.params.group;
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <SafeAreaView style={globalStyles.mainContainer}>
      <View style={globalStyles.contentContainer}>
        <Text style={globalStyles.text}>GroupSettingsScreen</Text>
        <Pressable
          onPress={toggleModal}
          style={[styles.headerCard, globalStyles.button]}>
          <MaterialCommunityIcons name="plus" color="#ffffff" size={25} />
          <Text style={globalStyles.text}>Invite People</Text>
        </Pressable>
      </View>
      <InvitePeopleToGroupComponent
        isVisible={isModalVisible}
        toggleModal={toggleModal}
        invited_group_id={group_info.group_id}
      />
    </SafeAreaView>
  );
};

export default GroupSettingsScreen;

const styles = StyleSheet.create({});
