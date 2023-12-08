import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Pressable,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {globalStyles} from '../Styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  getDataFromDB,
  acceptGroupInvite,
  rejectGroupInvite,
  getGroupData,
} from '../Utils';
import CreateGroupComponent from '../components/CreateGroupComponent';
import {useAuth} from '../providers/AuthProvider';
import PropTypes from 'prop-types';

const GroupListScreen = ({navigation, route}) => {
  const [groups, setGroups] = useState([]);
  const [groupInvites, setGroupInvites] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
    setLoading(!loading);
  };

  const {userMetadata} = useAuth();

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const fetchData = async () => {
    const response_group_invite = await getDataFromDB(
      'profile',
      userMetadata.userId,
      'group_invite',
      'id',
    );
    let response_group_id_invite = response_group_invite.data[0].group_invite;

    let tempInvite = [];
    for (const element of response_group_id_invite) {
      const invite = await getDataFromDB('group', element, '*', 'group_id');
      tempInvite.push(invite.data[0]);
    }
    setGroupInvites(tempInvite);

    const data = await getGroupData(userMetadata.userId);
    setGroups(data);
  };

  if (route.params.rerender === true) {
    route.params.rerender = false;
    setLoading(!loading);
  }

  useEffect(() => {
    setGroups([]);
    setGroupInvites([]);
    fetchData();
  }, [loading]);

  const updateGroupInviteList = group => {
    let pendingGroupInvite = groupInvites.filter(x => x !== group);
    setGroupInvites(pendingGroupInvite);
  };

  const handleAcceptGroupInvite = async group => {
    await acceptGroupInvite(group.group_id, userMetadata.userId);
    group.members.push(userMetadata.userId);
    setGroups(arr => [...arr, group]);
    updateGroupInviteList(group);
  };

  const handleRejectGroupInvite = async group => {
    await rejectGroupInvite(group.group_id, userMetadata.userId);
    updateGroupInviteList(group);
  };
  return (
    <SafeAreaView style={globalStyles.mainContainer}>
      <View style={globalStyles.contentContainer}>
        <ScrollView
          style={[globalStyles.container, styles.scrollViewContainer]}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <TouchableOpacity
            style={[globalStyles.button, styles.buttonPosition]}
            onPress={toggleModal}>
            <MaterialCommunityIcons
              name="account-multiple-plus"
              color="#ffffff"
              size={25}
            />
            <Text
              style={[
                globalStyles.buttonText,
                globalStyles.text,
                globalStyles.iconButton,
              ]}>
              Create a new group
            </Text>
          </TouchableOpacity>
          {groupInvites.length > 0 && (
            <>
              <Text
                style={[
                  globalStyles.textHeading,
                  globalStyles.text,
                  styles.addSpace,
                ]}>
                Group Invite:
              </Text>
              <View style={styles.addSpace}>
                {groupInvites.length > 0 &&
                  groupInvites.map((group) => {
                    return (
                      <View
                        key={group.group_id}
                        style={[
                          globalStyles.cardLevelOne,
                          globalStyles.containerFlexDirRow,
                          styles.groupInviteBG,
                        ]}>
                        <View>
                          <Text
                            style={[
                              globalStyles.text,
                              globalStyles.textHeading,
                            ]}>
                            {group.group_name}
                          </Text>
                          <Text style={globalStyles.text}>
                            {group.group_name !== 'personal'
                              ? `No. of Members: ${group.members.length}`
                              : ''}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.groupInvitResponseButton,
                            globalStyles.containerFlexDirRow,
                          ]}>
                          <Pressable
                            onPress={() => handleAcceptGroupInvite(group)}>
                            <MaterialCommunityIcons
                              name="checkbox-marked"
                              color="#508D69"
                              size={40}
                            />
                          </Pressable>
                          <Pressable
                            onPress={() => handleRejectGroupInvite(group)}>
                            <MaterialCommunityIcons
                              name="close-box"
                              color="#BE3144"
                              size={40}
                            />
                          </Pressable>
                        </View>
                      </View>
                    );
                  })}
              </View>
            </>
          )}

          <Text
            style={[
              globalStyles.textHeading,
              globalStyles.text,
              styles.addSpace,
            ]}>
            Your Groups:
          </Text>
          <View style={styles.addSpace}>
            {groups.length > 0 &&
              groups.map((group) => {
                return (
                  <Pressable
                    key={group.group_id}
                    onPress={() =>
                      navigation.navigate('Group', {
                        screen: 'Group Screen',
                        params: {group: group},
                      })
                    }>
                    <View style={globalStyles.cardLevelOne}>
                      <Text
                        style={[globalStyles.text, globalStyles.textHeading]}>
                        {group.group_name}
                      </Text>
                      <Text style={globalStyles.text}>
                        {group.group_name !== 'personal'
                          ? `No. of Members: ${group.members.length}`
                          : ''}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
          </View>
        </ScrollView>
        <CreateGroupComponent
          isVisible={isModalVisible}
          toggleModal={toggleModal}
          setGroups={setGroups}
        />
      </View>
    </SafeAreaView>
  );
};

GroupListScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
};

export default GroupListScreen;

const styles = StyleSheet.create({
  buttonPosition: {
    alignSelf: 'flex-end',
  },
  groupInvitResponseButton: {
    position: 'absolute',
    right: 10,
  },
  addSpace: {
    marginTop: 10,
  },
  groupInviteBG: {
    backgroundColor: '#454545',
  },
});
