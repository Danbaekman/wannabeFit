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
  const [selectedTab, setSelectedTab] = useState('recent');
  const [favoritesList, setFavoritesList] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false); // 편집 모드


  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const savedFavorites = await AsyncStorage.getItem('favorites');
        const favorites = savedFavorites ? JSON.parse(savedFavorites) : [];
        setFavoritesList(favorites);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchFavorites();
  }, []);

  const mealTypeMap = {
    '아침': 'breakfast',
    '점심': 'lunch',
    '저녁': 'dinner',
    '간식': 'snack',
  };

  const fetchMeals = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        console.error('No JWT token found. Please log in.');
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
        setMealList(data);
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch meal list:', response.status, errorText);
      }
    } catch (error) {
      console.error('Error fetching meal list:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMeals();
    }, [selectedDate, mealType])
  );

  
  const handleSearch = async (text) => {
    setSearchText(text);
    if (text.length > 0) {
      try {
        const token = await AsyncStorage.getItem('jwtToken');
        if (!token) {
          console.error('No JWT token found. Please log in.');
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
          console.error('Failed to fetch search results:', response.status);
        }
      } catch (error) {
        console.error('Error during search:', error);
      }
    } else {
      setFoodList([]);
    }
  };

  const handleFoodSelect = (food) => {
    const isFavorite = favoritesList.some((item) => item._id === food._id);
    setSelectedFood({ ...food, isFavorite });
    setModalVisible(true);
  };

  const handleAddFood = async (foodData) => {
    try {
      const { food, quantity, isFavorite } = foodData;

      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        Alert.alert('Error', 'You must be logged in.');
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
          grams: [quantity],
          created_at: selectedDate,
        }),
      });

      if (response.ok) {
        if (isFavorite) {
          const savedFavorites = await AsyncStorage.getItem('favorites');
          const favorites = savedFavorites ? JSON.parse(savedFavorites) : [];
          const updatedFavorites = [...favorites.filter((f) => f._id !== food._id), food];
          await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
          setFavoritesList(updatedFavorites);
        }

        await fetchMeals();
        setModalVisible(false);
      } else {
        const errorText = await response.text();
        console.error('Failed to add food:', response.status, errorText);
      }
    } catch (error) {
      console.error('Error adding food:', error);
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

  const renderMealItem = ({ item }) => {
    return selectedTab === 'favorites' ? (
      // Favorites Tab: 개별 음식 렌더링
      <View style={styles.foodRow}>
        <Text style={styles.foodName}>{item.food_name || 'Unknown Food'}</Text>
        <Text style={styles.foodCalories}>{item.calories || 0} Kcal</Text>
  
        {/* 편집 모드 활성화 시 편집/삭제 버튼 표시 */}
        {isEditMode && (
          <View style={styles.editControls}>
            <TouchableOpacity
              onPress={() => handleEditFavorite(item)}
              style={styles.editButton}
            >
              <Ionicons name="pencil" size={20} color="gray" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDeleteFavorite(item._id)} // Favorites 삭제
              style={styles.deleteButton}
            >
              <Ionicons name="close-circle" size={20} color="red" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    ) : (
      // Recent Tab: mealList 렌더링
      <View style={styles.mealContainer}>
        <Text style={styles.mealType}>
          {mealTypeMap[item.meal_type] || 'Meal'} ({item.total_calories} Kcal)
        </Text>
  
        <FlatList
          data={item.foods} // foods 배열 렌더링
          keyExtractor={(foodItem, index) => `${foodItem._id}-${index}`}
          renderItem={({ item: foodItem }) => (
            <View style={styles.foodRow}>
              <Text style={styles.foodName}>{foodItem.food_name || 'Unknown Food'}</Text>
              <Text style={styles.foodCalories}>{foodItem.calories || 0} Kcal</Text>
  
              {isEditMode && (
                <View style={styles.editControls}>
                  <TouchableOpacity
                    onPress={() => handleEditFavorite(foodItem)}
                    style={styles.editButton}
                  >
                    <Ionicons name="pencil" size={20} color="gray" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteMealItem(item._id, foodItem._id)} // mealId와 foodId 전달
                    style={styles.deleteButton}
                  >
                    <Ionicons name="close-circle" size={20} color="red" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        />
      </View>
    );
  };
  
  
  
  const renderEditButton = () => (
    <TouchableOpacity onPress={() => setIsEditMode(!isEditMode)} style={styles.editModeButton}>
      <Text style={styles.editButtonText}>편집모드</Text>
    </TouchableOpacity>
  );

  // 삭제 처리 함수 
  const handleDeleteMealItem = async (mealId, foodId) => {
    const url = `${CONFIG.API_BASE_URL}/meal/${mealId}/food/${foodId}`;
    console.log('DELETE URL:', url); // URL 확인
    console.log('Deleting Meal:', mealId);
    console.log('Deleting Food:', foodId);
  
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        Alert.alert('Error', 'You must be logged in.');
        return;
      }
  
      // 서버와 동일한 형식으로 foodId를 전달
      const normalizedFoodId = foodId.toString(); // 문자열로 변환
  
      const response = await fetch(`${CONFIG.API_BASE_URL}/meal/${mealId}/food/${foodId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        await fetchMeals(); // 삭제 후 목록 갱신
        Alert.alert('Success', 'Food item removed successfully.');
      } else {
        const errorText = await response.text();
        console.error('Failed to delete food:', response.status, errorText);
        Alert.alert('Error', `Failed to delete food: ${errorText}`);
      }
    } catch (error) {
      console.error('Error deleting food:', error);
      Alert.alert('Error', 'An unexpected error occurred while deleting food.');
    }
  };
  
  

// 즐겨찾기 삭제 처리 함수 (로컬)
const handleDeleteFavorite = (foodId) => {
  const updatedFavorites = favoritesList.filter((item) => item._id !== foodId);
  setFavoritesList(updatedFavorites);
  AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
};

  const getMealTitle = () => {
    const title = mealTypeMap[mealType] ? mealType : 'Unknown';
    return `${title} Meal`;
  };

  const getFilteredMealList = () => {
    return selectedTab === 'favorites' ? favoritesList : mealList;
  };
  const handleEditFavorite = (food) => {
    // 편집 모달을 열고 선택된 음식 설정
    setSelectedFood(food);
    setModalVisible(true);
  };
  const handleModalClose = () => {
    setModalVisible(false);
    setSearchText(''); // 검색 텍스트 초기화
    setFoodList([]); // 검색 결과 초기화
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
              placeholder="Search by food or brand"
              value={searchText}
              onChangeText={handleSearch}
            />
          </View>
          <TouchableOpacity onPress={handleClearSearch}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        {foodList.length > 0 && (
          <View style={styles.searchResultsContainer}>
            <FlatList
              data={foodList}
              extraData={isEditMode}
              keyExtractor={(foodItem, index) => `${foodItem._id || index}`}
              renderItem={renderFoodItem}
            />
          </View>
        )}

        <TouchableOpacity onPress={() => console.log('Direct Add Button Pressed')} style={styles.directInputButton}>
          <Text style={styles.directInputText}>+ Add Directly</Text>
        </TouchableOpacity>

        <View style={styles.tabContainer}>
          {renderTabButton('Recent', 'recent')}
          {renderTabButton('Favorites', 'favorites')}
        </View>

        <Text style={styles.mealTitle}>{getMealTitle()}</Text>
        {renderEditButton()}

        <View style={styles.whiteBox}>
          <FlatList
            data={getFilteredMealList()}
            keyExtractor={(item) => item._id}
            renderItem={renderMealItem}
          />
        </View>
      </ContentWrapper>

      <FoodDetailModal
        visible={modalVisible}
        onClose={handleModalClose}
        food={selectedFood}
        initialFavorite={
          selectedTab === 'favorites' ||
          (selectedFood && favoritesList.some((favorite) => favorite._id === selectedFood._id))
        }
        onFavoriteChange={(updatedFood) => {
          const updatedFavorites = favoritesList.filter((item) => item._id !== updatedFood._id);
          setFavoritesList(updatedFavorites);
          AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        }}
        entryPoint={selectedTab === 'favorites' ? 'favorites' : 'search'}
        onAddFood={handleAddFood}
      />

      <Footer />
    </View>
  );
};

export default MealSettingScreen;
