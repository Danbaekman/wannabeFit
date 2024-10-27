import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './MealSettingScreenStyles';
import Navbar from '../../components/navbar/Navbar';
import FoodDetailModal from '../../components/modal/FoodDetailModal';
import CONFIG from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MealSettingScreen = ({ route = {}, navigation }) => {
  const { mealType = '식단' } = route.params || {};  // mealType이 없을 경우 기본값 '식단'으로 설정
  const [foodList, setFoodList] = useState([]); // 서버에서 받아올 음식 데이터를 저장할 상태
  const [searchText, setSearchText] = useState('');
  const [selectedFood, setSelectedFood] = useState(null); // 모달에 표시할 음식 정보
  const [modalVisible, setModalVisible] = useState(false);
  const [mealList, setMealList] = useState([]); // 서버에서 받아온 식단 목록을 저장할 상태

  // 서버에서 식단 목록 불러오기
  const fetchMeals = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken'); // 저장된 JWT 토큰 가져오기
      if (!token) {
        console.error('JWT 토큰이 없습니다. 로그인이 필요합니다.');
        return;
      }

      const response = await fetch(`${CONFIG.API_BASE_URL}/meal/meals`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // 토큰을 헤더에 포함
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMealList(data); // 식단 목록 업데이트
      } else {
        console.error('식단 목록을 불러오는 데 실패했습니다.', response.status);
        const errorText = await response.text();
        console.error(errorText);
      }
    } catch (error) {
      console.error('식단 목록을 불러오는 중 오류 발생:', error);
    }
  };

  // 음식 검색 기능
  const handleSearch = async (text) => {
    setSearchText(text);
    if (text.length > 0) {
      try {
        const token = await AsyncStorage.getItem('jwtToken'); // 저장된 JWT 토큰 가져오기
        if (!token) {
          console.error('JWT 토큰이 없습니다. 로그인이 필요합니다.');
          return;
        }

        const response = await fetch(`${CONFIG.API_BASE_URL}/food/search?query=${text}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // 토큰을 헤더에 포함
          },
        });

        if (response.ok) {
          const data = await response.json();
          setFoodList(data); // 검색 결과 업데이트
        } else {
          console.error('검색 결과를 불러오는 데 실패했습니다.', response.status);
          const errorText = await response.text();
          console.error(errorText);
        }
      } catch (error) {
        console.error('검색 중 오류 발생:', error);
      }
    } else {
      setFoodList([]); // 검색어가 없을 경우 음식 목록을 비움
    }
  };

  // 음식 선택 시 모달을 열고 선택된 음식 정보 저장
  const handleFoodSelect = (food) => {
    setSelectedFood(food);
    setModalVisible(true);
  };

  // 음식 추가 시 서버에 저장 요청
  const handleAddFood = async (food) => {
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
          user_id: 'user_id', // 실제로는 사용자 ID를 넣어야 함
          food_name: food.food_name,
          protein: food.protein,
          fat: food.fat,
          calories: food.calories,
        }),
      });

      if (response.ok) {
        const newMeal = await response.json();
        setMealList(prevMeals => [...prevMeals, newMeal]); // 식단 목록에 새로 추가된 식단 추가
        setModalVisible(false);
      } else {
        console.error('음식 추가 실패:', response.status);
        const errorText = await response.text();
        console.error(errorText);
      }
    } catch (error) {
      console.error('음식 추가 중 오류 발생:', error);
    }
  };

  // 초기 화면에서 식단 목록 불러오기
  useEffect(() => {
    fetchMeals();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleFoodSelect(item)} style={styles.itemContainer}>
      <View style={styles.itemContent}>
        <Text style={styles.foodName}>{item.food_name}</Text>
        <Text style={styles.foodCalories}>{item.calories} Kcal</Text>
      </View>
    </TouchableOpacity>
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

        <FlatList
          data={foodList}
          keyExtractor={item => item._id || item.food_name}
          renderItem={renderItem}
          ListEmptyComponent={<Text>음식 목록이 없습니다.</Text>}
        />

        <FlatList
          data={mealList}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text>{item.food_name}</Text>
              <Text>{item.calories} kcal</Text>
            </View>
          )}
        />

        {/* 음식 상세 정보 모달 */}
        <FoodDetailModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          food={selectedFood}
          onAddFood={handleAddFood}
        />
      </View>
    </View>
  );
};

export default MealSettingScreen;
