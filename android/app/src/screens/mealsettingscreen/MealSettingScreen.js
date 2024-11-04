import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import styles from './MealSettingScreenStyles';
import Navbar from '../../components/navbar/Navbar';
import FoodDetailModal from '../../components/modal/FoodDetailModal';
import CONFIG from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MealSettingScreen = ({ route = {}, navigation }) => {
  const { mealType = '식단' } = route.params || {};  
  const [foodList, setFoodList] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [mealList, setMealList] = useState([]);

  // Fetch meals for the current date and meal type
  const fetchMeals = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        console.error('JWT 토큰이 없습니다. 로그인이 필요합니다.');
        return;
      }

      const date = new Date().toISOString().split("T")[0];
      const response = await fetch(`${CONFIG.API_BASE_URL}/meal/meals?date=${date}&meal_type=${mealType}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMealList(data);
      } else {
        const errorText = await response.text();
        console.error('식단 목록을 불러오는 데 실패했습니다.', response.status, errorText);
      }
    } catch (error) {
      console.error('식단 목록을 불러오는 중 오류 발생:', error);
    }
  };

  // Fetch meals on screen focus
  useFocusEffect(
    useCallback(() => {
      fetchMeals();
    }, [])
  );

  // Handle food search
  const handleSearch = async (text) => {
    setSearchText(text);
    if (text.length > 0) {
      try {
        const token = await AsyncStorage.getItem('jwtToken');
        if (!token) {
          console.error('JWT 토큰이 없습니다. 로그인이 필요합니다.');
          return;
        }

        const response = await fetch(`${CONFIG.API_BASE_URL}/food/search?query=${text}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setFoodList(data);
        } else {
          console.error('검색 결과를 불러오는 데 실패했습니다.', response.status);
        }
      } catch (error) {
        console.error('검색 중 오류 발생:', error);
      }
    } else {
      setFoodList([]);
    }
  };

  // Handle food selection
  const handleFoodSelect = (food) => {
    setSelectedFood(food);
    setModalVisible(true);
  };

  // Handle adding food to meal
  const handleAddFood = async (food, grams) => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        Alert.alert('오류', '로그인이 필요합니다.');
        return;
      }

      const response = await fetch(`${CONFIG.API_BASE_URL}/meal/meal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          meal_type: mealType,
          food_ids: [food._id],
          grams: [grams],
          created_at: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        await fetchMeals(); // Refresh meal list
        setModalVisible(false);
        setSearchText('');
        setFoodList([]);
      } else {
        const errorText = await response.text();
        console.error('음식 추가 실패:', response.status, errorText);
      }
    } catch (error) {
      console.error('음식 추가 중 오류 발생:', error);
    }
  };

  // Handle food removal from meal
  const handleRemoveFood = async (mealId, foodId) => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        Alert.alert('오류', '로그인이 필요합니다.');
        return;
      }

      const response = await fetch(`${CONFIG.API_BASE_URL}/meal/${mealId}/food/${foodId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await fetchMeals(); // Refresh meal list
      } else {
        const errorText = await response.text();
        console.error('음식 제거 실패:', response.status, errorText);
      }
    } catch (error) {
      console.error('음식 제거 중 오류 발생:', error);
    }
  };

  const renderFoodItem = ({ item }) => (
    <View style={styles.foodBox}>
      <Text style={styles.foodName}>{item.food_name || "음식 이름 없음"}</Text>
      <Text style={styles.foodCalories}>{item.calories || 0} Kcal</Text>
    </View>
  );
  

  const renderMealItem = ({ item }) => (
    <View style={styles.mealContainer}>
      <Text style={styles.mealType}>{item.meal_type} 식단</Text>
      <Text style={styles.totalCalories}>총 칼로리: {item.total_calories} Kcal</Text>
      {/* 각 음식 개별 박스 출력 */}
      <FlatList
        data={item.foods}
        keyExtractor={(foodItem, index) => `${foodItem._id}-${index}`}  // `foods` 배열의 `_id` 사용
        renderItem={renderFoodItem}
        ListEmptyComponent={<Text>음식 목록이 없습니다.</Text>}
      />
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <Navbar />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text>{mealType + ' 식단'}</Text>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={24} color="gray" />
          <TextInput
            style={styles.searchInput}
            placeholder="음식 검색"
            value={searchText}
            onChangeText={handleSearch}
          />
        </View>

        {/* Food search results */}
        {foodList.length > 0 && (
         <FlatList
         data={foodList}
         keyExtractor={item => item._id}
         renderItem={({ item }) => (
           <TouchableOpacity onPress={() => handleFoodSelect(item)} style={styles.itemContainer}>
             <View style={styles.itemContent}>
               <Text style={styles.foodName}>{item.food_name}</Text>
               <Text style={styles.foodCalories}>{item.calories} Kcal</Text>
             </View>
           </TouchableOpacity>
         )}
         ListEmptyComponent={<Text>음식 목록이 없습니다.</Text>}
       />
        )}

        {/* Added meals list */}
        <FlatList
          data={mealList}
          keyExtractor={(item) => `${item._id}-${item.__v}`}
          renderItem={renderMealItem}
          ListEmptyComponent={<Text>식단 목록이 없습니다.</Text>}
        />

        {/* Food detail modal */}
        <FoodDetailModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          food={selectedFood}
          onAddFood={(food, grams) => handleAddFood(food, grams)}
        />
      </View>
    </View>
  );
};

export default MealSettingScreen;
