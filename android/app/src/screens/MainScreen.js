// src/screens/MainScreen.js
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { ProgressBar } from '@react-native-community/progress-bar-android'; // 경로 변경
import styles from '../styles/MainStyles';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';
import { Calendar } from 'react-native-calendars'; // 달력 컴포넌트 추가
import dayjs from 'dayjs';

const MainScreen = () => {
  const [isCalendarVisible, setCalendarVisible] = useState(false); // 달력의 펼침 상태 관리
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // 현재 날짜를 기본값으로 설정

  const toggleCalendar = () => {
    setCalendarVisible(!isCalendarVisible);
  };

  return (
    <View style={{ flex: 1 }}>
      <Navbar />

      <ScrollView style={styles.container}>
        {/* 달력 토글 버튼 */}
        <TouchableOpacity onPress={toggleCalendar} style={styles.dateButton}>
          <Text style={styles.dateButtonText}>
            {dayjs(selectedDate).format('M월 D일 (ddd)')}
          </Text>
        </TouchableOpacity>

        {/* 달력 */}
        {isCalendarVisible && (
          <View style={styles.calendarContainer}>
            <Calendar
              current={selectedDate}
              onDayPress={(day) => {
                setSelectedDate(day.dateString);
              }}
              markedDates={{
                [selectedDate]: { selected: true, selectedColor: '#008080' },
              }}
              theme={{
                todayTextColor: '#008080',
              }}
            />
          </View>
        )}

        {/* 오늘의 섭취 영양성분 */}
        <Text style={styles.nutritionTitle}>오늘의 섭취 영양성분</Text>
        <View style={styles.nutritionContainer}>
          {/* 섭취칼로리 */}
          <View style={styles.gaugeContainer}>
            <Text>칼로리: 1200 kcal</Text>
            <ProgressBar styleAttr="Horizontal" indeterminate={false} progress={0.6} />
          </View>

          {/* 단백질 */}
          <View style={styles.gaugeContainer}>
            <Text>단백질: 80g</Text>
            <ProgressBar styleAttr="Horizontal" indeterminate={false} progress={0.5} />
          </View>

          {/* 지방 */}
          <View style={styles.gaugeContainer}>
            <Text>지방: 40g</Text>
            <ProgressBar styleAttr="Horizontal" indeterminate={false} progress={0.3} />
          </View>

          {/* 나트륨 */}
          <View style={styles.gaugeContainer}>
            <Text>나트륨: 1000mg</Text>
            <ProgressBar styleAttr="Horizontal" indeterminate={false} progress={0.8} />
          </View>
        </View>

        {/* 목표 섭취량 메시지 */}
        <View style={styles.goalMessageContainer}>
          <Text>목표 섭취량에 미달하였습니다.</Text>
        </View>
      </ScrollView>

      <Footer />
    </View>
  );
};

export default MainScreen; // default export 사용
