import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './MealSettingScreenStyles';

const MealSettingScreen = ({ route, navigation }) => {
  const { mealType } = route.params; // 아침/점심/저녁 전달받음

  // 하드코딩된 음식 목록
  const [foodList, setFoodList] = useState([
    { id: '1', name: '바나나' },
    { id: '2', name: '닭가슴살' },
    { id: '3', name: '샐러드' },
    { id: '4', name: '계란' }
  ]);
  const [searchText, setSearchText] = useState(''); // 검색 상태

  // 네비게이션 제목 설정
  useEffect(() => {
    navigation.setOptions({ title: mealType + ' 설정' });
  }, [navigation, mealType]);

  // 세트 등록 함수 (하드코딩된 데이터에 항목을 추가하는 예시)
  const handleSetRegister = () => {
    setFoodList([...foodList, { id: new Date().toString(), name: '오트밀 & 우유' }]);
  };

  // 검색 필터링 (대소문자 무시)
  const filteredFoodList = foodList.filter(item => 
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* 상단 네비게이션 */}
      <View style={styles.header}>
      <Text>{String(mealType)} 식단</Text>
      </View>

      {/* 검색 입력 */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={24} color="gray" />
        <TextInput
          style={styles.searchInput}
          placeholder="음식 검색"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* 탭 메뉴 (즐겨찾기, 세트등록, 직접등록) */}
      <View style={styles.tabMenu}>
        <TouchableOpacity>
          <Text style={styles.tabText}>즐겨찾기</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={[styles.tabText, styles.activeTab]}>세트등록</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.tabText}>직접등록</Text>
        </TouchableOpacity>
      </View>

      {/* 세트 등록 */}
      <View style={styles.seㅇtRegisterContainer}>
        <Text style={styles.setTitle}>세트등록</Text>
        <Text style={styles.setDescription}>자주 먹는 음식을 세트로 등록해주세요,</Text>
        <TouchableOpacity style={styles.registerButton} onPress={handleSetRegister}>
          <Text style={styles.registerButtonText}>+ 등록하기</Text>
        </TouchableOpacity>
      </View>

      {/* 음식 목록 표시 (하드코딩된 목록 사용) */}
      <FlatList
        data={filteredFoodList}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Text>{item.name}</Text> 
        )}
        ListEmptyComponent={<Text>음식 목록이 없습니다.</Text>}
      />
    </View>
  );
};

export default MealSettingScreen;
