import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import dayjs from 'dayjs';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';
import styles from '../styles/MainStyles';
import { ProgressBar } from '@react-native-community/progress-bar-android';
import { useSelector, useDispatch }from 'react-redux';
import { setSelectedDate } from '../store';

const MainScreen = ({ navigation }) => {
  const selectedDate = useSelector((state) => state.date.selectedDate);
  const dispatch = useDispatch(); // Redux 액션 호출
  const [weekDays, setWeekDays] = useState([]);

  useEffect(() => {
    generateWeekDays(selectedDate);
  }, [selectedDate]);

  const generateWeekDays = (centerDate) => {
    const currentDate = dayjs(centerDate);
    const days = [];
    for (let i = -3; i <= 3; i++) {
      const date = currentDate.add(i, 'day');
      days.push({
        key: i,
        formatted: date.format('D일'),
        day: date.format('ddd'),
        fullDate: date.format('YYYY-MM-DD'),
      });
    }
    setWeekDays(days);
  };

  const handleGesture = (event) => {
    const { translationX } = event.nativeEvent;
  
    if (Math.abs(translationX) > 50) {
      const daysToMove = Math.sign(translationX); // 양수: 오른쪽, 음수: 왼쪽
      const newCenterDate = dayjs(selectedDate).add(-daysToMove, 'day').format('YYYY-MM-DD');
      dispatch(setSelectedDate(newCenterDate)); // Redux 상태 업데이트
    }
  };

  // 날짜를 눌렀을 때 redux상태 업데이트
  const handleDatePress = (date) => {
    dispatch(setSelectedDate(date)); 
  };

  const changeMonth = (direction) => {
    const newDate = dayjs(selectedDate).add(direction, 'month').startOf('month').format('YYYY-MM-DD');
    dispatch(setSelectedDate(newDate)); // Redux 상태 업데이트
  };
  
  return (
    <View style={styles.mainContainer}>
      <Navbar />

      {/* 드래그 가능한 달력 */}
      <PanGestureHandler onGestureEvent={handleGesture}>
        <View style={styles.calendarContainer}>
          <View style={styles.dateContainer}>
            <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.arrowButton}>
              <Ionicons name="chevron-back-outline" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.dateText}>{dayjs(selectedDate).format('M월')}</Text>
            <TouchableOpacity onPress={() => changeMonth(1)} style={styles.arrowButton}>
              <Ionicons name="chevron-forward-outline" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.weekContainer}>
            {weekDays.map((day, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dateBox,
                  day.fullDate === selectedDate && styles.selectedDateBox,
                ]}
                onPress={() => handleDatePress(day.fullDate)}
              >
                <Text
                  style={[
                    styles.dateNumber,
                    day.fullDate === selectedDate && styles.selectedDateNumber,
                  ]}
                >
                  {day.formatted}
                </Text>
                <Text style={styles.selectedDay}>{day.day}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </PanGestureHandler>

      {/* 콘텐츠 영역 */}
      <View style={styles.contentContainer}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* 오늘의 섭취량 */}
          <View style={styles.summaryBox}>
            <Text style={styles.title}>오늘의 총 섭취량</Text>
            <View style={styles.calorieRow}>
              <Text style={styles.subTitle}>총 칼로리</Text>
              <ProgressBar styleAttr="Horizontal" indeterminate={false} progress={0.87} />
              <Text style={styles.calorieText}>1822/2100 Kcal</Text>
            </View>
            <View style={styles.macroRow}>
              <View style={styles.macroItem}>
                <Text style={styles.macroTitle}>탄수화물</Text>
                <ProgressBar styleAttr="Horizontal" indeterminate={false} progress={0.56} />
                <Text style={styles.macroText}>675/1200g</Text>
              </View>
              <View style={styles.macroItem}>
                <Text style={styles.macroTitle}>단백질</Text>
                <ProgressBar styleAttr="Horizontal" indeterminate={false} progress={0.35} />
                <Text style={styles.macroText}>80/225g</Text>
              </View>
              <View style={styles.macroItem}>
                <Text style={styles.macroTitle}>지방</Text>
                <ProgressBar styleAttr="Horizontal" indeterminate={false} progress={0.25} />
                <Text style={styles.macroText}>20/80g</Text>
              </View>
            </View>
            <Text style={styles.goalMessage}>오늘 목표 섭취량에 미달하였습니다.</Text>
          </View>

          {/* 식단 섹션 */}
          <View style={styles.summaryBox}>
            <Text style={styles.title}>식단</Text>
            <Text style={styles.goalText}>내 목표: 벌크업 하기</Text>
            <View style={styles.gridContainer}>
              {['아침', '점심', '저녁', '간식'].map((meal, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.gridItem}
                  onPress={() => navigation.navigate('MealSetting', { mealType: meal, selectedDate })}
                >
                  <Ionicons name="add-outline" size={30} color="#008080" />
                  <Text style={styles.gridItemText}>{meal}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
      <Footer/> 
    </View>
  );
};

export default MainScreen;
