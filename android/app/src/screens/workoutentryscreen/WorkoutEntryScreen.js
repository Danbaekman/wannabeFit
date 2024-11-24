import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';
import styles from './WorkoutEntryScreenStyles';
import CONFIG from '../../config';

const getCurrentTime = () => {
  const date = new Date();
  return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
};

const formatDateTime = (hours, minutes) => {
  const now = new Date();
  now.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
  return now.toISOString();
};

const WorkoutEntryScreen = ({ route, navigation }) => {
  const { selectedWorkouts, routineName } = route.params;

  const [workoutData, setWorkoutData] = useState(
    selectedWorkouts.map((workout) => ({
      id: workout._id,
      name: workout.name,
      muscles: workout.muscles || [],
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

  const handleComplete = async () => {
    const muscles = [
      ...new Set(
        workoutData.flatMap((workout) => workout.muscles.map((muscle) => muscle._id))
      ),
    ].filter(Boolean);

    if (muscles.length === 0) {
      Alert.alert('Error', '운동에 근육 정보가 포함되지 않았습니다.');
      return;
    }

    const exercises = workoutData.map((workout) => ({
      exerciseName: workout.id,
      sets: workout.sets
        .filter((set) => set.weight && set.reps)
        .map((set) => ({
          weight: parseFloat(set.weight),
          reps: parseInt(set.reps, 10),
          memo: set.memo || '',
        })),
    }));

    const startTime = formatDateTime(startTimeHours, startTimeMinutes);
    const endTime = formatDateTime(endTimeHours, endTimeMinutes);

    const formattedData = {
      muscles,
      exercises,
      startTime,
      endTime,
      memo: generalMemo,
    };

    console.log('Formatted Data:', JSON.stringify(formattedData, null, 2));

    try {
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        Alert.alert('Error', '로그인이 필요합니다.');
        navigation.navigate('Login');
        return;
      }

      const response = await fetch(`${CONFIG.API_BASE_URL}/workout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formattedData),
      });

      const responseJson = await response.json();
      if (response.ok) {
        Alert.alert('Success', '운동 세션이 저장되었습니다!');
        navigation.navigate('WorkoutSummary', { exercises: workoutData, startTime, endTime, generalMemo });
      } else {
        console.error('Server Error:', responseJson);
        Alert.alert('Error', responseJson.message || '운동 기록 저장 실패');
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
          value={set.weight.toString()}
          onChangeText={(text) => handleSetChange(workoutId, setIndex, 'weight', text)}
        />
        <Text style={styles.unitText}>kg</Text>
      </View>
      <View style={styles.inputWithUnit}>
        <TextInput
          style={styles.smallInput}
          placeholder="0"
          keyboardType="numeric"
          value={set.reps.toString()}
          onChangeText={(text) => handleSetChange(workoutId, setIndex, 'reps', text)}
        />
        <Text style={styles.unitText}>회</Text>
      </View>
      <TextInput
        style={styles.largeInput}
        placeholder="세트 메모"
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
      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.dateText}>{getCurrentDate()}</Text>
          <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
            <Text style={styles.completeButtonText}>완료</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.mainBox}>
          <Text style={styles.mainBoxTitle}>{routineName}</Text>
          <View style={styles.timeRow}>
            <Text style={styles.timeLabel}>시작 시간</Text>
            <View style={styles.timeInputContainer}>
              <TextInput
                style={styles.timeInput}
                value={startTimeHours}
                onChangeText={(text) =>
                  setStartTimeHours(text.replace(/[^0-9]/g, '').slice(0, 2))
                }
                keyboardType="numeric"
                maxLength={2}
              />
              <Text style={styles.colonText}>:</Text>
              <TextInput
                style={styles.timeInput}
                value={startTimeMinutes}
                onChangeText={(text) =>
                  setStartTimeMinutes(text.replace(/[^0-9]/g, '').slice(0, 2))
                }
                keyboardType="numeric"
                maxLength={2}
              />
            </View>
          </View>
          <View style={styles.timeRow}>
            <Text style={styles.timeLabel}>종료 시간</Text>
            <View style={styles.timeInputContainer}>
              <TextInput
                style={styles.timeInput}
                value={endTimeHours}
                onChangeText={(text) =>
                  setEndTimeHours(text.replace(/[^0-9]/g, '').slice(0, 2))
                }
                keyboardType="numeric"
                maxLength={2}
              />
              <Text style={styles.colonText}>:</Text>
              <TextInput
                style={styles.timeInput}
                value={endTimeMinutes}
                onChangeText={(text) =>
                  setEndTimeMinutes(text.replace(/[^0-9]/g, '').slice(0, 2))
                }
                keyboardType="numeric"
                maxLength={2}
              />
            </View>
          </View>
          <TextInput
            style={styles.memoInput}
            placeholder="전체 메모"
            value={generalMemo}
            onChangeText={(text) => setGeneralMemo(text)}
          />
        </View>
        {workoutData.map(renderWorkoutItem)}
      </ScrollView>
      <Footer />
    </View>
  );
};

export default WorkoutEntryScreen;
