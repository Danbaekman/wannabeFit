import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';
import styles from './WorkoutSetupScreenStyles';

const WorkoutSetupScreen = ({ navigation, route }) => {
  const { selectedDate } = route.params; // 네비게이션으로 전달된 날짜
  const [hasRoutine, setHasRoutine] = useState(false); // 루틴 존재 여부
  const [workoutRecords, setWorkoutRecords] = useState(null); // 운동 기록 정보
  const [isFutureDate, setIsFutureDate] = useState(false); // 선택한 날짜가 미래인지 여부

  useEffect(() => {
    checkRoutine();
    checkWorkoutRecords();
    checkDateIsFuture();
  }, [selectedDate]);

  const checkRoutine = async () => {
    try {
      const routine = await AsyncStorage.getItem('workoutRoutine');
      setHasRoutine(routine !== null);
    } catch (error) {
      console.error('루틴 상태를 불러오는 중 오류 발생:', error);
    }
  };

  const checkWorkoutRecords = async () => {
    // WorkoutEntryScreen에서 저장한 데이터를 불러오는 로직
    setWorkoutRecords({
      title: '등', // 예시 데이터
      time: '55:00',
      totalSets: 40,
    });
  };

  const checkDateIsFuture = () => {
    const today = new Date().toISOString().split('T')[0];
    setIsFutureDate(selectedDate > today);
  };

  const handleSetupRoutine = () => {
    navigation.navigate('RoutineSetup', { selectedDate });
  };

  return (
    <View style={styles.container}>
      <Navbar />
      <View style={styles.contentContainer}>
        {/* 상단 날짜 표시 */}
        <Text style={styles.dateTitle}>{selectedDate} 운동 일지</Text>

        {/* 주의 문구 표시 (미래 날짜 선택 시) */}
        {isFutureDate && (
          <Text style={styles.warningText}>
            주의: 미래 날짜입니다.
          </Text>
        )}

        {/* 운동 루틴 기록하기 섹션 */}
        <View style={styles.routineSection}>
          <Text style={styles.routineTitle}>운동 루틴 기록하기</Text>
          <Text style={styles.routineSubtitle}>
            나만의 루틴을 기록해보세요
          </Text>
          <View style={styles.addRoutineContainer}>
            <Text style={styles.addRoutineText}>추가하기</Text>
            <TouchableOpacity style={styles.addCircle} onPress={handleSetupRoutine}>
              <Text style={styles.addCircleText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 운동 기록 표시 섹션 */}
        <View style={styles.recordSection}>
          <Text style={styles.recordTitle}>내 기록</Text>
          {workoutRecords ? (
            <View style={styles.recordCard}>
              <Text style={styles.recordCardTitle}>{workoutRecords.title}</Text>
              <View style={styles.recordDetails}>
                <Text style={styles.recordTime}>{workoutRecords.time}</Text>
                <Text style={styles.recordSets}>
                  총 세트 수: {workoutRecords.totalSets}
                </Text>
              </View>
            </View>
          ) : (
            <Text style={styles.noRecordText}>운동 기록이 필요합니다</Text>
          )}
        </View>
      </View>
      <Footer />
    </View>
  );
};

export default WorkoutSetupScreen;
