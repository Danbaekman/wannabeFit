import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import styles from './AddRoutineDetailModalStyles';

const AddRoutineDetailModal = ({ visible, onClose, onAddExercise }) => {
  const [exerciseName, setExerciseName] = useState('');

  const handleAdd = () => {
    if (exerciseName.trim()) {
      onAddExercise(exerciseName.trim());
      setExerciseName('');
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
        {/* 드래그 핸들 */}
        <View style={styles.dragHandleContainer}>
          <View style={styles.dragHandle} />
        </View>

        {/* 제목 & 닫기 버튼 */}
        <View style={styles.headerContainer}>
          <Text style={styles.modalTitle}>새 운동 종목 추가</Text>
          <TouchableOpacity style={styles.closeButtonContainer} onPress={onClose}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* 입력 필드 */}
        <TextInput
          style={styles.input}
          placeholder="운동 종목 이름 입력"
          value={exerciseName}
          onChangeText={setExerciseName}
        />

        {/* 추가 버튼 */}
        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <Text style={styles.addButtonText}>추가</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default AddRoutineDetailModal;
