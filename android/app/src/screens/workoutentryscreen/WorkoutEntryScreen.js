// WorkoutEntryScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';
import styles from './WorkoutEntryScreenStyles';

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
      sets: [
        { weight: '', reps: '', memo: '' },
      ],
    }))
  );

  const [startTime, setStartTime] = useState(getCurrentTime());
  const [endTime, setEndTime] = useState('');
  const [generalMemo, setGeneralMemo] = useState(''); // 시작 시간 아래 메모 입력 상태 추가

  const getCurrentDate = () => {
    const date = new Date();
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
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
        value={set.memo}  // 메모 내용이 유지되도록 value로 설정
        onChangeText={(text) => handleSetChange(workoutId, setIndex, 'memo', text)}
      />
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f0f0f0' }}>
      <Navbar />
      <ScrollView contentContainerStyle={styles.scrollContentContainer} style={{ flex: 1 }}>
        {/* 상단 날짜 및 완료 버튼 */}
        <View style={styles.headerRow}>
          <Text style={styles.dateText}>{getCurrentDate()}</Text>
          <TouchableOpacity style={styles.completeButton} onPress={() => alert('완료')}>
            <Text style={styles.completeButtonText}>완료</Text>
          </TouchableOpacity>
        </View>

        {/* 운동 정보 */}
        <View style={styles.mainBox}>
          <Text style={styles.mainBoxTitle}>{routineName}</Text>

          {/* 시작 시간 */}
          <View style={styles.timeRow}>
            <Text style={styles.timeLabel}>시작 시간</Text>
            <TextInput
              style={styles.timeInput}
              placeholder="시작 시간"
              value={startTime}
              onChangeText={(text) => setStartTime(text)}
            />
          </View>

          {/* 종료 시간 */}
          <View style={styles.timeRow}>
            <Text style={styles.timeLabel}>종료 시간</Text>
            <TextInput
              style={styles.timeInput}
              placeholder="종료 시간"
              value={endTime}
              onChangeText={(text) => setEndTime(text)}
            />
          </View>

          <TextInput
            style={styles.memoInput}
            placeholder="메모"
            value={generalMemo}  // 메모 입력 상태 연결
            onChangeText={(text) => setGeneralMemo(text)}
          />
        </View>

        {/* 운동 세트 데이터 */}
        {workoutData.map((workout) => (
          <View key={workout.id} style={styles.workoutContainer}>
            <Text style={styles.workoutTitle}>{workout.name}</Text>
            {workout.sets.map((set, index) => renderSetItem(set, workout.id, index))}
            <TouchableOpacity onPress={() => addSet(workout.id)}>
              <Text style={styles.addSetText}>세트 추가</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <Footer navigation={navigation} />
    </View>
  );
};

export default WorkoutEntryScreen;
