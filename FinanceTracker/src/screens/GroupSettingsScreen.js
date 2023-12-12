import {StyleSheet, Text, View, SafeAreaView, Pressable} from 'react-native';
import React, {useState} from 'react';
import {globalStyles} from '../Styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import InvitePeopleToGroupComponent from '../components/InvitePeopleToGroupComponent';
import EditGroupNameModal from '../components/EditGroupNameModal';
import {leaveGroup} from '../Utils';
import {useAsyncStorageData} from '../providers/AsyncStorageDataProvider';

const GroupSettingsScreen = ({navigation, route}) => {
  let group_info = route.params.group;
  const {userMetadata} = useAsyncStorageData();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalVisibleEditName, setModalVisibleEditName] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const toggleModalEditName = () => {
    setModalVisibleEditName(!isModalVisibleEditName);
    navigation.navigate('Group', {
      screen: 'Group List',
      params: {rerender: true},
    });
  };

  const handleLeaveGroup = async () => {
    await leaveGroup(group_info.group_id, userMetadata.userId);
    navigation.navigate('Group', {
      screen: 'Group List',
      params: {rerender: true},
    });
  };

  return (
    <SafeAreaView style={globalStyles.mainContainer}>
      <View style={globalStyles.contentContainer}>
        <Text style={[globalStyles.text, globalStyles.textHeading]}>
          {group_info.group_name} Group Settings
        </Text>
        <View style={styles.addSpace}>
          <Pressable
            onPress={()=>setModalVisibleEditName(!isModalVisibleEditName)}
            style={[
              styles.headerCard,
              globalStyles.containerFlexDirRow,
              styles.addSpace,
            ]}>
            <MaterialCommunityIcons name="pencil" size={30} color="#ffffff" />
            <Text style={[styles.buttonText, globalStyles.text]}>
              Edit Group Name
            </Text>
          </Pressable>
          {userMetadata.userType === 'hybrid' && (
            <Pressable
              onPress={toggleModal}
              style={[
                styles.headerCard,
                globalStyles.containerFlexDirRow,
                styles.addSpace,
              ]}>
              <MaterialCommunityIcons name="plus" size={30} color="#ffffff" />
              <Text style={[styles.buttonText, globalStyles.text]}>
                Invite People
              </Text>
            </Pressable>
          )}
          <Pressable
            onPress={handleLeaveGroup}
            style={[
              styles.headerCard,
              globalStyles.containerFlexDirRow,
              styles.addSpace,
            ]}>
            <MaterialCommunityIcons name="logout" size={30} color="#BE3144" />
            <Text style={[styles.buttonText]}>Leave Group</Text>
          </Pressable>
        </View>
      </View>
      <InvitePeopleToGroupComponent
        isVisible={isModalVisible}
        toggleModal={toggleModal}
        invited_group_id={group_info.group_id}
      />
      <EditGroupNameModal
        isVisible={isModalVisibleEditName}
        toggleModal={toggleModalEditName}
        groupInfo={group_info}
      />
    </SafeAreaView>
  );
};

export default GroupSettingsScreen;

const styles = StyleSheet.create({
  buttonText: {
    flexDirection: 'row',
    marginLeft: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#BE3144',
  },
  addSpace: {
    marginVertical: 10,
    justifyContent: 'center',
    width: '100%',
  },
});
