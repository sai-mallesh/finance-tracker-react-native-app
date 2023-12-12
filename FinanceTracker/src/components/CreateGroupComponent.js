import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';
import {globalStyles} from '../Styles';
import {addRecordDB, generateUUID} from '../Utils';
import {useAsyncStorageData} from '../providers/AsyncStorageDataProvider';
import {keys, modifyObjectDataLocal} from '../AsyncStorageUtils';
import PropTypes from 'prop-types';

const CreateGroupComponent = ({isVisible, toggleModal, setGroups}) => {
  const [groupName, setGroupName] = useState('');
  const {userMetadata,setGroupsInfo} = useAsyncStorageData();
  const handleCreateGroup = async () => {
    let record = {
      group_id: generateUUID(),
      group_name: groupName,
      members: [userMetadata.userId],
    };
    if (userMetadata.userType === 'hybrid') {
      const status = await addRecordDB('group', record);
      console.log(status);
      if (status === 201) {
        setGroups(prevGroups => [...prevGroups, record]);
      }
    } else {
      record.memberNames = [userMetadata.name];
      setGroups(prevGroups => [...prevGroups, record]);
      setGroupsInfo(prevGroups => [...prevGroups, record]);
      await modifyObjectDataLocal('add',keys.GROUPS_LIST,record);
      await modifyObjectDataLocal('add',keys.TRANSACTIONS,{[groupName]:[],groupName:groupName});
    }
    setGroupName('');
    toggleModal();
  };
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={toggleModal}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={[globalStyles.textHeading, globalStyles.text]}>
            Create New Group
          </Text>
          <TextInput
            placeholder={'Group Name'}
            placeholderTextColor="#EEEDED"
            style={styles.input}
            value={groupName}
            onChangeText={setGroupName}
          />
          <TouchableOpacity
            onPress={handleCreateGroup}
            style={globalStyles.button}>
            <Text style={[globalStyles.buttonText, globalStyles.text]}>
              Create Group
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

CreateGroupComponent.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  setGroups: PropTypes.func.isRequired,
};

export default CreateGroupComponent;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    backgroundColor: '#191919',
    padding: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
  input: {
    height: 40,
    width: 200,
    borderWidth: 1,
    marginVertical: 15,
    borderRadius: 15,
    padding: 10,
    color: '#ffffff',
    backgroundColor: '#363636',
    borderColor: '#0E8388',
  },
});
