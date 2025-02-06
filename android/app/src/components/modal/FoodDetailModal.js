import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, Dimensions, Animated, PanResponder } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './FoodDetailModalStyles';
import NutrientPieChart from '../nutrientpiechart/NutrientPieChart';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FoodDetailModal = ({
  visible,
  onClose,
  food = {},
  onAddFood,
  initialFavorite = false,
  entryPoint,
  onFavoriteToggle, 
  onSaveEdit,
  isEditMode,
  favoritesList = [],
  setFavoritesList,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [inputValue, setInputValue] = useState('100g');
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [calculatedNutrients, setCalculatedNutrients] = useState({});
  const [nutrientRatios, setNutrientRatios] = useState({ carbs: 0, protein: 0, fat: 0 });
  const [selectedFoodData, setSelectedFoodData] = useState(null); // foodData 상태로 관리
  const screenHeight = Dimensions.get('screen').height; // 화면 높이
  const panY = useRef(new Animated.Value(screenHeight)).current; // 모달의 Y축 위치
  const translateY = panY.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0, 0, 1],
  });

  const resetBottomSheet = Animated.timing(panY, {
    toValue: 0, 
    duration: 300,
    useNativeDriver: true,
  });

  const closeBottomSheet = Animated.timing(panY, {
    toValue: screenHeight, // 화면 아래로 이동하여 숨김
    duration: 300,
    useNativeDriver: true,
  });
  useEffect(() => {
    setIsFavorite(initialFavorite); // 초기 상태 설정
  }, [initialFavorite]);
  
  useEffect(() => {
    if (selectedFoodData) {
      setQuantity(selectedFoodData.grams / 100); // grams 값에 따라 quantity 동기화
    }
  }, [selectedFoodData]);

  useEffect(() => {
    console.log('food배열:',food);
    if (entryPoint === 'favorites' && !selectedFoodData) {
      if (food?.food) {
        setSelectedFoodData(food.food);
      } else if (food) {
        setSelectedFoodData(food);
      } 
    }
  }, [entryPoint, food, selectedFoodData]);
  
  
  useEffect(() => {
    if (visible && food) {
      console.log("Modal Opened with Food:", food);
      
  const foodData = food.food || food; // food 내부에 food가 있는 경우 우선 참조
      // 방어적 코딩: food와 foodData 확인
      const grams = food?.grams || 100; // 기본 grams 설정
      const calories = foodData?.calories || 0; // calories 값 설정
  
      // setSelectedFoodData(foodData);
      setSelectedFoodData({
        ...food,
        grams,
      });
      setQuantity(grams / 100); // 기본 섭취량 설정
      setInputValue(`${grams}g`); // 입력값 표시
  
      // 중복 계산 방지
      setCalculatedNutrients({
        calories:
          entryPoint === 'favorites' && isEditMode
            ? food?.food.calories // favorites + editMode: 이미 저장된 값 사용
            : calories * (grams / 100),
        carbohydrates: foodData?.carbohydrates * (grams / 100) || 0,
        protein: foodData?.protein * (grams / 100) || 0,
        fat: foodData?.fat * (grams / 100) || 0,
        sugar: foodData?.sugar * (grams / 100) || 0,
        sodium: foodData?.natrium * (grams / 100) || 0,
      });
  
      // 즐겨찾기 여부 설정
      setIsFavorite(entryPoint === 'favorites' ? true : initialFavorite);
    }
  }, [visible, food, initialFavorite, entryPoint, isEditMode]);

  
  
  

  const handleAddFood = () => {
    const totalQuantity = quantity * 100;
  
    if (isEditMode) {
      const updatedFoodData = {
        ...food,
        grams: totalQuantity,
        isFavorite,
        isCustom: food.isCustom || false,
      };
  
      if (entryPoint === 'recent') {
        // 최근기록 탭: 서버와 동기화
        const serverData = {
          meal_id: food.mealId,
          food_id: food.food._id,
          grams: totalQuantity,
          isCustom: food.isCustom || false,
        };
        if (onSaveEdit) {
          onSaveEdit(serverData);
        }
      } else if (entryPoint === 'favorites') {
        // 즐겨찾기 탭: 로컬 데이터만 변경
        if (onFavoriteToggle) {
          onFavoriteToggle(updatedFoodData);
        }
        console.log('즐겨찾기 편집시 updatedFoodData:', updatedFoodData);
      }
    } else {
      // 새로운 음식 추가
      const formattedFoodData = {
        food: food._id,
        grams: totalQuantity,
        isCustom: food.isCustom || false,
      };
      if (onAddFood) {
        onAddFood({
          food: formattedFoodData,
          quantity: totalQuantity,
          isFavorite,
        });
      }
    }
    onClose(); // 모달 닫기
  };
  

  // const handleSaveEdit = () => {
  //   const totalQuantity = quantity * 100;
  //   console.log('handleSaveEdit - Quantity:', quantity);
  //   console.log('handleSaveEdit - Total Quantity (Grams):', totalQuantity);
  
  //   let updatedFoodData;
  
  //   if (entryPoint === "favorites") {
  //     // 즐겨찾기 데이터 업데이트
  //     const baseFood = food.food || food; // food 내부에 food가 있을 경우 처리
  //     updatedFoodData = {
  //       ...food,
  //       grams: totalQuantity,
  //       calories: (baseFood.calories / baseFood.grams) * totalQuantity, // baseFood에서 칼로리 계산
  //     };
  
  //     console.log('즐겨찾기 탭에서의 업데이트된 음식:', updatedFoodData);  
  //     // favoritesList 업데이트
  //     const updatedFavorites = favoritesList.map((fav) =>
  //       fav._id === (baseFood._id || food._id) ? updatedFoodData : fav
  //     );
  
  //     setFavoritesList(updatedFavorites); // 상태 업데이트
  //     AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites)); // 저장
  //   } else if (entryPoint === "recent") {
    
  //     updatedFoodData = {
  //       ...food, // 기존 food 객체 복제
  //       meal_id: food.mealId,
  //       food_id: food.food?._id || food._id,
  //       grams: totalQuantity,
  //     };
  
  //     console.log("최근기록에서의 업데이트된 음식:", updatedFoodData);
  
  //     if (onSaveEdit) {
  //       onSaveEdit(updatedFoodData);
  //     }
  //   }
  
  //   console.log("Final Updated Food Data:", updatedFoodData);
  //   onClose(); // 모달 닫기
  // };
  const handleSaveEdit = () => {
    const totalQuantity = quantity * 100;
    console.log('handleSaveEdit - Total Quantity:', totalQuantity);
  
    const updatedFoodData = {
      food: food.food || food, // food 객체 유지
      grams: totalQuantity,
      meal_id: food.mealId || null, // mealId 추가
      food_id: food.food?._id || food._id, // 음식 ID 추가
    };
  
    console.log("Updated Food Data from Modal:", updatedFoodData);
    onSaveEdit(updatedFoodData); // 부모 컴포넌트(MealSettingScreen)로 전달
    onClose(); // 모달 닫기
  };
  
  


  const calculateNutrients = (grams) => {
    if (!grams || grams <= 0) {
      console.error("Invalid grams value:", grams);
      return;
    }
  
    const scaleFactor = grams / 100;
    const foodData = selectedFoodData?.food || selectedFoodData;
  
    if (!foodData || !foodData.calories) {
      console.error("Invalid food data for nutrient calculation:", foodData);
      return;
    }
  
    const newNutrients = {
      calories: foodData.grams
        ? foodData.calories * (grams / foodData.grams) // grams 기반 계산
        : (foodData.calories || 0) * scaleFactor, // 기본 계산
      carbohydrates: (foodData.carbohydrates || 0) * scaleFactor,
      protein: (foodData.protein || 0) * scaleFactor,
      fat: (foodData.fat || 0) * scaleFactor,
      sugar: (foodData.sugar || 0) * scaleFactor,
      sodium: (foodData.natrium || 0) * scaleFactor,
    };
  
    console.log("calculateNutrients - New Nutrients:", newNutrients);
    setCalculatedNutrients(newNutrients);
  };
  

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return; // 방어 코드

    const updatedGrams = newQuantity * 100;
    console.log('진입 지점:', entryPoint);
    console.log('편집모드인지:', isEditMode);
    if (entryPoint === 'favorites' && isEditMode) {
      console.log('setSelectedFoodData:', selectedFoodData);
        setSelectedFoodData((prevData) => {
            const updatedData = {
                ...prevData,
                grams: updatedGrams,
            };
            console.log('handleQuantityChange - Updated Selected Food Data:', updatedData);

            calculateNutrients(updatedGrams); // 업데이트 후 재계산
            return updatedData;
        });
        return;
    }

    setQuantity(newQuantity);
    if (selectedFoodData) {
        calculateNutrients(updatedGrams); // grams와 동기화
    }
};
  
  // const handleFavoriteToggle = (food) => {
  //   console.log('즐겨찾기에 추가할 음식 정보 확인:', food);
  //   const isCurrentlyFavorite = favoritesList.some((fav) => fav._id === food._id);
  //   const updatedFood = {
  //     ...food,
  //     isFavorite: !isCurrentlyFavorite, // `isFavorite` 값 반전
  //   };
  
  //   // `favoritesList` 업데이트
  //   const updatedFavorites = isCurrentlyFavorite
  //     ? favoritesList.filter((fav) => fav._id !== food._id) // 이미 즐겨찾기인 경우 제거
  //     : [...favoritesList, updatedFood]; // 새로운 객체 추가

  //   setFavoritesList(updatedFavorites);
  //   AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites)); // AsyncStorage에 저장
  //   console.log('즐겨찾기에 업데이트 됬나 확인:', updatedFavorites);

  // };
  const handleFavoriteToggle = () => {
    console.log('🔹 [handleFavoriteToggle] 밀세팅스크린으로 이동');
    if (onFavoriteToggle) {
      onFavoriteToggle(food); // ✅ 부모(`MealSettingScreen`)에 이벤트 전달
    }
  };
  

  const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => false,
        onPanResponderMove: (event, gestureState) => {
          panY.setValue(gestureState.dy); // 드래그 Y축 업데이트
        },
        onPanResponderRelease: (event, gestureState) => {
          if (gestureState.dy > 0 && gestureState.vy > 1.5) {
            closeModal(); // 아래로 빠르게 드래그하면 모달 닫기
          } else {
            resetBottomSheet.start(); // 원래 위치로 복귀
          }
        },
      })
    ).current;

  useEffect(() => {
    if (visible) {
      resetBottomSheet.start(); // 모달 열릴 때 애니메이션 실행
    }
  }, [visible]);

  const closeModal = () => {
    closeBottomSheet.start(() => {
      onClose(); // 닫기 콜백 실행
    });
  };


  return (
    <Modal
          visible={visible}
          transparent={true}
          animationType="fade"
          onRequestClose={onClose}
        >
      <View style={styles.modalContainer}>
      <Animated.View
          style={[styles.modalContent, { transform: [{ translateY }] }]}
          {...panResponder.panHandlers} // PanResponder 연결
        >
          <View style={styles.dragHandleContainer}>
            <View style={styles.dragHandle} />
          </View>


          <View style={styles.titleRow}>
            <Text style={styles.modalTitle} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
              {food?.food_name || food?.food?.food_name || '음식 정보'}
            </Text>
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => {
                handleFavoriteToggle(food, entryPoint);
                if (isFavorite && entryPoint === 'favorites') {
                  onClose();
                }
              }}
            >
              <Ionicons
                name={isFavorite ? 'star' : 'star-outline'}
                size={24} // 아이콘 크기를 텍스트 크기에 맞추기
                color={isFavorite ? 'gold' : 'gray'}
              />
            </TouchableOpacity>
          </View>


          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <View style={styles.closeCircle}>
              <Ionicons name="close" size={24} color="black" />
            </View>
          </TouchableOpacity>


      
          <NutrientPieChart nutrients={calculatedNutrients} />

          <View style={styles.inputContainer}>
            <View style={styles.inputBox}>
              <Text style={styles.boxTitle}>기본량 (100g)</Text>
              <View style={styles.counter}>
                <TouchableOpacity onPress={() => handleQuantityChange(quantity - 1)}>
                  <Text style={styles.counterButton}>-</Text>
                </TouchableOpacity>
                <Text style={styles.counterValue}>{quantity}</Text>
                <TouchableOpacity onPress={() => handleQuantityChange(quantity + 1)}>
                  <Text style={styles.counterButton}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.inputBox}>
              <Text style={styles.boxTitle}>직접 입력</Text>
              <TextInput
                style={styles.input}
                value={inputValue}
                onChangeText={(text) => {
                  setInputValue(text);
                  const numericValue = parseFloat(text.replace('g', '')) || 0;
                  if (numericValue > 0) {
                    calculateNutrients(numericValue); // 입력 값으로 영양소 재계산
                  }
                }}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.totalCaloriesContainer}>
            <Text style={styles.caloriesText}>
              총 칼로리: <Text style={styles.caloriesSubText}>{calculatedNutrients.calories ? calculatedNutrients.calories.toFixed(2) : 0}Kcal</Text>
            </Text>
          </View>


          <View style={styles.nutrientContainer}>
            <View style={styles.nutrientRowContainer}>
              <View style={styles.nutrientColumn}>
                <Text style={styles.nutrientLabel}>탄수화물</Text>
                <Text style={styles.nutrientValue}>
                {calculatedNutrients.carbohydrates ? calculatedNutrients.carbohydrates.toFixed(2) : 0}g
              </Text>
              </View>
              <View style={styles.nutrientColumn}>
                <Text style={styles.nutrientLabel}>단백질</Text>
                <Text style={styles.nutrientValue}>
                  {calculatedNutrients.protein ? calculatedNutrients.protein.toFixed(2) : 0}g
                </Text>
              </View>
              <View style={styles.nutrientColumn}>
                <Text style={styles.nutrientLabel}>지방</Text>
                  <Text style={styles.nutrientValue}>
                    {calculatedNutrients.fat ? calculatedNutrients.fat.toFixed(2) : 0}g
                  </Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.nutrientRowContainer}>
              <View style={styles.nutrientColumn}>
                <Text style={styles.nutrientLabel}>당</Text>
                  <Text style={styles.nutrientValue}>
                    {calculatedNutrients.sugar ? calculatedNutrients.sugar.toFixed(2) : 0}g
                  </Text>
              </View>
              <View style={styles.nutrientColumn}>
                <Text style={styles.nutrientLabel}>나트륨</Text>
                <Text style={styles.nutrientValue}>
                  {calculatedNutrients.sodium ? calculatedNutrients.sodium.toFixed(2) : 0}mg
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              console.log('isEditMode:', isEditMode); // isEditMode 상태 확인
              if (isEditMode) {
                handleSaveEdit();
              } else {
                handleAddFood();
              }
            }}
          >
            <Text style={styles.addButtonText}>
              {isEditMode ? '식단 변경' : '식단 추가'} {/* 버튼 텍스트 변경 */}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default FoodDetailModal;