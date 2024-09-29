import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const DirectRegisterScreen = () => {
  // 상태 관리: 기본 필드
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [carbs, setCarbs] = useState('');
  const [protein, setProtein] = useState('');
  const [fat, setFat] = useState('');

  // 영양 성분 계산 (단순 계산, 예시)
  const handleSave = () => {
    if (!foodName || !calories || !carbs || !protein || !fat) {
      Alert.alert('모든 필드를 입력하세요.');
      return;
    }

    // 영양 성분을 저장하거나 처리할 로직 추가 가능
    Alert.alert(
      '음식 등록 완료',
      `음식: ${foodName}\n칼로리: ${calories} kcal\n탄수화물: ${carbs}g\n단백질: ${protein}g\n지방: ${fat}g`
    );
  };

  return (
    <View style={styles.container}>
      {/* 음식 이름 입력 */}
      <TextInput
        style={styles.input}
        placeholder="음식 이름"
        value={foodName}
        onChangeText={setFoodName}
      />

      {/* 칼로리 입력 */}
      <TextInput
        style={styles.input}
        placeholder="칼로리 (kcal)"
        keyboardType="numeric"
        value={calories}
        onChangeText={setCalories}
      />

      {/* 탄수화물 입력 */}
      <TextInput
        style={styles.input}
        placeholder="탄수화물 (g)"
        keyboardType="numeric"
        value={carbs}
        onChangeText={setCarbs}
      />

      {/* 단백질 입력 */}
      <TextInput
        style={styles.input}
        placeholder="단백질 (g)"
        keyboardType="numeric"
        value={protein}
        onChangeText={setProtein}
      />

      {/* 지방 입력 */}
      <TextInput
        style={styles.input}
        placeholder="지방 (g)"
        keyboardType="numeric"
        value={fat}
        onChangeText={setFat}
      />

      {/* 등록 버튼 */}
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>등록하기</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DirectRegisterScreen;
