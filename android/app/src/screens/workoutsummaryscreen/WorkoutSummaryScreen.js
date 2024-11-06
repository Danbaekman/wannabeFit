import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';
import styles from './WorkoutSummaryScreenStyles';
import Icon from 'react-native-vector-icons/Ionicons';

const WorkoutSummaryScreen = ({ route, navigation }) => {
  const { date, routineName, memo, totalTime, exercises = [], volumeChanges = [] } = route.params || {};

  // 요일과 날짜를 추출 (예시용으로 임의로 지정)
  const dayOfWeek = '월요일'; // 실제 요일 계산이 필요하다면 Date 객체와 함수를 사용할 수 있음
  const formattedDate = date || '10월 23일';

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

            {memo ? (
              <Text style={styles.memoText}>{memo}</Text>
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
