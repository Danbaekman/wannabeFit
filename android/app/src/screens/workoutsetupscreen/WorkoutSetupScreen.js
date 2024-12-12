import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';
import DateDisplay from '../../components/datedisplay/DateDisplay';
import styles from './WorkoutSetupScreenStyles';
import CONFIG from '../../config';

const WorkoutSetupScreen = ({ navigation, route }) => {
  const { selectedDate } = route.params; // MainScreen에서 전달된 날짜 값
  console.log('WorkoutSetupScreen - Selected Date:', selectedDate);
  console.log('WorkoutSetupScreen - Selected Date Type:', typeof selectedDate);

  const [workoutRecords, setWorkoutRecords] = useState([]); // 운동 기록 정보
  const [isFutureDate, setIsFutureDate] = useState(false); // 선택한 날짜가 미래인지 여부
  const [modalVisible, setModalVisible] = useState(false); // 상세보기 모달 상태
  const [selectedRecord, setSelectedRecord] = useState(null); // 선택된 기록 상세보기 데이터

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      checkWorkoutRecords(); // 화면이 focus될 때 기록 다시 가져오기
      checkDateIsFuture();
    });

    return unsubscribe;
  }, [navigation]);

  const checkWorkoutRecords = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        Alert.alert('Error', '로그인이 필요합니다.');
        navigation.navigate('Login');
        return;
      }

      const response = await fetch(`${CONFIG.API_BASE_URL}/workout`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('운동 기록을 불러오지 못했습니다.');

      const data = await response.json();
      console.log('Workout logs from server:', data);

      const filteredData = data.workoutLogs.filter((log) => {
        const logDate = new Date(log.startTime).toISOString().split('T')[0];
        const selected = new Date(selectedDate).toISOString().split('T')[0];
        return logDate === selected;
      });

      setWorkoutRecords(filteredData);
    } catch (error) {
      Alert.alert('Error', '운동 기록을 불러오지 못했습니다.');
      console.error('Fetch workout records error:', error);
    }
  };

  const checkDateIsFuture = () => {
    const today = new Date(); // 오늘 날짜
    const selected = new Date(selectedDate); // 문자열을 Date 객체로 변환
    if (isNaN(selected)) {
      console.error('Invalid date format:', selectedDate);
      return;
    }
    setIsFutureDate(selected > today); // 비교 수행
  };

  const handleAddRoutine = () => {
    navigation.navigate('RoutineSetup', { selectedDate }); // 선택한 날짜 전달
  };

  const toggleModal = (record) => {
    setSelectedRecord(record);
    setModalVisible(!modalVisible);
  };

  return (
    <View style={styles.container}>
      <Navbar />
      <DateDisplay date={selectedDate} />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.mytraining}>내 훈련</Text>
        {/* 주의 문구 표시 (미래 날짜 선택 시) */}
        {isFutureDate && (
          <Text style={styles.warningText}>주의: 미래 날짜입니다.</Text>
        )}

        {/* 운동 루틴 추가 섹션 */}
        <View style={styles.routineSection}>
          <Text style={styles.routineTitle}>운동 루틴 추가</Text>
          <Text style={styles.routineSubtitle}>나만의 루틴을 추가해보세요</Text>
          <View style={styles.addRoutineContainer}>
            <TouchableOpacity style={styles.addCircle} onPress={handleAddRoutine}>
              <Text style={styles.addCircleText}>+</Text>
            </TouchableOpacity>
            <Text style={styles.addRoutineText}>루틴 추가</Text>
          </View>
        </View>

        {/* 운동 기록 표시 섹션 */}
        <View style={styles.recordSection}>
          <Text style={styles.recordTitle}>오늘의 기록</Text>
          {workoutRecords && workoutRecords.length > 0 ? (
            workoutRecords.map((record, index) => (
              <View key={index} style={styles.recordCard}>
                <View style={styles.recordHeader}>
                  {/* 제목 정사각형 */}
                  <View style={styles.recordSquare}>
                    <Text style={styles.recordSquareText}>
                      {record.muscles?.map((muscle) => muscle.name).join(', ') || '기록 없음'}
                    </Text>
                  </View>

                  {/* 시간과 세트 수 */}
                  <View style={styles.recordRightSection}>
                    <View style={styles.timeAndSetsWrapper}>
                      <View style={styles.recordTimeWrapper}>
                        <Icon name="time-outline" size={16} color="#555" />
                        <Text style={styles.recordTime}>{record.totalTime || '00:00'}</Text>
                      </View>
                      <Text style={styles.recordSets}>
                        총 세트 수: {record.totalSets || 0}
                      </Text>
                    </View>

                    {/* 상세보기 버튼 */}
                    <TouchableOpacity onPress={() => toggleModal(record)} style={styles.chevronButton}>
                      <Icon name="chevron-down-outline" size={20} color="#555" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noRecordText}>운동 기록이 없습니다</Text>
          )}
        </View>
      </ScrollView>

      {/* 상세보기 모달 */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => toggleModal(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedRecord?.muscles?.map((muscle) => muscle.name).join(', ') || '운동 기록'} 상세보기
            </Text>
            <ScrollView>
              <Text style={styles.modalSubtitle}>총 시간: {selectedRecord?.totalTime || '00:00'}</Text>
              <Text style={styles.modalSubtitle}>
                총 세트 수: {selectedRecord?.totalSets || 0}
              </Text>
              {selectedRecord?.exercises?.map((exercise, index) => (
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
                {selectedRecord?.memo || '메모가 없습니다.'}
              </Text>
            </ScrollView>
            <TouchableOpacity onPress={() => toggleModal(null)} style={styles.closeButton}>
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
