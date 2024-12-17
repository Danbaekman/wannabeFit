import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import styles from './MealSettingScreenStyles';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';
import DateDisplay from '../../components/datedisplay/DateDisplay';
import ContentWrapper from '../../components/contentwrapper/ContentWrapper';
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
          Authorization: `Bearer ${token}`,
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
            Authorization: `Bearer ${token}`,
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
          Authorization: `Bearer ${token}`,
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
  const handleClearSearch = () => {
    setSearchText('');
    setFoodList([]);
  };
  

  const renderFoodItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleFoodSelect(item)} style={styles.itemContainer}>
      <View style={styles.itemContent}>
        <Text style={styles.foodName}>{item.food_name}</Text>
        <Text style={styles.foodCalories}>{item.calories} Kcal</Text>
      </View>
    </TouchableOpacity>
  );

  const renderMealItem = ({ item }) => (
    <View style={styles.mealContainer}>
      <Text style={styles.mealType}>{item.meal_type} 식단</Text>
      <Text style={styles.totalCalories}>총 칼로리: {item.total_calories} Kcal</Text>
      {/* 각 음식 개별 박스 출력 */}
      <FlatList
        data={item.foods}
        keyExtractor={(foodItem, index) => `${foodItem._id}-${index}`}
        renderItem={({ item }) => (
          <View style={styles.foodBox}>
            <Text style={styles.foodName}>{item.food_name || '음식 이름 없음'}</Text>
            <Text style={styles.foodCalories}>{item.calories || 0} Kcal</Text>
          </View>
        )}
        ListEmptyComponent={<Text>음식 목록이 없습니다.</Text>}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 상단 Navbar */}
      <Navbar />
      {/* 날짜 표시 */}
      <DateDisplay />
  
      {/* 회색 컨텐츠 박스 */}
      <ContentWrapper>
        {/* 검색창과 취소 버튼 */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={24} color="gray" />
          <TextInput
            style={styles.searchInput}
            placeholder="음식명, 브랜드명으로 검색"
            value={searchText}
            onChangeText={handleSearch}
          />
          <TouchableOpacity onPress={handleClearSearch}>
            <Text style={styles.cancelText}>취소</Text>
          </TouchableOpacity>
        </View>
  
        {/* 검색 결과 - 덮어씌우는 형태 */}
        {foodList.length > 0 && (
          <View style={styles.searchResultsContainer}>
            <FlatList
              data={foodList}
              keyExtractor={(item) => item._id}
              renderItem={renderFoodItem}
              ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
              ListEmptyComponent={
                <Text style={styles.noResultsText}>검색된 음식이 없습니다.</Text>
              }
            />
          </View>
        )}
  
        {/* 식단 제목과 목록 */}
        <View style={styles.header}>
          <Text style={styles.mealTitle}>{mealType} 식단</Text>
        </View>
        <View style={styles.whiteBox}>
          <Text style={styles.subtitle}>추가된 음식 목록</Text>
          {mealList.length > 0 ? (
            <FlatList
              data={mealList}
              keyExtractor={(item) => `${item._id}-${item.__v}`}
              renderItem={renderMealItem}
              ListEmptyComponent={
                <Text style={styles.noResultsText}>식단이 비어 있습니다.</Text>
              }
            />
          ) : (
            <Text style={styles.noResultsText}>식단이 비어 있습니다.</Text>
          )}
        </View>
      </ContentWrapper>
  
      {/* Food Detail Modal */}
      <FoodDetailModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        food={selectedFood}
      />
  
      {/* 하단 Footer */}
      <Footer />
    </View>
  );  
  
};

export default MealSettingScreen;
