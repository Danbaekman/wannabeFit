import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import Modal from 'react-native-modal';
import { Picker } from '@react-native-picker/picker'; // Picker 가져오기
import styles from './ProfileModalStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ProfileModal = ({ isVisible, field, value, onClose, onChangeValue, onSave, userData }) => {
  const fieldTitleMap = {
    name: '닉네임 변경',
    weight: '시작 체중 변경',
    goal: '목표 변경',
    targetWeight: '목표 체중 변경',
    exerciseFrequency: '운동 빈도 변경',
  };

  const [selectedGoal, setSelectedGoal] = React.useState(value || 'diet'); // Default 값 설정

  const handleSave = () => {
    let dataToSave = value;
  
    // 목표(goal)는 드롭다운 값 사용
    if (field === 'goal') {
      dataToSave = selectedGoal;
    }
  
    // 숫자 검증 및 범위 제한 처리
    if (field === 'weight' || field === 'targetWeight' || field === 'exerciseFrequency') {
      if (!/^\d+$/.test(dataToSave)) {
        Alert.alert('오류', '숫자만 입력하세요.');
        return;
      }
  
      // 숫자로 변환 후 추가 검증
      const numericValue = parseInt(dataToSave, 10);
  
      if (field === 'exerciseFrequency' && (numericValue < 0 || numericValue > 7)) {
        Alert.alert('오류', '운동 빈도는 0에서 7 사이의 숫자여야 합니다.');
        return;
      }
  
      if ((field === 'weight' || field === 'targetWeight') && (numericValue <= 0 || numericValue > 500)) {
        Alert.alert('오류', '체중은 1kg 이상 500kg 이하의 숫자여야 합니다.');
        return;
      }
  
      dataToSave = numericValue; // 유효성 검증 후 숫자로 저장
    }
  
    // 목표(goal)와 체중 간의 논리적 관계 검증
    if (field === 'goal' || field === 'targetWeight') {
      const currentWeight = parseInt(userData?.weight, 10); // 시작 체중
      const targetWeight = parseInt(
        field === 'targetWeight' ? dataToSave : userData?.targetWeight,
        10
      ); // 목표 체중
  
      if (selectedGoal === 'diet' && targetWeight >= currentWeight) {
        Alert.alert('오류', '다이어트 목표 체중은 시작 체중보다 낮아야 합니다.');
        return;
      }
  
      if (selectedGoal === 'bulk' && targetWeight <= currentWeight) {
        Alert.alert('오류', '벌크업 목표 체중은 시작 체중보다 높아야 합니다.');
        return;
      }
  
      if (selectedGoal === 'maintain' && targetWeight !== currentWeight) {
        Alert.alert('오류', '유지 목표 체중은 시작 체중과 같아야 합니다.');
        return;
      }
    }
  
    // 체중 변경 시 추가 확인
    if (field === 'weight') {
      Alert.alert(
        'Wannabefit',
        '시작 체중을 변경하면 목표 칼로리가 변경됩니다. 계속하시겠습니까?',
        [
          { text: '아니오', style: 'cancel' },
          { text: '예', onPress: () => onSave(dataToSave) },
        ],
        { cancelable: true }
      );
    } else {
      onSave(dataToSave);
    }
  };
  

  return (
    <Modal
        isVisible={isVisible}
        onBackdropPress={onClose}
        swipeDirection="down"  // ✅ 아래로 스와이프해서 닫기
        onSwipeComplete={onClose}
        backdropOpacity={0.5}
        style={styles.modalContainer}
        animationIn="slideInUp"
        animationOut="slideOutDown"
    >
      <View style={styles.modalContent}>
        <View style={styles.headerContainer}>
          <Text style={styles.modalTitle}>{fieldTitleMap[field] || '정보 변경'}</Text>
          <TouchableOpacity style={styles.closeButtonContainer} onPress={onClose}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>

         {/* 닉네임 입력 필드 추가 ✅ */}
         {field === 'name' && (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.modalInput}
              value={value}
              onChangeText={onChangeValue}
              placeholder="새 닉네임 입력"
            />
          </View>
        )}

        {/* 목적 필드: 드롭다운 메뉴 */}
        {field === 'goal' && (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedGoal}
              onValueChange={(itemValue) => setSelectedGoal(itemValue)}
            >
              <Picker.Item label="다이어트" value="diet" />
              <Picker.Item label="벌크업" value="bulk" />
              <Picker.Item label="유지" value="maintain" />
            </Picker>
          </View>
        )}

        {/* 시작 체중, 목표 체중, 운동 빈도 입력란 */}
        {(field === 'weight' || field === 'targetWeight' || field === 'exerciseFrequency') && (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.modalInput}
              value={value}
              onChangeText={onChangeValue}
              placeholder={`새 ${fieldTitleMap[field]} 입력`}
              keyboardType="numeric"
            />
            <Text style={styles.unitLabel}>
              {field === 'weight' || field === 'targetWeight' ? 'kg' : '회/주'}
            </Text>
          </View>
        )}

        <TouchableOpacity style={styles.modalButton} onPress={handleSave}>
          <Text style={styles.modalButtonText}>완료</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default ProfileModal;
