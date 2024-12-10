import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';
import styles from './WorkoutSetupScreenStyles';

const WorkoutSetupScreen = ({ navigation, route }) => {
  const { selectedDate } = route.params; // 네비게이션으로 전달된 날짜
  const [hasRoutine, setHasRoutine] = useState(false); // 루틴 존재 여부
  const [workoutRecords, setWorkoutRecords] = useState(null); // 운동 기록 정보
  const [isFutureDate, setIsFutureDate] = useState(false); // 선택한 날짜가 미래인지 여부
  const [modalVisible, setModalVisible] = useState(false); // 상세보기 모달 상태

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
      exercises: [
        { name: '풀업', sets: [{ weight: 0, reps: 12 }, { weight: 0, reps: 10 }] },
        { name: '바벨 로우', sets: [{ weight: 60, reps: 8 }, { weight: 70, reps: 6 }] },
      ],
      generalMemo: '오늘 운동 느낌 좋았음.',
    });
  };

  const checkDateIsFuture = () => {
    const today = new Date().toISOString().split('T')[0];
    setIsFutureDate(selectedDate > today);
  };

  const handleSetupRoutine = () => {
    navigation.navigate('RoutineSetup', { selectedDate });
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <View style={styles.container}>
      <Navbar />
      <Text style={styles.dateTitle}>{selectedDate} 운동 일지</Text>
      <View style={styles.contentContainer}>
        <Text style={styles.mytraining}>내 훈련</Text>
        {/* 주의 문구 표시 (미래 날짜 선택 시) */}
        {isFutureDate && (
          <Text style={styles.warningText}>주의: 미래 날짜입니다.</Text>
        )}

        {/* 운동 루틴 기록하기 섹션 */}
        <View style={styles.routineSection}>
          <Text style={styles.routineTitle}>운동 루틴 기록하기</Text>
          <Text style={styles.routineSubtitle}>나만의 루틴을 기록해보세요</Text>
          <View style={styles.addRoutineContainer}>
            <Text style={styles.addRoutineText}>추가하기</Text>
            <TouchableOpacity style={styles.addCircle} onPress={handleSetupRoutine}>
              <Text style={styles.addCircleText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

       {/* 운동 기록 표시 섹션 */}
<View style={styles.recordSection}>
  <Text style={styles.recordTitle}>오늘의 기록</Text>
  {workoutRecords ? (
    <View style={styles.recordCard}>
    <View style={styles.recordHeader}>
      {/* 제목 정사각형 */}
      <View style={styles.recordSquare}>
        <Text style={styles.recordSquareText}>{workoutRecords.title}</Text>
      </View>
  
      {/* 시간, 세트 수, 버튼 */}
      <View style={styles.recordRightSection}>
        {/* 시간과 세트 수 (세로 배치) */}
        <View style={styles.timeAndSetsWrapper}>
          <View style={styles.recordTimeWrapper}>
            <Icon name="time-outline" size={16} color="#555" />
            <Text style={styles.recordTime}>{workoutRecords.time}</Text>
          </View>
          <Text style={styles.recordSets}>총 세트 수: {workoutRecords.totalSets}</Text>
        </View>
  
        {/* 버튼 */}
        <TouchableOpacity onPress={toggleModal} style={styles.chevronButton}>
          <Icon name="chevron-down-outline" size={20} color="#555" />
        </TouchableOpacity>
      </View>
    </View>
  </View>
  
  ) : (
    <Text style={styles.noRecordText}>운동 기록이 필요합니다</Text>
  )}
</View>

      </View>

      {/* 상세보기 모달 */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{workoutRecords?.title} 상세보기</Text>
            <ScrollView>
              <Text style={styles.modalSubtitle}>총 시간: {workoutRecords?.time}</Text>
              <Text style={styles.modalSubtitle}>
                총 세트 수: {workoutRecords?.totalSets}
              </Text>
              {workoutRecords?.exercises.map((exercise, index) => (
                <View key={index} style={styles.exerciseContainer}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  {exercise.sets.map((set, setIndex) => (
                    <Text key={setIndex} style={styles.exerciseDetails}>
                      세트 {setIndex + 1}: {set.weight}kg x {set.reps}회
                    </Text>
                  ))}
                </View>
              ))}
              <Text style={styles.memoTitle}>메모</Text>
              <Text style={styles.memoText}>
                {workoutRecords?.generalMemo || '메모가 없습니다.'}
              </Text>
            </ScrollView>
            <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Footer />
    </View>
  );
};

export default WorkoutSetupScreen;
