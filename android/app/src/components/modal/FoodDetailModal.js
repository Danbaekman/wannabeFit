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
    const totalQuantity = parseFloat(inputValue.replace('g', '')) || quantity * 100;

    if (onAddFood && food) {
      onAddFood({ food, quantity: totalQuantity, isFavorite });
    }
    onClose();
  };

  const calculateNutrients = (quantity) => {
    const scale = quantity; // 기본량 1 = 100g
    const newNutrients = {
      calories: (food.calories || 0) * scale,
      carbohydrates: (food.carbohydrates || 0) * scale,
      protein: (food.protein || 0) * scale,
      fat: (food.fat || 0) * scale,
      sugar: (food.sugar || 0) * scale,
      sodium: (food.sodium || 0) * scale,
    };
    setCalculatedNutrients(newNutrients);
  
    const total = newNutrients.carbohydrates + newNutrients.protein + newNutrients.fat;
    if (total > 0) {
      setNutrientRatios({
        carbs: newNutrients.carbohydrates / total,
        protein: newNutrients.protein / total,
        fat: newNutrients.fat / total,
      });
    } else {
      setNutrientRatios({ carbs: 0, protein: 0, fat: 0 });
    }
  };
  

  const handleQuantityChange = (newQuantity) => {
    if (!Number.isInteger(newQuantity) || newQuantity < 1) return; // 소수점, 음수 방지
    setQuantity(newQuantity);
    calculateNutrients(newQuantity);
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
                onChangeText={setInputValue}
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
