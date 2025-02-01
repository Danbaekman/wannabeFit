import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './MealDirectInputScreenStyles';
import CONFIG from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MealDirectInputScreen = ({ navigation, route }) => {
  const { selectedDate, mealType } = route.params || {};
  
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [carbohydrates, setCarbohydrates] = useState('');
  const [protein, setProtein] = useState('');
  const [fat, setFat] = useState('');
  const [saturatedFat, setSaturatedFat] = useState('');
  const [transFat, setTransFat] = useState('');
  const [natrium, setNatrium] = useState('');
  const [sugar, setSugar] = useState('');
  const [dietaryFiber, setDietaryFiber] = useState('');

  const handleSubmit = async () => {
    if (!foodName || !calories || !carbohydrates || !protein || !fat) {
      Alert.alert('필수 입력', '음식명, 열량, 탄수화물, 단백질, 지방을 입력해주세요.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }

      const payload = {
        food_name: foodName,
        calories: parseFloat(calories),
        carbohydrates: parseFloat(carbohydrates),
        protein: parseFloat(protein),
        fat: parseFloat(fat),
        saturated_fat: parseFloat(saturatedFat),
        trans_fat: parseFloat(transFat),
        natrium: parseFloat(natrium),
        sugar: parseFloat(sugar),
        dietary_fiber: parseFloat(dietaryFiber),
        meal_type: mealType,
        created_at: selectedDate,
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
          '즐겨찾기에 추가하시면 다음에 쉽게 해당 음식을 식단에 등록하실 수 있습니다.\n등록하시겠습니까?',
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
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.header}>직접 입력</Text>
      <Text style={styles.label}>음식명 <Text style={styles.required}>*</Text></Text>
      <TextInput style={styles.input} value={foodName} onChangeText={setFoodName} placeholder="음식 이름 입력" />
      
      <View style={styles.row}><Text style={styles.label}>열량 <Text style={[styles.required, { color: '#008080' }]}>*</Text></Text><TextInput style={styles.input} value={calories} onChangeText={setCalories} placeholder="kcal" keyboardType="numeric" /></View>
      <View style={styles.row}><Text style={styles.label}>탄수화물 <Text style={[styles.required, { color: '#008080' }]}>*</Text></Text><TextInput style={styles.input} value={carbohydrates} onChangeText={setCarbohydrates} placeholder="g" keyboardType="numeric" /></View>
      <View style={styles.row}><Text style={styles.label}>단백질 <Text style={[styles.required, { color: '#008080' }]}>*</Text></Text><TextInput style={styles.input} value={protein} onChangeText={setProtein} placeholder="g" keyboardType="numeric" /></View>
      <View style={styles.row}><Text style={styles.label}>지방 <Text style={[styles.required, { color: '#008080' }]}>*</Text></Text><TextInput style={styles.input} value={fat} onChangeText={setFat} placeholder="g" keyboardType="numeric" /></View>
      <View style={styles.row}><Text style={styles.label}>포화지방</Text><TextInput style={styles.input} value={saturatedFat} onChangeText={setSaturatedFat} placeholder="g" keyboardType="numeric" /></View>
      <View style={styles.row}><Text style={styles.label}>트랜스지방</Text><TextInput style={styles.input} value={transFat} onChangeText={setTransFat} placeholder="g" keyboardType="numeric" /></View>
      <View style={styles.row}><Text style={styles.label}>나트륨</Text><TextInput style={styles.input} value={natrium} onChangeText={setNatrium} placeholder="mg" keyboardType="numeric" /></View>
      <View style={styles.row}><Text style={styles.label}>당류</Text><TextInput style={styles.input} value={sugar} onChangeText={setSugar} placeholder="g" keyboardType="numeric" /></View>
      <View style={styles.row}><Text style={styles.label}>식이섬유</Text><TextInput style={styles.input} value={dietaryFiber} onChangeText={setDietaryFiber} placeholder="g" keyboardType="numeric" /></View>
      
      <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>완료</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MealDirectInputScreen;
