import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, Alert, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from './ProfileScreenStyles';
import ProfileModal from '../../components/modal/profile/ProfileModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONFIG from '../../config';

const ProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editableField, setEditableField] = useState('');
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('jwtToken');
        if (!token) {
          console.error('No token found');
          return;
        }

        const response = await fetch(`${CONFIG.API_BASE_URL}/profile`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          console.error('Failed to fetch user data:', response.status);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdateField = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        Alert.alert('오류', '토큰이 없습니다.');
        return;
      }

      const response = await fetch(`${CONFIG.API_BASE_URL}/profile/profile-update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ [editableField]: inputValue }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUserData((prevData) => ({
          ...prevData,
          [editableField]: inputValue,
        }));

        setIsModalVisible(false);
        Alert.alert('성공', `${editableField === 'name' ? '닉네임' : '몸무게'}이 변경되었습니다.`);
      } else {
        Alert.alert('실패', `${editableField === 'name' ? '닉네임' : '몸무게'} 변경에 실패했습니다.`);
      }
    } catch (error) {
      Alert.alert('오류', `${editableField === 'name' ? '닉네임' : '몸무게'} 변경 중 오류가 발생했습니다.`);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#008080" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text style={styles.greetingText}>사용자 정보를 불러올 수 없습니다.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* 좌측 상단 뒤로가기 버튼 */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back-outline" size={32} color="#000" />
        </TouchableOpacity>

        {/* 상단 사용자 인사 */}
        <Text style={styles.greetingText}>
          <Text style={styles.userName}>{userData?.name || '사용자 이름'}</Text>님 {'\n'}오늘도 득근하세요!
        </Text>

        {/* 프로필 이미지 섹션 */}
        <View style={styles.imageContainer}>
          <Image
            source={require('../../../assets/images/default-profile.png')}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.cameraIcon}>
            <Icon name="camera-outline" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* 사용자 정보 */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>닉네임</Text>
          <TouchableOpacity
            style={styles.infoRow}
            onPress={() => {
              setEditableField('name');
              setInputValue(userData?.name || '');
              setIsModalVisible(true);
            }}
          >
            <Text style={styles.infoText}>{userData?.name || '정보 없음'}</Text>
            <Icon name="chevron-forward-outline" size={18} color="#888" />
          </TouchableOpacity>

          <Text style={styles.infoLabel}>성별</Text>
          <View style={styles.disabledInfoRow}>
            <Text style={styles.disabledInfoText}>{userData?.gender === 'M' ? '남성' : '여성'}</Text>
            <Icon name="chevron-forward-outline" size={18} style={styles.disabledIcon} />
          </View>

          <Text style={styles.infoLabel}>키</Text>
          <View style={styles.disabledInfoRow}>
            <Text style={styles.disabledInfoText}>{userData?.height || '정보 없음'} cm</Text>
            <Icon name="chevron-forward-outline" size={18} style={styles.disabledIcon} />
          </View>

          <Text style={styles.infoLabel}>시작 체중</Text>
          <TouchableOpacity
            style={styles.infoRow}
            onPress={() => {
              setEditableField('weight');
              setInputValue(userData?.weight?.toString() || '');
              setIsModalVisible(true);
            }}
          >
            <Text style={styles.infoText}>{userData?.weight || '정보 없음'} kg</Text>
            <Icon name="chevron-forward-outline" size={18} color="#888" />
          </TouchableOpacity>
        </View>
        </View>

        {/* 경계선 */}
        <View style={{ width: '100%' }}>
            <View style={styles.sectionSeparator} />
        </View>

        <View style={styles.container}>


        {/* 목표 섹션 */}
<Text style={styles.goalTitle}>목표</Text>
<View style={styles.goalBox}>
  <View style={styles.goalItemRow}>
    <Text style={styles.goalLabel}>유형</Text>
    <Text style={styles.goalValue}>{userData?.goal || '정보 없음'}</Text>
  </View>
  <View style={styles.goalItemRow}>
    <Text style={styles.goalLabel}>운동 빈도</Text>
    <Text style={styles.goalValue}>{userData?.exerciseFrequency || '정보 없음'}회/주</Text>
  </View>
  <View style={styles.goalItemRow}>
    <Text style={styles.goalLabel}>기초 대사량(BMR)</Text>
    <Text style={styles.goalValue}>{userData?.bmr || '정보 없음'} kcal</Text>
  </View>
  <View style={styles.goalItemRow}>
    <Text style={styles.goalLabel}>목표 체중</Text>
    <Text style={styles.goalValue}>{userData?.targetWeight || '정보 없음'} kg</Text>
  </View>
  <View style={styles.goalItemRow}>
    <Text style={styles.goalLabel}>목표 칼로리</Text>
    <Text style={styles.goalValue}>{userData?.target_calories || '정보 없음'} kcal</Text>
  </View>
  <View style={styles.goalItemRow}>
    <Text style={styles.goalLabel}>목표 탄단지 비율</Text>
    <Text style={styles.goalValue}>
      {userData?.recommended_protein || '정보 없음'}g 단백질 /{' '}
      {userData?.recommended_carbs || '정보 없음'}g 탄수화물 /{' '}
      {userData?.recommended_fat || '정보 없음'}g 지방
    </Text>
  </View>
</View>

          </View>
        

        <ProfileModal
          isVisible={isModalVisible}
          name={inputValue}
          onClose={() => setIsModalVisible(false)}
          onChangeName={setInputValue}
          onSave={handleUpdateField}
        />
      
    </ScrollView>
  );
};

export default ProfileScreen;
