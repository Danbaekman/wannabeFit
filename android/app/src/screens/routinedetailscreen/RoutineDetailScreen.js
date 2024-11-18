import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from './RoutineDetailScreenStyles';
import Navbar from '../../components/navbar/Navbar';
import CONFIG from '../../config';

const RoutineDetailScreen = ({ route, navigation }) => {
  const { routineName } = route.params; // routineName만 사용
  const [selectedWorkouts, setSelectedWorkouts] = useState([]);
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    fetchWorkouts(); // 운동 데이터 가져오기
  }, []);

  // 운동 목록 가져오기 및 필터링
  const fetchWorkouts = async () => {
    console.log('API 호출 시도');
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        Alert.alert('Error', '로그인이 필요합니다.');
        navigation.navigate('Login');
        return;
      }

      const response = await fetch(`${CONFIG.API_BASE_URL}/exercise/exercises`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch workouts: ${response.status}`);
      }

      const data = await response.json();

      // `routineName`으로 운동 필터링
      const filteredWorkouts = data.filter((exercise) =>
        exercise.muscles.some((muscle) => muscle.name === routineName)
      );

      // 중복 제거
      const uniqueWorkouts = Array.from(new Set(filteredWorkouts.map((workout) => workout.name))).map(
        (name) => filteredWorkouts.find((workout) => workout.name === name)
      );

      setWorkouts(uniqueWorkouts); // 필터링된 운동 목록 저장
    } catch (error) {
      Alert.alert('Error', '운동 목록을 불러오지 못했습니다.');
      console.error('Fetch workouts error:', error);
    }
  };

  // 운동 선택/해제 토글
  const toggleWorkoutSelection = (workout) => {
    setSelectedWorkouts((prevSelected) => {
      const exists = prevSelected.find((w) => w._id === workout._id);
      if (exists) {
        return prevSelected.filter((w) => w._id !== workout._id);
      } else {
        return [...prevSelected, workout];
      }
    });
  };

  // 다음 단계로 이동
  const handleNextStep = () => {
    navigation.navigate('WorkoutEntry', { selectedWorkouts, routineName });
  };

  // 운동 항목 렌더링
  const renderWorkoutItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.workoutItem,
        selectedWorkouts.some((w) => w._id === item._id) && styles.selectedWorkoutItem,
      ]}
      onPress={() => toggleWorkoutSelection(item)}
    >
      <Text style={styles.workoutName}>{item.name}</Text>
      <Icon
        name={selectedWorkouts.some((w) => w._id === item._id) ? 'checkbox-outline' : 'square-outline'}
        size={24}
        color={selectedWorkouts.some((w) => w._id === item._id) ? '#008080' : '#888'}
      />
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <Navbar />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>{routineName} 운동</Text>
          <TouchableOpacity onPress={handleNextStep}>
            <Text style={styles.nextButtonText}>다음 단계로</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={workouts}
          keyExtractor={(item) => item._id}
          renderItem={renderWorkoutItem}
          ListEmptyComponent={<Text>운동 목록이 없습니다.</Text>}
          contentContainerStyle={styles.workoutList}
        />
      </View>
    </View>
  );
};

export default RoutineDetailScreen;
