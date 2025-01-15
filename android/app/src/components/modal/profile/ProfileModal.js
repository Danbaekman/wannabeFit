import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import styles from './ProfileModalStyles';

const ProfileModal = ({ isVisible, name, onClose, onChangeName, onSave }) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      backdropColor="black"
      backdropOpacity={0.5}
      style={styles.modalContainer}
      animationIn="slideInUp"
      animationOut="slideOutDown"
    >
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>닉네임 변경</Text>
        <TextInput
          style={styles.modalInput}
          value={name}
          onChangeText={onChangeName}
          placeholder="새 닉네임 입력"
        />
        <TouchableOpacity style={styles.modalButton} onPress={onSave}>
          <Text style={styles.modalButtonText}>완료</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
          <Text style={styles.modalCloseButtonText}>취소</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default ProfileModal;
