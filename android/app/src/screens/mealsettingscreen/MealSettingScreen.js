import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './MealSettingScreenStyles';
import Navbar from '../../components/navbar/Navbar';
import FoodDetailModal from '../../components/modal/FoodDetailModal';  // 모달 컴포넌트 가져오기

const MealSettingScreen = ({ route = {}, navigation }) => {
  const { mealType = '식단' } = route.params || {};  // mealType이 없을 경우 기본값 '식단'으로 설정

  // 하드코딩된 더미 데이터
  const dummyFoodList = [
    { _id: '1', food_name: '포테이토 피자', calories: 103 },
    { _id: '2', food_name: '고구마 피자', calories: 129 },
    { _id: '3', food_name: '콤비네이션 피자', calories: 108 },
    { _id: '4', food_name: '치즈 피자', calories: 99 },
  ];

  const [foodList, setFoodList] = useState(dummyFoodList); // 더미 데이터를 사용
  const [searchText, setSearchText] = useState(''); 
  const [selectedFood, setSelectedFood] = useState(null); // 모달에 표시할 음식 정보
  const [modalVisible, setModalVisible] = useState(false);

  // 음식 선택 시 모달을 열고 선택된 음식 정보 저장
  const handleFoodSelect = (food) => {
    setSelectedFood(food);
    setModalVisible(true);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleFoodSelect(item)} style={customStyles.itemContainer}>
      <View style={customStyles.itemContent}>
        <Text style={customStyles.foodName}>{item.food_name}</Text>
        <Text style={customStyles.foodCalories}>{item.calories}Kcal</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <Navbar />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text>{mealType + ' 식단'}</Text>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={24} color="gray" />
          <TextInput
            style={styles.searchInput}
            placeholder="음식 검색"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* 음식 리스트 표시 */}
        <FlatList
          data={foodList} // 하드코딩된 음식 목록 데이터 사용
          keyExtractor={item => item._id}
          renderItem={renderItem}
          ListEmptyComponent={<Text>음식 목록이 없습니다.</Text>}
        />

        {/* 음식 상세 정보 모달 */}
        <FoodDetailModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          food={selectedFood}
        />
      </View>
    </View>
  );
};

// 커스텀 스타일
const customStyles = StyleSheet.create({
  itemContainer: {
    borderWidth: 1,
    borderColor: '#00A896',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  foodName: {
    fontSize: 16,
    color: '#333',
  },
  foodCalories: {
    fontSize: 14,
    color: '#999',
  },
});

export default MealSettingScreen;
