import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './FoodDetailModalStyles';
import { PanResponder } from 'react-native';
import NutrientPieChart from '../nutrientpiechart/NutrientPieChart';

const FoodDetailModal = ({
  visible,
  onClose,
  food = {},
  onAddFood,
  initialFavorite = false,
  onFavoriteChange,
  entryPoint,
}) => {
  const translateY = useSharedValue(0);
  const [quantity, setQuantity] = useState(1);
  const [inputValue, setInputValue] = useState('100g');
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [calculatedNutrients, setCalculatedNutrients] = useState({});
  const [nutrientRatios, setNutrientRatios] = useState({ carbs: 0, protein: 0, fat: 0 });


  useEffect(() => {
    if (visible) {
      setQuantity(1);
      setInputValue('100g');
      setIsFavorite(entryPoint === 'favorites' ? true : initialFavorite);
      calculateNutrients(1);
    }
  }, [visible, initialFavorite, entryPoint]);

  const handleFavoriteToggle = () => {
    const updatedFavorite = !isFavorite;
    setIsFavorite(updatedFavorite);

    if (entryPoint === 'favorites') {
      if (onFavoriteChange) {
        onFavoriteChange({ ...food, isFavorite: updatedFavorite });
      }
      if (!updatedFavorite) {
        onClose();
      }
    } else {
      console.log('검색 모드에서 즐겨찾기 상태 변경:', updatedFavorite);
    }
  };

  const handleAddFood = () => {
    // 사용자가 입력한 섭취량 (grams)
    const totalQuantity = quantity * 100;
  
    // 서버로 전송할 데이터
    const formattedFoodData = {
      food: food._id, // 음식 ID
      grams: totalQuantity, // 섭취량
    };
  
    console.log('Food Object:', food); // 원본 food 객체 확인
    console.log('Formatted Food Data:', formattedFoodData); // 서버로 전송할 데이터 확인
  
    // `onAddFood` 호출
    if (onAddFood && food) {
      onAddFood({
        food: formattedFoodData, // 서버로 전송할 데이터 전달
        quantity: totalQuantity,
        isFavorite,
      });
    }
    onClose(); // 모달 닫기
  };
  
  

  const calculateNutrients = (grams) => {
    const scaleFactor = grams / 100; // 기준량 100g 대비 비율
  
    const newNutrients = {
      calories: (food.calories || 0) * scaleFactor,
      carbohydrates: (food.carbohydrates || 0) * scaleFactor,
      protein: (food.protein || 0) * scaleFactor,
      fat: (food.fat || 0) * scaleFactor,
      sugar: (food.sugar || 0) * scaleFactor,
      sodium: (food.natrium || 0) * scaleFactor,
    };
  
    console.log('Calculated Nutrients:', newNutrients); // 디버깅용 로그
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

          <Text style={styles.modalTitle}>{food?.food_name || '음식 정보'}</Text>

      
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

          <TouchableOpacity style={styles.addButton} onPress={handleAddFood}>
            <Text style={styles.addButtonText}>식단에 추가</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default FoodDetailModal;
