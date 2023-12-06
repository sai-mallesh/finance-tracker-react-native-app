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
import {inviteMemberToGroup} from '../Utils';

const InvitePeopleToGroupComponent = ({isVisible, toggleModal,invited_group_id}) => {
  const [email, setEmail] = useState('');
  const handleInviteMember = async () => {
    await inviteMemberToGroup(invited_group_id,email);
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
            Invite Members
          </Text>
          <TextInput
            placeholder={'Email'}
            placeholderTextColor="#EEEDED"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
          <TouchableOpacity
            onPress={handleInviteMember}
            style={globalStyles.button}>
            <Text style={[globalStyles.buttonText, globalStyles.text]}>
              Invite
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default InvitePeopleToGroupComponent;

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
