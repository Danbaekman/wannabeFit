import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, StyleSheet, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';
import { PanResponder } from 'react-native';

const screenHeight = Dimensions.get('window').height;
const MODAL_HEIGHT = screenHeight * 0.85;  // 전체 화면의 85%만 차지

const FoodDetailModal = ({ visible, onClose, food, onAddFood }) => {  
  const translateY = useSharedValue(0);
  const [quantity, setQuantity] = useState(1);
  const [inputValue, setInputValue] = useState('g');

  useEffect(() => {
    if (visible) {
      // 모달이 열릴 때 애니메이션 초기화
      translateY.value = withSpring(0);
      setQuantity(1); // 모달이 열릴 때 수량 초기화
      setInputValue('g'); // 모달이 열릴 때 입력값 초기화
    }
  }, [visible]);

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
      if (gestureState.dy > MODAL_HEIGHT / 4) {
        translateY.value = withSpring(MODAL_HEIGHT, {}, () => {
          runOnJS(onClose)(); // 드래그가 충분하면 모달 창 닫기
        });
      } else {
        translateY.value = withSpring(0); // 드래그가 충분하지 않으면 원위치로 돌아가기
      }
    },
  });

  // food 객체가 없을 경우 모달 렌더링을 중단
  if (!food) {
    console.error('food 객체가 없습니다. 모달을 렌더링할 수 없습니다.');
    return null;
  }

  const handleAddFood = () => {
    if (onAddFood && food) {
      const totalQuantity = quantity > 1 ? quantity : parseFloat(inputValue.replace('g', '')) / 100;
      onAddFood(food, totalQuantity, inputValue); // 부모 컴포넌트로 음식 정보 전달
    }
  };
  const enteredQuantity = parseFloat(inputValue.replace('g', '')) || 0;
  const calculatedQuantity = enteredQuantity / 100; // 입력된 g을 기준으로 비율 계산

  // 매크로 성분의 총합을 계산하여 비율로 환산
  const totalMacros = food.carbohydrates + food.protein + food.fat;
  const carbPercentage = ((food.carbohydrates / totalMacros) * 100).toFixed(2);
  const proteinPercentage = ((food.protein / totalMacros) * 100).toFixed(2);
  const fatPercentage = ((food.fat / totalMacros) * 100).toFixed(2);

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <Animated.View
          style={[styles.modalContent, animatedStyle]}
          {...panResponder.panHandlers} // PanResponder is attached here for drag functionality
        >
          {/* 상단에 '-' 모양 추가 */}
          <View style={styles.dragHandleContainer}>
            <View style={styles.dragHandle} />
          </View>

          <Text style={styles.modalTitle}>{food.food_name}</Text>

          {/* 기본량 및 직접 입력 */}
          <View style={styles.inputContainer}>
            <View style={styles.inputBox}>
              <Text style={styles.boxTitle}>기본량 (100g 당)</Text>
              <View style={styles.counter}>
                <TouchableOpacity onPress={() => setQuantity(prev => Math.max(prev - 0.5, 0.5))}>
                  <Text style={styles.counterButton}>-</Text>
                </TouchableOpacity>
                <Text style={styles.counterValue}>{quantity}</Text>
                <TouchableOpacity onPress={() => setQuantity(prev => prev + 0.5)}>
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
                  const numericText = text.replace(/[^0-9]/g, '');
                  setInputValue(`${numericText}g`);
                }}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* 매크로 분포도 */}
          <View style={styles.macroDistribution}>
            <View style={styles.macroItem}>
              <View style={[styles.macroBox, { backgroundColor: 'green' }]} />
              <Text style={styles.macroLabel}>탄수화물 {carbPercentage}%</Text>
            </View>
            <View style={styles.macroItem}>
              <View style={[styles.macroBox, { backgroundColor: 'blue' }]} />
              <Text style={styles.macroLabel}>단백질 {proteinPercentage}%</Text>
            </View>
            <View style={styles.macroItem}>
              <View style={[styles.macroBox, { backgroundColor: 'yellow' }]} />
              <Text style={styles.macroLabel}>지방 {fatPercentage}%</Text>
            </View>
          </View>

          {/* 매크로 퍼센트 바 */}
          <View style={styles.progressBar}>
            <View style={[styles.progressSegment, { backgroundColor: 'green', width: `${carbPercentage}%` }]} />
            <View style={[styles.progressSegment, { backgroundColor: 'blue', width: `${proteinPercentage}%` }]} />
            <View style={[styles.progressSegment, { backgroundColor: 'yellow', width: `${fatPercentage}%` }]} />
          </View>

          {/* 영양 정보 */}
          <View style={styles.foodDetails}>
            <Text style={styles.caloriesText}>총 칼로리: {(food.calories * quantity).toFixed(2)} Kcal</Text>
            <View style={styles.nutrientContainer}>
              <View style={styles.nutrientRowContainer}>
                <View style={styles.nutrientColumn}>
                  <Text style={styles.nutrientLabel}>탄수화물</Text>
                  <Text style={styles.nutrientValue}>{(food.carbohydrates * quantity).toFixed(2)}g</Text>
                </View>
                <View style={styles.nutrientColumn}>
                  <Text style={styles.nutrientLabel}>단백질</Text>
                  <Text style={styles.nutrientValue}>{(food.protein * quantity).toFixed(2)}g</Text>
                </View>
                <View style={styles.nutrientColumn}>
                  <Text style={styles.nutrientLabel}>지방</Text>
                  <Text style={styles.nutrientValue}>{(food.fat * quantity).toFixed(2)}g</Text>
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.nutrientRowContainer}>
                <View style={styles.nutrientColumn}>
                  <Text style={styles.nutrientLabel}>당</Text>
                  <Text style={styles.nutrientValue}>{(food.sugar * quantity).toFixed(2)}g</Text>
                </View>
                <View style={styles.nutrientColumn}>
                  <Text style={styles.nutrientLabel}>나트륨</Text>
                  <Text style={styles.nutrientValue}>{(food.natrium * quantity).toFixed(2)}mg</Text>
                </View>
              </View>
            </View>
          </View>

          {/* 식단에 추가 버튼 */}
          <TouchableOpacity style={styles.addButton} onPress={handleAddFood}>
            <Text style={styles.addButtonText}>식단에 추가</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

// 기존 디자인 유지
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    width: '100%',
    height: MODAL_HEIGHT,  // 모달 높이를 전체 화면의 85%로 설정
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 20,
  },
  inputBox: {
    width: '45%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#00796B',
    backgroundColor: '#00796B',
  },
  boxTitle: {
    textAlign: 'center',
    color: 'white',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  counter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    backgroundColor: 'white',
  },
  counterButton: {
    fontSize: 20,
    color: 'gray',
  },
  counterValue: {
    fontSize: 18,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 5,
    textAlign: 'center',
    backgroundColor: 'white',
    fontSize: 18,
    height: 40,
  },
  dragHandleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  dragHandle: {
    width: 60,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ccc',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  macroDistribution: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  macroItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  macroBox: {
    width: 16,
    height: 16,
    marginRight: 6,
  },
  macroLabel: {
    fontSize: 14,
    color: '#333',
  },
  progressBar: {
    flexDirection: 'row',
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: '#ddd',
    width: '100%',
    marginBottom: 20,
  },
  progressSegment: {
    height: '100%',
  },
  foodDetails: {
    marginBottom: 20,
  },
  caloriesText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'right',
    marginBottom: 10,
  },
  nutrientContainer: {
    borderWidth: 2,
    borderColor: '#008080',
    padding: 20,
    borderRadius: 10,
  },
  nutrientRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  nutrientColumn: {
    alignItems: 'center',
    flex: 1,
  },
  nutrientLabel: {
    fontSize: 16,
    color: '#333',
  },
  nutrientValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#008080',
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginTop: 20,
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default FoodDetailModal;
