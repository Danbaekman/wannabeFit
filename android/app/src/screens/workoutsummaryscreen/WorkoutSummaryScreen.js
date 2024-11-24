import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';
import styles from './WorkoutSummaryScreenStyles';
import Icon from 'react-native-vector-icons/Ionicons';

const WorkoutSummaryScreen = ({ route, navigation }) => {
  const {
    routineName,
    generalMemo, // 수정된 부분: route.params.generalMemo로 참조
    startTime,
    endTime,
    exercises = [],
    volumeChanges = [],
  } = route.params || {};

  // 현재 날짜와 요일 계산
  const getCurrentDateInfo = () => {
    const daysOfWeek = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    const date = new Date();
    const dayOfWeek = daysOfWeek[date.getDay()];
    const formattedDate = `${date.getMonth() + 1}월 ${date.getDate()}일`;
    return { dayOfWeek, formattedDate };
  };

  const { dayOfWeek, formattedDate } = getCurrentDateInfo();

  // 운동 시간 계산 함수
  const calculateTotalTime = (start, end) => {
    if (!start || !end) return '시간 정보 없음';
    const startDate = new Date(start);
    const endDate = new Date(end);

    const diffMs = endDate - startDate;
    if (diffMs < 0) return '종료 시간이 시작 시간보다 빠름';

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}시간 ${minutes}분`;
  };

  const totalTime = calculateTotalTime(startTime, endTime);

  return (
    <View style={{ flex: 1, backgroundColor: '#f0f0f0' }}>
      <Navbar />
      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        <Text style={styles.titleText}>기록</Text>

        {/* 날짜, 루틴 이름, 메모, 운동 세트 정보 */}
        <View style={styles.summaryBox}>
          <View style={styles.dateSquare}>
            <Text style={styles.dayText}>{dayOfWeek}</Text>
            <Text style={styles.squareDateText}>{formattedDate}</Text>
          </View>

          <View style={styles.summaryContent}>
            <Text style={styles.routineNameText}>{routineName}</Text>

            {/* 운동 목록 */}
            <View style={styles.exerciseListContainer}>
              {exercises.map((exercise, index) => (
                <View key={index} style={styles.exerciseItem}>
                  <Text style={styles.exerciseTitle}>{exercise.name}</Text>
                  {exercise.sets.map((set, setIndex) => (
                    <Text key={setIndex} style={styles.setDetails}>
                      세트 {setIndex + 1}: {set.weight}kg, {set.reps}회
                      {set.memo ? ` - ${set.memo}` : ''}
                    </Text>
                  ))}
                </View>
              ))}
            </View>

            {/* 전체 메모 렌더링 */}
            {generalMemo && generalMemo.trim() ? (
              <Text style={styles.memoText}>{generalMemo}</Text>
            ) : (
              <Text style={styles.noMemoText}>메모가 없습니다.</Text>
            )}
          </View>

          {/* Total Time - 우측 상단 배치 */}
          <View style={styles.totalTimeContainer}>
            <Icon name="time-outline" size={16} color="#333" />
            <Text style={styles.totalTimeText}>{totalTime}</Text>
          </View>
        </View>

        {/* 운동 볼륨 변화 */}
        <View style={styles.volumeChangesContainer}>
          {volumeChanges.length > 0 ? (
            volumeChanges.map((change, index) => (
              <View key={index} style={styles.volumeChangeBox}>
                <Text style={styles.volumeChangeText}>{change}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noVolumeChangeText}>운동 볼륨 변화가 없습니다.</Text>
          )}
        </View>
      </ScrollView>
      <Footer navigation={navigation} />
    </View>
  );
};

export default WorkoutSummaryScreen;
