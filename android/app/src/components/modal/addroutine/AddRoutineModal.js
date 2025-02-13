import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import styles from './AddRoutineModalStyles';

const AddRoutineModal = ({ visible, onClose, onAddRoutine }) => {
  const [routineName, setRoutineName] = useState('');

  const handleAdd = () => {
    if (routineName.trim()) {
      onAddRoutine(routineName.trim());
      setRoutineName('');
      onClose();
    }
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      swipeDirection="down" // ✅ 아래로 스와이프하면 모달 닫힘
      onSwipeComplete={onClose}
      backdropOpacity={0.5}
      style={styles.modalContainer}
    >
      <View style={styles.modalContent}>

        {/* 제목 & 닫기 버튼 */}
        <View style={styles.headerContainer}>
          <Text style={styles.modalTitle}>새 훈련 추가</Text>
          <TouchableOpacity style={styles.closeButtonContainer} onPress={onClose}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* 입력 필드 */}
        <TextInput
          style={styles.input}
          placeholder="훈련 이름 입력"
          value={routineName}
          onChangeText={setRoutineName}
        />

        {/* 추가 버튼 */}
        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <Text style={styles.addButtonText}>추가</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default AddRoutineModal;
