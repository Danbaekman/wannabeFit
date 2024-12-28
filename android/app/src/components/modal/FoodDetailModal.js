import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './FoodDetailModalStyles';
import { PanResponder } from 'react-native';
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
  const translateY = useSharedValue(0);
  const [quantity, setQuantity] = useState(1);
  const [inputValue, setInputValue] = useState('100g');
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [calculatedNutrients, setCalculatedNutrients] = useState({});
  const [nutrientRatios, setNutrientRatios] = useState({ carbs: 0, protein: 0, fat: 0 });

  useEffect(() => {
    console.log("FoodDetailModal props:", {
      favoritesList,
      setFavoritesList,
      entryPoint,
    });
  }, []);
  

  // useEffect(() => {
  //   if (visible && food) {
  //     console.log("Modal Opened with Food:", food); // 디버깅용 로그
  //     if (isEditMode) {
  //       // 편집 모드일 때는 food.grams 값을 기반으로 설정
  //       setQuantity(food.grams / 100);  // grams 값을 100으로 나누어 quantity 설정
  //       setInputValue(`${food.grams}g`); // 섭취량 입력 값 설정
  //       calculateNutrients(food.grams); // 설정했던 grams기반 계산된것
  //     } else {
  //       setQuantity(1);  // 기본 섭취량 100g
  //       setInputValue('100g');
  //     }
  //     calculateNutrients(1);  // 기본 섭취량으로 계산
  //     setIsFavorite(entryPoint === 'favorites' ? true : initialFavorite);
  //   }
  // }, [visible, food, initialFavorite, entryPoint]);
  useEffect(() => {
    if (visible && food) {
      console.log("Modal Opened with Food:", food);
  
      if (isEditMode) {
        // 편집 모드일 때
        const foodData = entryPoint === 'favorites' ? food : food.food; // entryPoint에 따라 food 구조 선택
        console.log('food:',food);
        console.log('food.food:', food.food);
        const grams = food.grams || 100; // grams 기본값 100
        const calories = foodData.calories || 0;
  
        setQuantity(grams / 100); // grams를 100으로 나눈 기본량
        setInputValue(`${grams}g`); // 섭취량 표시
        calculateNutrients(grams); // grams 기반 영양소 계산
  
        setCalculatedNutrients({
          calories: calories * (grams / 100),
          carbohydrates: foodData.carbohydrates || 0,
          protein: foodData.protein || 0,
          fat: foodData.fat || 0,
          sugar: foodData.sugar || 0,
          sodium: foodData.natrium || 0,
        });
      } else {
        // 새로 추가할 때 기본값 처리
        setQuantity(1); // 기본량 100g
        setInputValue('100g');
        calculateNutrients(100); // 기본값 100g으로 계산
      }
  
      setIsFavorite(entryPoint === 'favorites' ? true : initialFavorite); // 즐겨찾기 여부 설정
    }
  }, [visible, food, initialFavorite, entryPoint, isEditMode]);
  
  
  // FoodDetailModal.js
  const handleFavoriteToggle = () => {
    const updatedFavorite = !isFavorite;
    setIsFavorite(updatedFavorite); // 로컬 UI 업데이트
  
    // MealSettingScreen으로 상태 변경 요청 전달
    if (onFavoriteToggle) {
      onFavoriteToggle(food);
    }
  };
  

  const handleAddFood = () => {
    const totalQuantity = quantity * 100;
  
    if (isEditMode) {
      const updatedFoodData = {
        ...food,
        grams: totalQuantity,
        isFavorite,
      };
  
      if (entryPoint === 'recent') {
        // 최근기록 탭: 서버와 동기화
        const serverData = {
          meal_id: food.mealId,
          food_id: food.food._id,
          grams: totalQuantity,
        };
        if (onSaveEdit) {
          onSaveEdit(serverData);
        }
      } else if (entryPoint === 'favorites') {
        // 즐겨찾기 탭: 로컬 데이터만 변경
        if (onFavoriteToggle) {
          onFavoriteToggle(updatedFoodData);
        }
      }
    } else {
      // 새로운 음식 추가
      const formattedFoodData = {
        food: food._id,
        grams: totalQuantity,
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
  //   console.log('entryPoint:', entryPoint); // entryPoint 확인

  //   if (entryPoint === 'recent') {
  //     // 최근기록 탭: 서버 동기화
  //     const updatedFoodData = {
  //       meal_id: food.mealId,
  //       food_id: food.food._id,
  //       grams: totalQuantity,
  //     };
  //     console.log('Updated Food Data:', updatedFoodData);
  //     if (onSaveEdit) {
  //       onSaveEdit(updatedFoodData);
  //     }
  //   } else if (entryPoint === 'favorites') {
  //     // 즐겨찾기 탭: 로컬 데이터만 업데이트
  //     const updatedFoodData = {
  //       ...food,
  //       grams: totalQuantity,
  //     };
  //     if (onFavoriteToggle) {
  //       onFavoriteToggle(updatedFoodData);
  //     }
  //   }
  //   onClose(); // 모달 닫기
  // };
  const handleSaveEdit = () => {
    const totalQuantity = quantity * 100;
    console.log("Entry Point:", entryPoint);
    console.log("Food before update:", food);
  
    let updatedFoodData;
  
    if (entryPoint === "favorites") {
      // 즐겨찾기 데이터 업데이트
      const baseFood = food.food || food; // food 내부에 food가 있을 경우 처리
      updatedFoodData = {
        ...food,
        grams: totalQuantity,
        calories: (baseFood.calories / baseFood.grams) * totalQuantity, // baseFood에서 칼로리 계산
      };
  
      console.log("Updated Food Data for favorites:", updatedFoodData);
  
      // favoritesList 업데이트
      const updatedFavorites = favoritesList.map((fav) =>
        fav._id === (baseFood._id || food._id) ? updatedFoodData : fav
      );
  
      setFavoritesList(updatedFavorites); // 상태 업데이트
      AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites)); // 저장
    } else if (entryPoint === "recent") {
      // 최근 기록 데이터 업데이트
      updatedFoodData = {
        meal_id: food.mealId,
        food_id: food.food?._id || food._id,
        grams: totalQuantity,
      };
  
      console.log("Updated Food Data for recent:", updatedFoodData);
  
      if (onSaveEdit) {
        onSaveEdit(updatedFoodData);
      }
    }
  
    console.log("Final Updated Food Data:", updatedFoodData);
    onClose(); // 모달 닫기
  };
  
  
  

  // const calculateNutrients = (grams) => {
  //   const scaleFactor = grams / 100; // 기준량 100g 대비 비율
  
  //   const newNutrients = {
  //     calories: (isEditMode ? food.food?.calories : food.calories) * scaleFactor,
  //     carbohydrates: (isEditMode ? food.food?.carbohydrates : food.carbohydrates) * scaleFactor,
  //     protein: (isEditMode ? food.food?.protein : food.protein) * scaleFactor,
  //     fat: (isEditMode ? food.food?.fat : food.fat) * scaleFactor,
  //     sugar: (isEditMode ? food.food?.sugar : food.sugar) * scaleFactor,
  //     sodium: (isEditMode ? food.food?.natrium : food.natrium) * scaleFactor,
  //   };
  //   setCalculatedNutrients(newNutrients); // 영양소 상태 업데이트
  
  //   const total = newNutrients.carbohydrates + newNutrients.protein + newNutrients.fat;
  //   setNutrientRatios(
  //     total > 0
  //       ? {
  //           carbs: newNutrients.carbohydrates / total,
  //           protein: newNutrients.protein / total,
  //           fat: newNutrients.fat / total,
  //         }
  //       : { carbs: 0, protein: 0, fat: 0 }
  //   );
  // };
  const calculateNutrients = (grams) => {
    const scaleFactor = grams / 100;
  
    const newNutrients = {
      calories: (entryPoint === 'favorites' ? food.calories : food.food?.calories) * scaleFactor,
      carbohydrates: (entryPoint === 'favorites' ? food.carbohydrates : food.food?.carbohydrates) * scaleFactor,
      protein: (entryPoint === 'favorites' ? food.protein : food.food?.protein) * scaleFactor,
      fat: (entryPoint === 'favorites' ? food.fat : food.food?.fat) * scaleFactor,
      sugar: (entryPoint === 'favorites' ? food.sugar : food.food?.sugar) * scaleFactor,
      sodium: (entryPoint === 'favorites' ? food.natrium : food.food?.natrium) * scaleFactor,
    };
  
    setCalculatedNutrients(newNutrients);
  
    const total = newNutrients.carbohydrates + newNutrients.protein + newNutrients.fat;
    setNutrientRatios(
      total > 0
        ? {
            carbs: newNutrients.carbohydrates / total,
            protein: newNutrients.protein / total,
            fat: newNutrients.fat / total,
          }
        : { carbs: 0, protein: 0, fat: 0 }
    );
  };
  
  

  const handleQuantityChange = (newQuantity) => {
    // `quantity` 값이 1 미만으로 떨어지지 않도록 방어 코드 작성
    if (newQuantity < 1) return;
  
    // `quantity` 값을 업데이트하고 영양소 계산 호출
    setQuantity(newQuantity);
    calculateNutrients(newQuantity * 100); // 100g 단위로 영양소 계산
  };
  


  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dy > 0) {
        translateY.value = gestureState.dy;
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy > 200) {
        translateY.value = withSpring(500, {}, () => {
          runOnJS(onClose)();
        });
      } else {
        translateY.value = withSpring(0);
      }
    },
  });

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <Animated.View style={[styles.modalContent, animatedStyle]} {...panResponder.panHandlers}>
          <View style={styles.dragHandleContainer}>
            <View style={styles.dragHandle} />
          </View>

          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={handleFavoriteToggle}
          >
            <Ionicons
              name={isFavorite ? 'star' : 'star-outline'}
              size={32}
              color={isFavorite ? 'gold' : 'gray'}
            />
          </TouchableOpacity>

          <Text style={styles.modalTitle}>{food?.food_name || food?.food?.food_name || '음식 정보'}</Text>

      
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
            <Text style={styles.caloriesText}>총 칼로리</Text>
            <Text style={styles.totalCaloriesValue}>
              {calculatedNutrients.calories ? calculatedNutrients.calories.toFixed(2) : 0} Kcal
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
              {isEditMode ? '식단 변경' : '식단에 추가'} {/* 버튼 텍스트 변경 */}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default FoodDetailModal;