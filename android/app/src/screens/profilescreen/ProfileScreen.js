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

  const translateGoal = (goal) => {
    const goalMap = {
      diet: '다이어트',
      bulk: '벌크업',
      maintain: '유지',
    };
    return goalMap[goal] || '정보 없음';
  };

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

  const handleUpdateField = async (dataToSave) => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        Alert.alert('오류', '토큰이 없습니다.');
        return;
      }
  
      if (!editableField || dataToSave === undefined || dataToSave === null) {
        Alert.alert('오류', '수정할 데이터가 올바르지 않습니다.');
        return;
      }
  
      const updatedData = { [editableField]: dataToSave };
  
      const response = await fetch(`${CONFIG.API_BASE_URL}/profile/profile-update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });
  
      if (response.ok) {
        const updatedUser = await response.json();
        setUserData((prevData) => ({
          ...prevData,
          ...updatedUser.user,
        }));
  
        setIsModalVisible(false);
        let successMessage = '정보가 성공적으로 변경되었습니다.';
        if (editableField === 'exerciseFrequency') {
          successMessage = `운동 빈도가 주 ${dataToSave}회로 변경되었습니다.`;
        }
        Alert.alert('성공', successMessage);
      } else {
        const responseJson = await response.json();
        const errorMessage = responseJson.error || '정보 변경에 실패했습니다.';
        Alert.alert('실패', errorMessage);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('오류', `${editableField} 변경 중 오류가 발생했습니다.`);
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
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back-outline" size={32} color="#000" />
        </TouchableOpacity>

        <Text style={styles.greetingText}>
          <Text style={styles.userName}>{userData?.name || '사용자 이름'}</Text>님 {'\n'}오늘도 득근하세요!
        </Text>

        <View style={styles.imageContainer}>
          <Image
            source={require('../../../assets/images/default-profile.png')}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.cameraIcon}>
            <Icon name="camera-outline" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

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

      <View style={{ width: '100%' }}>
        <View style={styles.sectionSeparator} />
      </View>

      <View style={styles.container}>
  {/* 목표 섹션 */}
  <Text style={styles.goalTitle}>목표</Text>
  <View style={styles.goalBox}>
    <View style={styles.goalItemRow}>
      <Text style={styles.goalLabel}>목적</Text>
      <View style={styles.goalValueContainer}>
        <Text style={styles.goalValue}>{translateGoal(userData?.goal)}</Text>
        <TouchableOpacity
          onPress={() => {
            setEditableField('goal');
            setInputValue(userData?.goal || '');
            setIsModalVisible(true);
          }}
        >
          <Icon name="chevron-forward-outline" size={18} color="#888" />
        </TouchableOpacity>
      </View>
    </View>
    <View style={styles.goalItemRow}>
      <Text style={styles.goalLabel}>운동 빈도</Text>
      <View style={styles.goalValueContainer}>
        <Text style={styles.goalValue}>{userData?.exerciseFrequency || '정보 없음'}회/주</Text>
        <TouchableOpacity
          onPress={() => {
            setEditableField('exerciseFrequency');
            setInputValue(userData?.exerciseFrequency?.toString() || '');
            setIsModalVisible(true);
          }}
        >
          <Icon name="chevron-forward-outline" size={18} color="#888" />
        </TouchableOpacity>
      </View>
    </View>
    <View style={styles.goalItemRow}>
      <Text style={styles.goalLabel}>기초 대사량(BMR)</Text>
      <View style={styles.goalValueContainer}>
        <Text style={styles.goalValue}>
          {userData?.bmr ? Math.round(userData.bmr) : '정보 없음'} kcal
        </Text>
        <TouchableOpacity disabled>
          <Icon name="chevron-forward-outline" size={18} color="#ccc" />
        </TouchableOpacity>
      </View>
    </View>
    <View style={styles.goalItemRow}>
      <Text style={styles.goalLabel}>목표 체중</Text>
      <View style={styles.goalValueContainer}>
        <Text style={styles.goalValue}>{userData?.targetWeight || '정보 없음'} kg</Text>
        <TouchableOpacity
          onPress={() => {
            setEditableField('targetWeight');
            setInputValue(userData?.targetWeight?.toString() || '');
            setIsModalVisible(true);
          }}
        >
          <Icon name="chevron-forward-outline" size={18} color="#888" />
        </TouchableOpacity>
      </View>
    </View>
    <View style={styles.goalItemRow}>
      <Text style={styles.goalLabel}>목표 칼로리</Text>
      <View style={styles.goalValueContainer}>
        <Text style={styles.goalValue}>
          {userData?.target_calories ? Math.round(userData.target_calories) : '정보 없음'} kcal
        </Text>
        <TouchableOpacity disabled>
          <Icon name="chevron-forward-outline" size={18} color="#ccc" />
        </TouchableOpacity>
      </View>
    </View>
    <View style={styles.goalItemRow}>
      <Text style={styles.goalLabel}>목표 탄.단.지</Text>
      <View style={styles.goalValueContainer}>
        <Text style={styles.goalValue}>
          {userData?.recommended_carbs || '정보 없음'}g /{' '}
          {userData?.recommended_protein || '정보 없음'}g /{' '}
          {userData?.recommended_fat || '정보 없음'}g
        </Text>
        <TouchableOpacity disabled>
          <Icon name="chevron-forward-outline" size={18} color="#ccc" />
        </TouchableOpacity>
      </View>
    </View>
  </View>
</View>


  <ProfileModal
    isVisible={isModalVisible}
    field={editableField}
    value={inputValue}
    onClose={() => setIsModalVisible(false)}
    onChangeValue={setInputValue}
    onSave={handleUpdateField}
    userData={userData}
  />
    </ScrollView>
  );
};

export default ProfileScreen;
