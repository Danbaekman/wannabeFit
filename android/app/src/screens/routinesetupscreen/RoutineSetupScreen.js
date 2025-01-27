import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';
import styles from './RoutineSetupScreenStyles';
import CONFIG from '../../config';
import AddRoutineModal from '../../components/modal/addroutine/AddRoutineModal';

const RoutineSetupScreen = ({ navigation, route }) => {
  const { selectedDate } = route.params;
  const [routines, setRoutines] = useState([]);
  const [newRoutine, setNewRoutine] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  
  

  useEffect(() => {
    fetchRoutines();
  }, []);

  const fetchRoutines = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        Alert.alert('Error', '로그인이 필요합니다.');
        navigation.navigate('Login');
        return;
      }

      console.log('API 호출 시도');
      const response = await fetch(`${CONFIG.API_BASE_URL}/exercise/muscles/grouped`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch workouts: ${response.status}`);
      }

      const data = await response.json();
      console.log('Muscle groups data:', JSON.stringify(data, null, 2));

      // muscles 배열의 name과 isCustom 필드만 추출
      const muscleGroups = data[0].muscles.map((muscle) => ({
        name: muscle.name,
        isCustom: muscle.isCustom,
      }));

      setRoutines(muscleGroups);
    } catch (error) {
      Alert.alert('Error', '운동 목록을 불러오지 못했습니다.');
      console.error('Fetch workouts error:', error);
    }
  };

  const handleSaveRoutine = () => {
    navigation.goBack();
  };

  const handleRoutineDetail = (routineName) => {
    navigation.navigate('RoutineDetail', { routineName, selectedDate }); // selectedDate 전달
  };

  const handleAddRoutine = () => {
    setModalVisible(true);
  };

  const handleRoutineAdd = async (routineName) => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        Alert.alert('Error', '로그인이 필요합니다.');
        navigation.navigate('Login');
        return;
      }
  
      // API 호출로 서버에 새 훈련 추가
      const response = await fetch(`${CONFIG.API_BASE_URL}/exercise/customMuscle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: routineName }),
      });
  
      if (response.ok) {
        console.log(`새로운 훈련 추가: ${routineName}`);
        // 새로 추가된 훈련 반영을 위해 목록 다시 가져오기
        fetchRoutines();
      } else {
        throw new Error('Failed to add custom muscle');
      }
    } catch (error) {
      Alert.alert('Error', '새로운 훈련을 추가하지 못했습니다.');
      console.error(error);
    } finally {
      setModalVisible(false); // 모달 닫기
    }
  };


  return (
    <View style={styles.container}>
      <Navbar />
      <View style={styles.contentContainer}>
        <Text style={styles.mytraining}>내 훈련</Text>

        {/* 운동 목록 */}
        <View style={styles.buttonContainer}>
          {routines.map((routine, index) => (
            <TouchableOpacity
              key={index}
              style={styles.routineButton}
              onPress={() => handleRoutineDetail(routine.name)}
            >
              <Text style={styles.routineButtonText}>{routine.name}</Text>
              <Icon name="chevron-forward-outline" size={20} color="#888" />
            </TouchableOpacity>
          ))}
        </View>

        {/* 추가 버튼 */}
        <TouchableOpacity style={styles.addButton} onPress={handleAddRoutine}>
          <Text style={styles.addButtonText}>+ 훈련 추가</Text>
        </TouchableOpacity>
        <AddRoutineModal
          visible={isModalVisible}
          onClose={() => setModalVisible(false)}
          onAddRoutine={handleRoutineAdd} // 수정된 함수 연결
        />
      </View>
      <Footer />
    </View>
  );
};

export default RoutineSetupScreen;
