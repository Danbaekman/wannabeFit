import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator, Modal, Button } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // JWT 토큰 불러오기 위한 패키지
import styles from './MealSettingScreenStyles';
import Navbar from '../../components/navbar/Navbar';
import CONFIG from '../../config';  // CONFIG 객체를 올바르게 가져오기

const MealSettingScreen = ({ route, navigation }) => {
  const { mealType } = route.params; // 아침/점심/저녁 전달받음

  const [foodList, setFoodList] = useState([]); // 초기 상태를 빈 배열로 설정
  const [searchText, setSearchText] = useState(''); // 검색 상태
  const [selectedTab, setSelectedTab] = useState('세트등록'); // 선택된 탭 상태 ('세트등록' 기본값)
  const [loading, setLoading] = useState(false);
  const [jwtToken, setJwtToken] = useState(''); // JWT 토큰 저장
  const [selectedFood, setSelectedFood] = useState(null); // 선택된 음식 정보 저장
  const [modalVisible, setModalVisible] = useState(false); // 모달 상태

  // AsyncStorage에서 JWT 토큰을 불러오는 함수
  useEffect(() => {
    const getToken = async () => {
      try {
        const token = await AsyncStorage.getItem('jwtToken');
        if (token) {
          setJwtToken(token);
        }
      } catch (error) {
        console.error('Failed to retrieve JWT token from storage:', error);
      }
    };

    getToken();
  }, []);

  // 음식 검색 함수
  const searchFood = async () => {
    if (!jwtToken) {
      console.error('No JWT token found');
      return;
    }

    // 정보량이 많으므로 로딩 상태를 설정
    setLoading(true);

    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/food/search?query=${searchText}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`, // JWT 토큰 전송
        },
      });

      const data = await response.json();

      // 서버에서 응답이 배열로 반환됨을 확인하고 데이터 설정
      if (Array.isArray(data)) {
        setFoodList(data); // 응답 데이터를 foodList에 저장
      } else {
        console.error('Invalid data format:', data);
        setFoodList([]); // 데이터 형식이 잘못된 경우 빈 배열로 설정
      }

    } catch (error) {
      console.error('Error fetching food data:', error);
      setFoodList([]); // 오류 발생 시 빈 배열로 설정
    } finally {
      setLoading(false);
    }
  };

  // 네비게이션 제목 설정
  useEffect(() => {
    navigation.setOptions({ title: mealType + ' 설정' });
  }, [navigation, mealType]);

 // 세트 등록 함수 (하드코딩된 데이터에 항목을 추가하는 예시)
const handleSetRegister = () => {
    setFoodList([...foodList, { _id: new Date().toString(), food_name: '오트밀 & 우유' }]);
  };
  
  // 등록하기 버튼 클릭 시 이동 처리
  const handleRegisterClick = () => {
    if (selectedTab === '직접등록') {
      navigation.navigate('DirectRegister'); // 직접 등록 화면으로 이동
    } else if (selectedTab === '세트등록') {
      handleSetRegister(); // 세트 등록 처리
    }
  };
  
  

  // 검색 필터링 (대소문자 무시)
  const filteredFoodList = foodList.filter(item => 
    item.food_name.toLowerCase().includes(searchText.toLowerCase()) // food_name으로 필터링
  );

  // 음식 선택 시 모달을 열고 선택된 음식 정보 저장
  const handleFoodSelect = (food) => {
    setSelectedFood(food);
    setModalVisible(true);
  };

  return (
    <View style={{ flex: 1 }}>
      <Navbar />
      <View style={styles.container}>
        {/* 상단 네비게이션 */}
        <View style={styles.header}>
          <Text>{mealType + ' 식단'}</Text>
        </View>

        {/* 검색 입력 */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={24} color="gray" />
          <TextInput
            style={styles.searchInput}
            placeholder="음식 검색"
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={searchFood} // 엔터 입력 시 음식 검색 실행
          />
        </View>

        {/* 탭 메뉴 (즐겨찾기, 세트등록, 직접등록) */}
        <View style={styles.tabMenu}>
          <TouchableOpacity onPress={() => setSelectedTab('즐겨찾기')}>
            <Text style={[styles.tabText, selectedTab === '즐겨찾기' && styles.activeTab]}>즐겨찾기</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedTab('세트등록')}>
            <Text style={[styles.tabText, selectedTab === '세트등록' && styles.activeTab]}>세트등록</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedTab('직접등록')}>
            <Text style={[styles.tabText, selectedTab === '직접등록' && styles.activeTab]}>직접등록</Text>
          </TouchableOpacity>
        </View>

        {/* 세트 등록 */}
        <View style={styles.setRegisterContainer}>
          <Text style={styles.setTitle}>{selectedTab}</Text>
          <Text style={styles.setDescription}>
            자주 먹는 음식을 {selectedTab === '직접등록' ? '직접 등록' : '세트로 등록'}해주세요.
          </Text>
          <TouchableOpacity style={styles.registerButton} onPress={handleRegisterClick}>
            <Text style={styles.registerButtonText}>+ 등록하기</Text>
          </TouchableOpacity>
        </View>

        {/* 로딩 중 표시 */}
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <FlatList
            data={filteredFoodList}
            keyExtractor={item => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleFoodSelect(item)}>
                <Text style={styles.foodItem}>{item.food_name}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={<Text>음식 목록이 없습니다.</Text>}
          />
        )}

        {/* 음식 상세 정보 모달 */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {selectedFood && (
                <>
                  <Text style={styles.foodName}>{selectedFood.food_name}</Text>
                  {/* 이곳에 음식의 상세 정보 (예: 영양소 정보 등)를 추가할 수 있음 */}
                  <Text>칼로리: {selectedFood.calories} kcal</Text>
                  <Text>탄수화물: {selectedFood.carbs} g</Text>
                  <Text>단백질: {selectedFood.protein} g</Text>
                  <Text>지방: {selectedFood.fat} g</Text>

                  <Button title="닫기" onPress={() => setModalVisible(false)} />
                </>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

export default MealSettingScreen;
