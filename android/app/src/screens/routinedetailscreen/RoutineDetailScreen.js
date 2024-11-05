import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from './RoutineDetailScreenStyles';
import Navbar from '../../components/navbar/Navbar';

const RoutineDetailScreen = ({ route, navigation }) => {
  const { routineName } = route.params;

  // 선택된 운동 목록
  const [selectedWorkouts, setSelectedWorkouts] = useState([]);

  // 하드코딩된 운동 목록 (추후 백엔드 연동 시 수정 예정)
  const workouts = [
    { id: '1', name: '풀업' },
    { id: '2', name: '데드리프트' },
    { id: '3', name: '랫풀 다운' },
    { id: '4', name: '시티드 로우' },
    { id: '5', name: '암풀 다운' },
    { id: '6', name: '바벨 로우' },
    { id: '7', name: '덤벨 로우' },
  ];

  // 선택한 운동 추가 및 제거 함수
  const toggleWorkoutSelection = (workout) => {
    setSelectedWorkouts((prevSelected) => {
      const exists = prevSelected.find((w) => w.id === workout.id);
      if (exists) {
        // 이미 선택된 운동이면 제거
        return prevSelected.filter((w) => w.id !== workout.id);
      } else {
        // 선택되지 않은 운동이면 추가
        return [...prevSelected, { id: workout.id, name: workout.name }];
      }
    });
  };

  // 다음 단계로 이동하는 함수
  const handleNextStep = () => {
    navigation.navigate('WorkoutEntry', { selectedWorkouts, routineName });
  };

  // 운동 항목 렌더링 함수
  const renderWorkoutItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.workoutItem,
        selectedWorkouts.some((w) => w.id === item.id) && styles.selectedWorkoutItem,
      ]}
      onPress={() => toggleWorkoutSelection(item)}
    >
      <Text style={styles.workoutName}>{item.name}</Text>
      <Icon
        name={
          selectedWorkouts.some((w) => w.id === item.id) ? "checkbox-outline" : "square-outline"
        }
        size={24}
        color={selectedWorkouts.some((w) => w.id === item.id) ? "#008080" : "#888"}
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
          keyExtractor={(item) => item.id}
          renderItem={renderWorkoutItem}
          ListEmptyComponent={<Text>운동 목록이 없습니다.</Text>}
          contentContainerStyle={styles.workoutList}
        />
      </View>
    </View>
  );
};

export default RoutineDetailScreen;
