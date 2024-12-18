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
  const { mealType = '식단', selectedDate } = route.params || {};
  const [foodList, setFoodList] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [mealList, setMealList] = useState([]);
  const [selectedTab, setSelectedTab] = useState('recent'); // 'recent' or 'favorites'
  console.log('mealType:', mealType);


  const mealTypeMap = {
    '아침': 'breakfast',
    '점심': 'lunch',
    '저녁': 'dinner',
    '간식': 'snack',
  };

  // Fetch meals for the current date and meal type
  const fetchMeals = async () => {
    console.log('FetchMeals 실행 - 선택된 날짜:', selectedDate, 'mealType:', mealType);
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        console.error('JWT 토큰이 없습니다. 로그인이 필요합니다.');
        return;
      }

      const response = await fetch(
        `${CONFIG.API_BASE_URL}/meal/meals?date=${selectedDate}&meal_type=${mealTypeMap[mealType]}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('서버에서 반환된 식단 데이터:', data);
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
    }, [selectedDate, mealType])
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
      console.log('음식 추가 요청:', {
        meal_type: mealTypeMap[mealType],
        food_ids: [food._id],
        grams: [grams],
        created_at: selectedDate,
      });

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
          meal_type: mealTypeMap[mealType],
          food_ids: [food._id],
          grams: [grams],
          created_at: selectedDate,
        }),
      });

      if (response.ok) {
        console.log('음식이 성공적으로 추가되었습니다.');
        await fetchMeals();
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
    <TouchableOpacity style={styles.foodBox} onPress={() => handleFoodSelect(item)}>
      <Text style={styles.foodName}>{item.food_name}</Text>
      <Text style={styles.foodCalories}>{item.calories} Kcal</Text>
    </TouchableOpacity>
  );
  

  const renderTabButton = (label, tabName) => (
    <TouchableOpacity onPress={() => setSelectedTab(tabName)} style={styles.tabButton}>
      <Text style={[styles.tabText, selectedTab === tabName && styles.activeTabText]}>{label}</Text>
      {selectedTab === tabName && <View style={styles.activeTabLine} />}
    </TouchableOpacity>
  );
  
  
  const renderMealItem = ({ item }) => (
    <View style={styles.mealContainer}>
      {/* whiteBox 내부 식단 데이터 */}
      <View style={styles.whiteBox}>
        <Text style={styles.totalCalories}>총 칼로리: {item.total_calories} Kcal</Text>
        <FlatList
          data={item.foods}
          keyExtractor={(foodItem, index) => `${foodItem._id}-${index}`}
          renderItem={({ item }) => (
            <View style={styles.foodBox}>
              <Text style={styles.foodName}>{item.food_name || '음식 이름 없음'}</Text>
              <Text style={styles.foodCalories}>{item.calories || 0} Kcal</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
  // 동적으로 식단 제목을 반환하는 함수
  // mealType 값을 한글 제목으로 변환하는 함수
  const getMealTitle = () => {
    // mealType이 한글로 전달된 경우에만 매칭
    const title = mealTypeMap[mealType] ? mealType : '알 수 없는';
    return `${title} 식단`;
  };
  
  return (
    <View style={styles.container}>
      <Navbar />
      <DateDisplay date={selectedDate} />
      <ContentWrapper>
        <View style={styles.searchWrapper}>
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={24} color="gray" />
            <TextInput
              style={styles.searchInput}
              placeholder="음식명, 브랜드명으로 검색"
              value={searchText}
              onChangeText={handleSearch}
            />
          </View>
          <TouchableOpacity onPress={handleClearSearch}>
            <Text style={styles.cancelText}>취소</Text>
          </TouchableOpacity>
        </View>
  
        {/* 검색 결과 */}
        {foodList.length > 0 && (
          <View style={styles.searchResultsContainer}>
            <FlatList
              data={foodList}
              keyExtractor={(item) => item._id}
              renderItem={renderFoodItem}
              ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
            />
          </View>
        )}

  
       {/* 탭 메뉴 */}
       <View style={styles.tabContainer}>
          {renderTabButton('최근 기록', 'recent')}
          {renderTabButton('즐겨찾기', 'favorites')}
        </View>
        <Text style={styles.mealTitle}>{getMealTitle()}</Text>
        {/* 탭에 따라 데이터 표시 */}
        <View style={styles.whiteBox}>
          <Text style={styles.subtitle}>{selectedTab === 'recent' ? '최근 기록' : '즐겨찾기 음식'}</Text>
          {mealList.length > 0 ? (
            <FlatList
            data={mealList}
            keyExtractor={(item) => `${item._id}-${item.__v}`}
            renderItem={renderMealItem}
          />
          ) : (
            <Text style={styles.noResultsText}>등록된 음식이 없습니다.</Text>
          )}
        </View>
      </ContentWrapper>
      <FoodDetailModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        food={selectedFood}
        onAddFood={handleAddFood}
      />
      <Footer />
    </View>
  );
  
};

export default MealSettingScreen;
