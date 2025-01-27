import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // 아이콘 라이브러리
import styles from './AddRoutineModalStyles';

const AddRoutineModal = ({ visible, onClose, onAddRoutine }) => {
  const [routineName, setRoutineName] = useState('');

  const handleAdd = () => {
    if (routineName.trim()) {
      onAddRoutine(routineName.trim()); // 상위 컴포넌트로 값 전달
      setRoutineName('');
      onClose(); // 모달 닫기
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.modalContainer}>
          {/* X 아이콘 */}
          <TouchableOpacity style={styles.closeButtonContainer} onPress={onClose}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>

          <View style={styles.dragHandleContainer}>
            <View style={styles.dragHandle} />
          </View>

          {/* 제목 */}
          <Text style={styles.modalTitle}>새 훈련 추가</Text>

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
      </View>
    </Modal>
  );
};

export default AddRoutineModal;
