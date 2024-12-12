import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';
import styles from './RoutineSetupScreenStyles';
import CONFIG from '../../config';

const RoutineSetupScreen = ({ navigation, route }) => {
  const { selectedDate } = route.params;
  const [routines, setRoutines] = useState([]);
  const [newRoutine, setNewRoutine] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  
  

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
    setIsAdding(true);
  };

  const handleAddComplete = async () => {
    if (newRoutine.trim()) {
      try {
        const token = await AsyncStorage.getItem('jwtToken');
        if (!token) {
          Alert.alert('Error', '로그인이 필요합니다.');
          navigation.navigate('Login');
          return;
        }

        const response = await fetch(`${CONFIG.API_BASE_URL}/exercise/customMuscle`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: newRoutine }),
        });

        if (response.ok) {
          fetchRoutines(); // 새로 추가 후 목록 업데이트
          setNewRoutine('');
          setIsAdding(false);
        } else {
          throw new Error('Failed to add custom muscle');
        }
      } catch (error) {
        Alert.alert('Error', '새로운 근육 목록을 추가하지 못했습니다.');
        console.error(error);
      }
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

          {/* 새로운 운동 추가 */}
          {isAdding && (
            <View style={styles.newRoutineContainer}>
              <TextInput
                style={styles.newRoutineInput}
                placeholder="훈련 이름 입력"
                value={newRoutine}
                onChangeText={setNewRoutine}
                autoFocus
              />
              <TouchableOpacity onPress={handleAddComplete} style={styles.completeButton}>
                <Text style={styles.completeButtonText}>완료</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* 추가 버튼 */}
        <TouchableOpacity style={styles.addButton} onPress={handleAddRoutine}>
          <Text style={styles.addButtonText}>+ 훈련 추가</Text>
        </TouchableOpacity>
      </View>
      <Footer />
    </View>
  );
};

export default RoutineSetupScreen;
