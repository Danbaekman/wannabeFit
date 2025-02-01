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


  // useEffect(() => {
  //   const fetchFavorites = async () => {
  //     try {
  //       const savedFavorites = await AsyncStorage.getItem('favorites');
  //       const favorites = savedFavorites ? JSON.parse(savedFavorites) : [];
  //       setFavoritesList(favorites);
  //     } catch (error) {
  //       console.error('Error fetching favorites:', error);
  //     }
  //   };

  //   fetchFavorites();
  // }, []);
  
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const savedFavorites = await AsyncStorage.getItem('favorites');
        const favorites = savedFavorites ? JSON.parse(savedFavorites) : [];
  
        const syncedFavorites = favorites.map((favorite) => {
          const matchingMeal = mealList.find((meal) =>
            meal.foods.some((food) => food.food._id === favorite._id)
          );
        
          if (matchingMeal) {
            const matchingFood = matchingMeal.foods.find(
              (food) => food.food._id === favorite._id
            );
        
            return {
              ...favorite,
              food_name: matchingFood?.food.food_name || favorite.food_name,
              calories:
                (matchingFood?.food.calories || 0) * (matchingFood?.grams / 100 || 1),
              grams: matchingFood?.grams || favorite.grams,
              mealId: matchingMeal._id || favorite.mealId,
            };
          }
          return favorite;
        });
        
  
        setFavoritesList(syncedFavorites);
        await AsyncStorage.setItem('favorites', JSON.stringify(syncedFavorites));
      } catch (error) {
        console.error('Error syncing favorites:', error);
      }
    };
  
    fetchFavorites();
  }, [mealList]);
  
  useEffect(() => {
    console.log("Favorites List:", favoritesList);
  }, [favoritesList]);
  
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
        `${CONFIG.API_BASE_URL}/meal/meals/?date=${selectedDate}&meal_type=${mealTypeMap[mealType]}`,
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
  
        // 서버 데이터를 기반으로 즐겨찾기 동기화
        const syncedFavorites = favoritesList.map((favorite) => {
          const matchingMeal = data.find((meal) =>
            meal.foods.some((food) => food.food._id === favorite._id)
          );
  
          if (matchingMeal) {
            const matchingFood = matchingMeal.foods.find(
              (food) => food.food._id === favorite._id
            );
            return {
              ...favorite,
              calories: (matchingFood.food.calories * (matchingFood.grams / 100)).toFixed(2),
              grams: matchingFood.grams,
            };
          }
          return favorite; // 일치하는 음식이 없는 경우 기본값 유지
        });
  
        // 상태 업데이트
        setFavoritesList(syncedFavorites);
  
        // **동기화된 favoritesList를 AsyncStorage에 저장**
        await AsyncStorage.setItem('favorites', JSON.stringify(syncedFavorites));
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
      const fetchData = async () => {
        try {
          // 1. AsyncStorage에서 favoritesList 가져오기
          const savedFavorites = await AsyncStorage.getItem('favorites');
          const favorites = savedFavorites ? JSON.parse(savedFavorites) : [];
  
          // 2. 서버에서 mealList 가져오기
          const token = await AsyncStorage.getItem('jwtToken');
          if (!token) {
            console.error('No JWT token found. Please log in.');
            return;
          }
  
          const response = await fetch(
            `${CONFIG.API_BASE_URL}/meal/meals/?date=${selectedDate}&meal_type=${mealTypeMap[mealType]}`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
  
          if (response.ok) {
            const mealData = await response.json();
  
            // 3. favorites와 mealData 동기화
            const syncedFavorites = favorites.map((favorite) => {
              const matchingMeal = mealData.find((meal) =>
                meal.foods.some((food) => food.food._id === favorite._id)
              );
  
              if (matchingMeal) {
                const matchingFood = matchingMeal.foods.find(
                  (food) => food.food._id === favorite._id
                );
                return {
                  ...favorite,
                  calories: matchingFood
                    ? (matchingFood.food.calories * (matchingFood.grams / 100)).toFixed(2)
                    : favorite.calories,
                  grams: matchingFood ? matchingFood.grams : favorite.grams,
                };
              }
              return favorite; // 일치하는 음식이 없는 경우 기본값 유지
            });
  
            setMealList(mealData);
            setFavoritesList(syncedFavorites);
          } else {
            const errorText = await response.text();
            console.error('Failed to fetch meal list:', response.status, errorText);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, [selectedDate, mealType]) // 날짜와 식단 타입 변경 시 호출
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
    console.log('handleAddFood called');
  
    try {
      const { food, quantity, isFavorite } = foodData;
  
      // 서버로 전송할 데이터
      const foodPayload = {
        food: food.food, // 음식 ID
        grams: quantity, // 섭취량 (그램)
      };
  
      const payload = {
        meal_type: mealTypeMap[mealType],
        foods: [foodPayload],
        created_at: selectedDate,
      };
  
      console.log('Payload being sent to server:', JSON.stringify(payload, null, 2));
  
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
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        console.log('Food successfully added to meal.');
  
        await fetchMeals(); // 식단 목록 갱신
        setModalVisible(false); // 모달 닫기
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

  // 검색했을 때 식단목록 나열
  const renderFoodItem = ({ item }) => (
    <TouchableOpacity style={styles.foodRow} onPress={() => handleFoodSelect(item)}>
      <Text style={styles.foodName}> {item.food_name || item.food?.food_name || '음식 이름 오류'}</Text>
      <Text style={styles.foodCalories}>{item.calories} Kcal</Text>
    </TouchableOpacity>
  );

  const renderTabButton = (label, tabName) => (
    <TouchableOpacity onPress={() => setSelectedTab(tabName)} style={styles.tabButton}>
      <Text style={[styles.tabText, selectedTab === tabName && styles.activeTabText]}>{label}</Text>
      {selectedTab === tabName && <View style={styles.activeTabLine} />}
    </TouchableOpacity>
  );

  const renderMealItem = ({ item, index }) => {
    console.log("Item in Meal List:", item); // item 데이터 확인
  console.log("Item.food:", item.food); // item.food가 유효한지 확인

  return selectedTab === 'favorites' ? (
    
    // Favorites Tab: 개별 음식 렌더링
    <View style={styles.foodRow} key={item._id || `favorite-${index}`}>
      <View style={styles.foodInfo}>
        <Text style={styles.foodName}>{item.food_name|| item.food?.food_name|| '음식이름 오류'}</Text>
        <Text style={styles.foodCalories}> {item.calories ? `${item.calories} Kcal` : '0 Kcal'}</Text>
      </View>

      {isEditMode && (
        <View style={styles.editControls}>
          {/* 즐겨찾기 편집 */}
          <TouchableOpacity
            onPress={() => handleEditFood(item, null)}
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
    <View style={styles.mealContainer} key={item._id}>
      <Text style={styles.mealType}>
        {mealTypeMap[item.meal_type] || '총 칼로리'} ({item.total_calories?.toFixed(2) || 0} Kcal)
      </Text>

      <FlatList
        data={item.foods} // foods 배열 렌더링
        keyExtractor={(foodItem, index) => foodItem._id || `key-${index}`}
        renderItem={({ item: foodItem}) => {

          return (
            <View style={styles.foodRow} key={foodItem._id || `key-${index}`}>
              <View style={styles.foodInfo}>
                <Text style={styles.foodName}>{foodItem.food?.food_name || '클라 변수 확인'}</Text>
                <Text style={styles.foodCalories}>{foodItem.food?.calories
    ? (foodItem.food.calories * (foodItem.grams / 100)).toFixed(2) + ' Kcal'
    : '0 Kcal'}</Text>
              </View>

              {isEditMode && (
                <View style={styles.editControls}>
                  <TouchableOpacity
                    onPress={() => handleEditFood(foodItem, item._id)}
                    style={styles.editButton}
                  >
                    <Ionicons name="pencil" size={20} color="gray" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteMealItem(item._id, foodItem.food._id)} // mealId와 foodId 전달
                    style={styles.deleteButton}
                  >
                    <Ionicons name="close-circle" size={20} color="red" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        }}
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
  
  //편집버튼
  const handleEditFood = (food, mealId) => {
    console.log("편집할 식사:", food);
    // 현재 음식을 선택하여 모달로 전달
    // setSelectedFood({
    //   ...food,
    //   mealId, // Meal ID 전달
    //   grams: food.grams, // 기존 그램수
    //   isFavorite: favoritesList.some(fav => fav._id === food._id), // 즐겨찾기 여부
    // });
    setSelectedFood({
      food: food.food || food, // `food` 객체가 존재하면 사용, 아니면 기본값 사용
      grams: food.grams || 100, // 기본값 100g 설정
      mealId: mealId || food.mealId, // mealId는 즐겨찾기에서 동기화된 값을 사용
      isFavorite: favoritesList.some(fav => fav._id === (food.food?._id || food._id)), // 즐겨찾기 여부 확인
    });
  
    setIsEditMode(true);
    setModalVisible(true); // 모달 열기
  };
  
  
// 즐겨찾기 삭제 처리 함수 (로컬)
const handleDeleteFavorite = async (foodId) => {
  try {
    console.log('삭제할 음식 Id:', foodId);
    console.log('삭제 전 즐겨찾기 리스트', favoritesList);
    // 현재 즐겨찾기 목록에서 해당 항목 제거
    const updatedFavorites = favoritesList.filter((item) => item._id !== foodId);

    // 상태 업데이트
    setFavoritesList(updatedFavorites);

    // AsyncStorage에 업데이트된 목록 저장
    await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));

    console.log('Favorite deleted successfully. Updated favorites:', updatedFavorites);
  } catch (error) {
    console.error('Error deleting favorite:', error);
  }
};


  const getMealTitle = () => {
    const title = mealTypeMap[mealType] ? mealType : 'Unknown';
    return `${title} 식단`;
  };

  const getFilteredMealList = () => {
    console.log("Favorites List:", favoritesList);
    return selectedTab === 'favorites' ? favoritesList : mealList;
  };

  const handleFavoriteToggle = async (food, entryPoint) => {
    try {
      const savedFavorites = await AsyncStorage.getItem('favorites');
      const favorites = savedFavorites ? JSON.parse(savedFavorites) : [];
      const isAlreadyFavorite = favorites.some((item) => item._id === (food._id || food.food?._id));
  
      let updatedFavorites;
  
      if (isAlreadyFavorite) {
        // 즐겨찾기 해제: 해당 항목 삭제
        updatedFavorites = favorites.filter((item) => item._id !== (food._id || food.food?._id));
      } else {
        // 즐겨찾기 추가
        updatedFavorites = [
          ...favorites,
          {
            _id: food._id || food.food._id, // 음식 ID
            food_name: food.food_name || food.food.food_name, // 음식 이름
            calories:
              food.calories ||
              (food.food.calories * (food.grams / 100)).toFixed(2), // 칼로리 계산
            grams: food.grams || 100, // 기본 섭취량
            mealId: food.mealId || null, // mealId 저장
          },
        ];
      }
  
      // AsyncStorage 및 상태 업데이트
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      setFavoritesList(updatedFavorites);
  
      console.log('Favorites updated:', updatedFavorites);
  
      // 즐겨찾기 해제 시 모달 닫기
      if (isAlreadyFavorite && entryPoint === 'favorites') {
        onClose(); // 모달 닫기
      }
    } catch (error) {
      console.error('Error updating favorites in AsyncStorage:', error);
    }
  };
  
  
  // 편집 후 서버로 저장 
  // const handleSaveEdit = async (updatedFoodData) => {
  //   console.log("Sending data to the server:", updatedFoodData); // 로그 추가

  //   try {
  //     const token = await AsyncStorage.getItem('jwtToken');
  //     if (!token) {
  //       Alert.alert('Error', 'You must be logged in.');
  //       return;
  //     }
  
  //     const response = await fetch(`${CONFIG.API_BASE_URL}/meal/meal/${updatedFoodData.meal_id}`, {  // food_id로 수정
  //       method: 'PUT', // 수정이므로 PUT 메서드 사용
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify(updatedFoodData),  // food_id와 grams를 포함한 업데이트 데이터
  //     });
  
  //     if (response.ok) {
  //       console.log('Food updated successfully');
  //       await fetchMeals(); // 업데이트된 데이터를 반영하기 위해 mealList를 가져옴
  //       setModalVisible(false); // 모달 닫기
  //     } else {
  //       const errorText = await response.text();
  //       console.error('Failed to update food:', response.status, errorText);
  //       Alert.alert('Error', `Failed to update food: ${errorText}`);
  //     }
  //   } catch (error) {
  //     console.error('Error updating food:', error);
  //     Alert.alert('Error', 'An unexpected error occurred while updating food.');
  //   }
  // };
  const handleSaveEdit = async (updatedFoodData) => {
    console.log('updatedFoodData:', updatedFoodData);
  
    if (selectedTab === 'favorites') {
      // 즐겨찾기 로컬 데이터 수정
      const updatedFavorites = favoritesList.map((fav) =>
        fav._id === updatedFoodData.food_id
          ? {
              ...fav,
              grams: updatedFoodData.grams,
              calories: (fav.calories / fav.grams) * updatedFoodData.grams, // 칼로리 재계산
            }
          : fav
      );
  
      // 중복 제거
      const uniqueFavorites = updatedFavorites.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t._id === item._id) // _id 기준으로 중복 제거
      );
  
      console.log('Filtered uniqueFavorites before save:', uniqueFavorites);
  
      try {
        // AsyncStorage에 중복 제거된 데이터 저장
        await AsyncStorage.setItem('favorites', JSON.stringify(uniqueFavorites));
        console.log('Successfully saved uniqueFavorites to AsyncStorage');
  
        setFavoritesList(uniqueFavorites); // 상태 업데이트
        console.log('Updated favoritesList:', uniqueFavorites);
      } catch (error) {
        console.error('Error saving to AsyncStorage:', error);
      }
  
      setModalVisible(false);
    } else if (selectedTab === 'recent') {
      // 최근기록 서버 업데이트
      try {
        const token = await AsyncStorage.getItem('jwtToken');
        if (!token) {
          Alert.alert('Error', 'You must be logged in.');
          return;
        }
  
        const response = await fetch(
          `${CONFIG.API_BASE_URL}/meal/meal/${updatedFoodData.meal_id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              meal_id: updatedFoodData.meal_id,
              food_id: updatedFoodData.food_id,
              grams: updatedFoodData.grams,
            }),
          }
        );
  
        if (response.ok) {
          console.log('Food updated successfully');
          await fetchMeals(); // 서버 데이터 갱신
          setModalVisible(false);
        } else {
          const errorText = await response.text();
          console.error('Failed to update food:', response.status, errorText);
          Alert.alert('Error', `Failed to update food: ${errorText}`);
        }
      } catch (error) {
        console.error('Error updating food:', error);
        Alert.alert('Error', 'An unexpected error occurred while updating food.');
      }
    } else {
      console.error('Invalid selectedTab:', selectedTab);
    }
  };
  
  useEffect(() => {
    AsyncStorage.getItem('favorites').then((data) =>
      console.log('Stored AsyncStorage favorites after save:', JSON.parse(data))
    );
  }, [favoritesList]);
  useEffect(() => {
    console.log("favoritesList in MealSettingScreen:", favoritesList);
  }, [favoritesList]);
  
  
  
  
  const handleModalClose = () => {
    setModalVisible(false); // 모달 닫기
    setSearchText('');      // 검색 텍스트 초기화
    setFoodList([]);        // 검색 결과 초기화
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
              placeholder="음식 이름이나 브랜드명을 검색.."
              value={searchText}
              onChangeText={handleSearch}
            />
          </View>
          <TouchableOpacity onPress={handleClearSearch}>
            <Text style={styles.cancelText}>닫기</Text>
          </TouchableOpacity>
        </View>

        {foodList.length > 0 && (
          <View style={styles.searchResultsContainer}>
            <FlatList
              data={foodList}
              extraData={isEditMode}
              keyExtractor={(foodItem, index) => foodItem._id || `key-${index}`}
              renderItem={renderFoodItem}
            />
          </View>
        )}

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('MealDirectInput', {
              selectedDate,
              mealType,
            })
          }
          style={styles.directInputButton}
        >
          <Text style={styles.directInputText}>+ 직접 추가</Text>
        </TouchableOpacity>

        <View style={styles.tabContainer}>
          {renderTabButton('최근기록', 'recent')}
          {renderTabButton('즐겨찾기', 'favorites')}
        </View>

        <View style={styles.titleWrapper}>
          <Text style={styles.mealTitle}>{getMealTitle()}</Text>
          {renderEditButton()}
        </View>

        <View style={styles.whiteBox}>
          <FlatList
          data={getFilteredMealList()}
          extraData={favoritesList}
          keyExtractor={(item, index) => `${item._id || 'default'}-${index}`} // _id + index를 결합하여 고유한 key 생성
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
        entryPoint={selectedTab === 'favorites' ? 'favorites' : 'recent'}
        // onAddFood={handleAddFood}
        onAddFood={(foodData) => {
          console.log('onAddFood called in MealSettingScreen:', foodData); // 전달된 foodData 확인
          handleAddFood(foodData);
        }}
        onFavoriteToggle={handleFavoriteToggle}
        onSaveEdit={(updatedFoodData) => {
          console.log('Data received in MealSettingScreen:', updatedFoodData); // 데이터 확인
          handleSaveEdit(updatedFoodData); // 부모에서 호출
        }}
        isEditMode={isEditMode}
        favoritesList={favoritesList} // 즐겨찾기 데이터 전달
        setFavoritesList={setFavoritesList} // 상태 업데이트 함수 전달
      />

      <Footer />
    </View>
  );
};

export default MealSettingScreen;