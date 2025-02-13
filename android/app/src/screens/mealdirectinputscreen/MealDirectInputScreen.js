import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './MealDirectInputScreenStyles';
import CONFIG from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MealDirectInputScreen = ({ navigation, route }) => {
  const { selectedDate, mealType } = route.params || {}; // ⬅ mealType 받아오기

  const mealTypeMap = {
    '아침': 'breakfast',
    '점심': 'lunch',
    '저녁': 'dinner',
    '간식': 'snack',
  };

  const [foodName, setFoodName] = useState('');

  // 영양소 목록
  const [nutrients, setNutrients] = useState([
    { label: '열량', value: 'kcal', unit: 'kcal', required: true },
    { label: '탄수화물', value: 'g', unit: 'g', required: true },
    { label: '단백질', value: 'g', unit: 'g', required: true },
    { label: '지방', value: 'g', unit: 'g', required: true },
    { label: '포화지방', value: 'g', unit: 'g', required: false },
    { label: '트랜스지방', value: 'g', unit: 'g', required: false },
    { label: '나트륨', value: 'mg', unit: 'mg', required: false },
    { label: '당류', value: 'g', unit: 'g', required: false },
    { label: '식이섬유', value: 'g', unit: 'g', required: false },
  ]);

  // 입력값 처리 함수 (커서 위치 유지)
  const handleInputChange = (text, index) => {
    const numericValue = text.replace(/[^0-9.]/g, ''); // 숫자만 허용
    const updatedNutrients = [...nutrients];
    updatedNutrients[index].value = numericValue ? `${numericValue}${updatedNutrients[index].unit}` : updatedNutrients[index].unit;
    updatedNutrients[index].cursorPosition = numericValue.length; // 커서를 숫자 끝부분으로 설정
    setNutrients(updatedNutrients);
  };

  const handleAddToFavorites = async (foodData) => {
    try {
      const savedFavorites = await AsyncStorage.getItem('favorites');
      const favorites = savedFavorites ? JSON.parse(savedFavorites) : [];
  
      // 중복 방지: 동일한 음식이 있는지 확인
      const isDuplicate = favorites.some(fav => fav.food_name === foodData.food_name);
      if (!isDuplicate) {
        favorites.push(foodData);
        await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
        alert('즐겨찾기에 추가되었습니다.');
      } else {
        alert('이미 즐겨찾기에 추가된 음식입니다.');
      }
  
      navigation.goBack();
    } catch (error) {
      console.error('Error adding to favorites:', error);
      alert('즐겨찾기 추가 중 오류가 발생했습니다.');
    }
  };
  

  // 서버로 데이터 전송
  const handleSubmit = async () => {
    if (!foodName) {
      Alert.alert('필수 입력', '음식명을 입력해주세요.');
      return;
    }

    // 필수 입력 항목 확인
    const missingFields = nutrients
      .filter(nutrient => nutrient.required && nutrient.value === nutrient.unit)
      .map(nutrient => nutrient.label);

    if (missingFields.length > 0) {
      Alert.alert('필수 입력', `${missingFields.join(', ')} 값을 입력해주세요.`);
      return;
    }

    try {
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }

      // mealType 변환
      const convertedMealType = mealTypeMap[mealType] || 'snack';

      // 필수 및 선택 입력 값 처리
      const payload = {
        food_name: foodName,
        calories: parseFloat(nutrients[0].value.replace('kcal', '')),
        carbohydrates: parseFloat(nutrients[1].value.replace('g', '')),
        protein: parseFloat(nutrients[2].value.replace('g', '')),
        fat: parseFloat(nutrients[3].value.replace('g', '')),
        saturated_fat: nutrients[4].value === 'g' ? null : parseFloat(nutrients[4].value.replace('g', '')),
        trans_fat: nutrients[5].value === 'g' ? null : parseFloat(nutrients[5].value.replace('g', '')),
        natrium: nutrients[6].value === 'mg' ? null : parseFloat(nutrients[6].value.replace('mg', '')),
        sugar: nutrients[7].value === 'g' ? null : parseFloat(nutrients[7].value.replace('g', '')),
        dietary_fiber: nutrients[8].value === 'g' ? null : parseFloat(nutrients[8].value.replace('g', '')),
        meal_type: convertedMealType, // ⬅ mealType 포함
        created_at: selectedDate,
        isCustom: true,
      };

      const response = await fetch(`${CONFIG.API_BASE_URL}/meal/direct-add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        Alert.alert(
          'WannabeFit',
          '즐겨찾기에 추가하시겠습니까?',
          [
            { text: '아니오', onPress: () => navigation.goBack(), style: 'cancel' },
            { text: '예', onPress: () => handleAddToFavorites(payload) },
          ]
        );
      } else {
        const errorText = await response.text();
        alert(`추가 실패: ${errorText}`);
      }
    } catch (error) {
      alert('음식 추가 중 오류 발생');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={32} color="black" />
        </TouchableOpacity>
        <Text style={styles.header}>직접 입력</Text>
      </View>

      <Text style={styles.label}>음식명 <Text style={[styles.required, { color: '#008080' }]}>*</Text></Text>
      <TextInput style={styles.foodNameInput} value={foodName} onChangeText={setFoodName} placeholder="음식 이름 입력" />

      {nutrients.map((nutrient, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.label}>
            {nutrient.label} {nutrient.required && <Text style={[styles.required, { color: '#008080' }]}>*</Text>}
          </Text>
          <TextInput 
            style={styles.input} 
            value={nutrient.value} 
            onChangeText={(text) => handleInputChange(text, index)} 
            placeholder={nutrient.unit} 
            keyboardType="numeric"
            selection={{ start: nutrient.cursorPosition, end: nutrient.cursorPosition }} // ✅ 커서 위치 유지
            onSelectionChange={() => {
              const updatedNutrients = [...nutrients];
              updatedNutrients[index].cursorPosition = updatedNutrients[index].value.length - updatedNutrients[index].unit.length;
              setNutrients(updatedNutrients);
            }} 
          />
        </View>
      ))}

      <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>완료</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MealDirectInputScreen;
