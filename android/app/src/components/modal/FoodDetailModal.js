import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './FoodDetailModalStyles';
import { PanResponder } from 'react-native';

const FoodDetailModal = ({ visible, onClose, food = {}, onAddFood, initialFavorite = false, onFavoriteChange, entryPoint,  }) => {
  const translateY = useSharedValue(0);
  const [quantity, setQuantity] = useState(1);
  const [inputValue, setInputValue] = useState('100g');
  const [isFavorite, setIsFavorite] = useState(initialFavorite);

   // `visible` 상태에 따라 초기화
   useEffect(() => {
    if (visible) {
      setQuantity(1); // 수량 초기화
      setInputValue('100g'); // 입력값 초기화
      setIsFavorite(entryPoint === 'favorites' ? true : initialFavorite); // 즐겨찾기 상태 초기화
    }
  }, [visible, initialFavorite, entryPoint]);

  const handleFavoriteToggle = () => {
    const updatedFavorite = !isFavorite;
    setIsFavorite(updatedFavorite);
  
    if (entryPoint === 'favorites') {
      // 즐겨찾기 모드에서는 부모와 동기화 및 모달 닫기
      if (onFavoriteChange) {
        onFavoriteChange({ ...food, isFavorite: updatedFavorite });
      }
      if (!updatedFavorite) {
        onClose();
      }
    } else {
      // 검색 모드에서는 로컬 상태만 변경
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

          {/* 즐겨찾기 버튼 */}
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

          {/* 탄수화물, 단백질, 지방 비율 */}
          <View style={styles.macroDistribution}>
            {/* 탄수화물 */}
            <View style={styles.macroItem}>
              <Text>탄수화물</Text>
            </View>
          </View>

          {/* 추가 버튼 */}
          <TouchableOpacity style={styles.addButton} onPress={handleAddFood}>
            <Text>식단에 추가</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default FoodDetailModal;
