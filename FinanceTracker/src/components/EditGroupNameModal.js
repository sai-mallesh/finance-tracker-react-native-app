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
import {makeToastMessage, updateDataInDB, updateRecordDB} from '../Utils';

const EditGroupNameModal = ({isVisible, toggleModal, groupInfo}) => {
  const [groupName, setGroupName] = useState(groupInfo.group_name);
  const handleChangeName = async () => {
    const status = await updateDataInDB(
      'group',
      groupInfo.group_id,
      {group_name: groupName},
      'group_id',
    );
    if (status === 200) {
      toggleModal();
    } else {
      makeToastMessage('There was an error updating group name');
    }
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
            Edit Group Name
          </Text>
          <TextInput
            placeholder={'Group Name'}
            placeholderTextColor="#EEEDED"
            style={styles.input}
            value={groupName}
            onChangeText={setGroupName}
          />
          <TouchableOpacity
            onPress={handleChangeName}
            style={globalStyles.button}>
            <Text style={[globalStyles.buttonText, globalStyles.text]}>
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default EditGroupNameModal;

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
