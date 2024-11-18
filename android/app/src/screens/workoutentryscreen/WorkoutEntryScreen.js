import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';
import styles from './WorkoutEntryScreenStyles';
import CONFIG from '../../config';

const getCurrentTime = () => {
  const date = new Date();
  return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
};


const WorkoutEntryScreen = ({ route, navigation }) => {
  const { selectedWorkouts, routineName } = route.params;

  const [workoutData, setWorkoutData] = useState(
    selectedWorkouts.map((workout) => ({
      id: workout.id,
      name: workout.name,
      muscles: workout.muscles || [], // muscles 정보 포함
      sets: [{ weight: '', reps: '', memo: '' }],
    }))
  );

  const [startTimeHours, setStartTimeHours] = useState(getCurrentTime().split(':')[0]);
  const [startTimeMinutes, setStartTimeMinutes] = useState(getCurrentTime().split(':')[1]);
  const [endTimeHours, setEndTimeHours] = useState('00');
  const [endTimeMinutes, setEndTimeMinutes] = useState('00');
  const [generalMemo, setGeneralMemo] = useState('');

  const getCurrentDate = () => {
    const date = new Date();
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  const calculateTotalTime = () => {
    const startHours = parseInt(startTimeHours, 10);
    const startMinutes = parseInt(startTimeMinutes, 10);
    const endHours = parseInt(endTimeHours, 10);
    const endMinutes = parseInt(endTimeMinutes, 10);

    let totalMinutes = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
    if (totalMinutes < 0) totalMinutes += 24 * 60; // 다음 날로 넘어가는 경우 고려

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}h ${minutes}m`;
  };

  const handleComplete = async () => {
    const totalTime = calculateTotalTime();
    const workoutSession = {
      routineName,
      startTime: `${startTimeHours}:${startTimeMinutes}`,
      endTime: `${endTimeHours}:${endTimeMinutes}`,
      generalMemo,
      exercises: workoutData,
    };

    try {
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        Alert.alert('Error', '로그인이 필요합니다.');
        navigation.navigate('Login');
        return;
      }

      const response = await fetch(`${CONFIG.API_BASE_URL}/workouts/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(workoutSession),
      });

      if (response.ok) {
        Alert.alert('Success', '운동 세션이 저장되었습니다!');
        navigation.navigate('WorkoutSummary', {
          date: getCurrentDate(),
          routineName,
          memo: generalMemo,
          exercises: workoutData,
          totalTime,
        });
      } else {
        throw new Error('운동 세션 저장 실패');
      }
    } catch (error) {
      console.error('Error saving workout session:', error);
      Alert.alert('Error', '운동 세션 저장 중 오류가 발생했습니다.');
    }
  };

  const addSet = (workoutId) => {
    setWorkoutData((prevData) =>
      prevData.map((workout) =>
        workout.id === workoutId
          ? { ...workout, sets: [...workout.sets, { weight: '', reps: '', memo: '' }] }
          : workout
      )
    );
  };

  const handleSetChange = (workoutId, setIndex, field, value) => {
    setWorkoutData((prevData) =>
      prevData.map((workout) =>
        workout.id === workoutId
          ? {
              ...workout,
              sets: workout.sets.map((set, idx) =>
                idx === setIndex ? { ...set, [field]: value } : set
              ),
            }
          : workout
      )
    );
  };

  const renderSetItem = (set, workoutId, setIndex) => (
    <View key={setIndex} style={styles.setRow}>
      <View style={styles.circle}>
        <Text style={styles.setNumber}>{setIndex + 1}</Text>
      </View>
      <View style={styles.inputWithUnit}>
        <TextInput
          style={styles.smallInput}
          placeholder="0"
          keyboardType="numeric"
          onChangeText={(text) => handleSetChange(workoutId, setIndex, 'weight', text)}
        />
        <Text style={styles.unitText}>kg</Text>
      </View>
      <View style={styles.inputWithUnit}>
        <TextInput
          style={styles.smallInput}
          placeholder="0"
          keyboardType="numeric"
          onChangeText={(text) => handleSetChange(workoutId, setIndex, 'reps', text)}
        />
        <Text style={styles.unitText}>회</Text>
      </View>
      <TextInput
        style={styles.largeInput}
        placeholder="메모"
        value={set.memo}
        onChangeText={(text) => handleSetChange(workoutId, setIndex, 'memo', text)}
      />
    </View>
  );

  const renderWorkoutItem = (workout) => (
    <View key={workout.id} style={styles.workoutContainer}>
      <Text style={styles.workoutTitle}>{workout.name}</Text>
      <Text style={styles.muscleInfo}>
        부위: {workout.muscles.map((muscle) => muscle.name).join(', ')}
      </Text>
      {workout.sets.map((set, index) => renderSetItem(set, workout.id, index))}
      <TouchableOpacity onPress={() => addSet(workout.id)}>
        <Text style={styles.addSetText}>세트 추가</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f0f0f0' }}>
      <Navbar />
      <ScrollView contentContainerStyle={styles.scrollContentContainer} style={{ flex: 1 }}>
        <View style={styles.headerRow}>
          <Text style={styles.dateText}>{getCurrentDate()}</Text>
          <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
            <Text style={styles.completeButtonText}>완료</Text>
          </TouchableOpacity>
        </View>

        {/* 운동 정보 */}
        <View style={styles.mainBox}>
          <Text style={styles.mainBoxTitle}>{routineName}</Text>

          {/* 시작 시간 */}
          <View style={styles.timeRow}>
            <Text style={styles.timeLabel}>시작 시간</Text>
            <View style={styles.timeInputContainer}>
              <TextInput
                style={styles.timeInput}
                value={startTimeHours}
                onChangeText={(text) => setStartTimeHours(text.replace(/[^0-9]/g, '').slice(0, 2))}
                keyboardType="numeric"
                maxLength={2}
              />
              <Text style={styles.colonText}>:</Text>
              <TextInput
                style={styles.timeInput}
                value={startTimeMinutes}
                onChangeText={(text) => setStartTimeMinutes(text.replace(/[^0-9]/g, '').slice(0, 2))}
                keyboardType="numeric"
                maxLength={2}
              />
            </View>
          </View>

          {/* 종료 시간 */}
          <View style={styles.timeRow}>
            <Text style={styles.timeLabel}>종료 시간</Text>
            <View style={styles.timeInputContainer}>
              <TextInput
                style={styles.timeInput}
                value={endTimeHours}
                onChangeText={(text) => setEndTimeHours(text.replace(/[^0-9]/g, '').slice(0, 2))}
                keyboardType="numeric"
                maxLength={2}
              />
              <Text style={styles.colonText}>:</Text>
              <TextInput
                style={styles.timeInput}
                value={endTimeMinutes}
                onChangeText={(text) => setEndTimeMinutes(text.replace(/[^0-9]/g, '').slice(0, 2))}
                keyboardType="numeric"
                maxLength={2}
              />
            </View>
          </View>

          <TextInput
            style={styles.memoInput}
            placeholder="메모"
            value={generalMemo}
            onChangeText={(text) => setGeneralMemo(text)}
          />
        </View>

        {workoutData.map(renderWorkoutItem)}
      </ScrollView>
      <Footer navigation={navigation} />
    </View>
  );
};

export default WorkoutEntryScreen;
