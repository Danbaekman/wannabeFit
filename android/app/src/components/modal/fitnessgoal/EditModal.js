import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import Modal from 'react-native-modal';
import styles from './EditModalStyles';

const EditModal = ({ 
  isVisible, 
  onClose, 
  title, 
  fields, 
  onFieldChange, 
  onSubmit 
}) => {
  const [hasError, setHasError] = useState(false);

  const handleInputChange = (key, text) => {
    // 숫자만 입력되도록 제한
    const sanitizedText = text.replace(/[^0-9]/g, ''); // 숫자 외 제거
    onFieldChange(key, sanitizedText);
  };

  const handleSubmit = () => {
    // 모든 필드가 숫자인지 확인
    const invalidField = fields.find((field) => isNaN(Number(field.value)) || field.value === '');
    if (invalidField) {
      Alert.alert('오류', '올바른 숫자를 입력해주세요.');
      setHasError(true);
      return;
    }
    setHasError(false);
    onSubmit(); // 정상적으로 제출
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      swipeDirection="down" // 위에서 아래로 드래그 시 닫힘
      onSwipeComplete={onClose}
      backdropOpacity={0.5}
      style={styles.modalContainer}
    >
      <View style={styles.modalContent}>
        {/* 닫기 버튼 */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>

        <Text style={styles.modalTitle}>{title}</Text>
        {fields.map((field, index) => (
          <View key={index} style={styles.inputContainer}>
            {field.key === 'calories' ? (
              // 목표 칼로리 입력 UI
              <View style={styles.caloriesInputContainer}>
                <TextInput
                  style={[styles.input, styles.caloriesInput]} // 목표 칼로리 스타일 적용
                  value={field.value}
                  onChangeText={(text) => handleInputChange(field.key, text)}
                  keyboardType="numeric" // 숫자 키보드만 표시
                />
                <Text style={styles.caloriesUnit}>Kcal</Text>
              </View>
            ) : (
              // 탄단지 입력 UI
              <View style={styles.macroInputContainer}>
                <Text style={styles.macroLabel}>{field.label}</Text>
                <TextInput
                  style={[styles.input, styles.macroInput]}
                  value={field.value}
                  onChangeText={(text) => handleInputChange(field.key, text)}
                  keyboardType="numeric" // 숫자 키보드만 표시
                />
              </View>
            )}
          </View>
        ))}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>완료</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default EditModal;
