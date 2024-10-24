import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, StyleSheet, Dimensions } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const screenHeight = Dimensions.get('window').height;
const MODAL_HEIGHT = screenHeight * 0.85;  // 전체 화면의 85%만 차지

const FoodDetailModal = ({ visible, onClose, food }) => {
  const translateY = useSharedValue(0);
  const [quantity, setQuantity] = useState(1);
  const [inputValue, setInputValue] = useState('g');

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const handleGesture = (event) => {
    const { translationY } = event.nativeEvent;
    if (translationY > 0) {
      translateY.value = translationY;
    }
  };

  const handleGestureEnd = (event) => {
    const { translationY } = event.nativeEvent;
    if (translationY > MODAL_HEIGHT / 4) {
      translateY.value = withSpring(MODAL_HEIGHT, {}, () => {
        onClose();
      });
    } else {
      translateY.value = withSpring(0);
    }
  };

  if (!food) return null;

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <PanGestureHandler onGestureEvent={handleGesture} onEnded={handleGestureEnd}>
          <Animated.View style={[styles.modalContent, animatedStyle]}>
            {/* 상단에 '-' 모양 추가 */}
            <View style={styles.dragHandleContainer}>
              <View style={styles.dragHandle} />
            </View>

            <Text style={styles.modalTitle}>콤비네이션 피자{food.name}</Text>

            {/* 기본량 및 직접 입력 */}
            <View style={styles.inputContainer}>
              <View style={styles.inputBox}>
                <Text style={styles.boxTitle}>기본량 (100g 당)</Text>
                <View style={styles.counter}>
                  <TouchableOpacity onPress={() => setQuantity(prev => Math.max(prev - 1, 1))}>
                    <Text style={styles.counterButton}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.counterValue}>{quantity}</Text>
                  <TouchableOpacity onPress={() => setQuantity(prev => prev + 1)}>
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

            {/* 매크로 분포도 */}
            <View style={styles.macroDistribution}>
              <View style={styles.macroItem}>
                <View style={[styles.macroBox, { backgroundColor: 'green' }]} />
                <Text style={styles.macroLabel}>탄수화물 59%</Text>
              </View>
              <View style={styles.macroItem}>
                <View style={[styles.macroBox, { backgroundColor: 'blue' }]} />
                <Text style={styles.macroLabel}>단백질 17%</Text>
              </View>
              <View style={styles.macroItem}>
                <View style={[styles.macroBox, { backgroundColor: 'yellow' }]} />
                <Text style={styles.macroLabel}>지방 22%</Text>
              </View>
            </View>

            {/* 매크로 퍼센트 바 */}
            <View style={styles.progressBar}>
              <View style={[styles.progressSegment, { backgroundColor: 'green', width: '59%' }]} />
              <View style={[styles.progressSegment, { backgroundColor: 'blue', width: '17%' }]} />
              <View style={[styles.progressSegment, { backgroundColor: 'yellow', width: '22%' }]} />
            </View>

            {/* 영양 정보 */}
            <View style={styles.foodDetails}>
              <Text style={styles.caloriesText}>총 칼로리: 108Kcal</Text>
              <View style={styles.nutrientContainer}>
              <View style={styles.nutrientRowContainer}>
                <View style={styles.nutrientColumn}>
                  <Text style={styles.nutrientLabel}>탄수화물</Text>
                  <Text style={styles.nutrientValue}>18.14g</Text>
                </View>
                <View style={styles.nutrientColumn}>
                  <Text style={styles.nutrientLabel}>단백질</Text>
                  <Text style={styles.nutrientValue}>5.34g</Text>
                </View>
                <View style={styles.nutrientColumn}>
                  <Text style={styles.nutrientLabel}>지방</Text>
                  <Text style={styles.nutrientValue}>3.02g</Text>
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.nutrientRowContainer}>
                <View style={styles.nutrientColumn}>
                  <Text style={styles.nutrientLabel}>당</Text>
                  <Text style={styles.nutrientValue}>3.22g</Text>
                </View>
                <View style={styles.nutrientColumn}>
                  <Text style={styles.nutrientLabel}>나트륨</Text>
                  <Text style={styles.nutrientValue}>253.94mg</Text>
                </View>
              </View>
            </View>
            </View>

            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>식단에 추가</Text>
            </TouchableOpacity>
          </Animated.View>
        </PanGestureHandler>
      </View>
    </Modal>
  );
};

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
    height: MODAL_HEIGHT,  // 모달 높이를 전체 화면의 75%로 설정
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 15, // 양 옆 padding을 줄여서 흰색 박스와 #008080 색 박스의 여백을 감소
    paddingVertical: 15,
  },
  inputContainer: {
    flexDirection: 'row', // 가로로 배치
    justifyContent: 'space-between', // 두 상자 사이에 공간을 균등하게 분배
    marginBottom: 20, // 아래 여백
  },
  inputBox: {
    width: '45%', // 상자의 너비를 45%로 설정하여 두 개 상자를 나란히 배치
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#00796B',
    backgroundColor: '#00796B', // 배경색
  },
  boxTitle: {
    textAlign: 'center', // 제목 텍스트를 가운데 정렬
    color: 'white', // 텍스트 색상
    marginBottom: 10, // 제목과 상자 내용 간의 여백
    fontWeight: 'bold',
  },
  counter: {
    flexDirection: 'row', // 가로로 배치
    justifyContent: 'space-between', // 좌우로 공간 균등 분배
    alignItems: 'center', // 세로 가운데 정렬
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    backgroundColor: 'white', // 카운터의 배경색
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
    textAlign: 'center', // 입력 텍스트 가운데 정렬
    backgroundColor: 'white',
    fontSize: 18,
    height: 40,
  },
  dragHandleContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  dragHandle: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
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
    width: '100%',
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
    height: 1,          // 구분선의 높이를 설정 (1px 두께)
    backgroundColor: '#ccc',  // 구분선 색상을 회색으로 설정
    marginVertical: 10,  // 위, 아래 여백 설정 (위아래로 10px 여백)
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
