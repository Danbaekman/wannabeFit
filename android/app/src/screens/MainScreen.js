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
import CONFIG from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';


const MainScreen = ({ navigation }) => {
  const selectedDate = useSelector((state) => state.date.selectedDate);
  const dispatch = useDispatch(); // Redux 액션 호출
  const [weekDays, setWeekDays] = useState([]);
  const [dailySummary, setDailySummary] = useState({
    totalCalories: 0,
    totalProtein: 0,
    totalFat: 0,
    totalCarbohydrates: 0,
  });
  const [userGoal, setUserGoal] = useState({
    calorieGoal: 2100, // 기본값
    carbGoal: 300, // 탄수화물 기본값
    proteinGoal: 150, // 단백질 기본값
    fatGoal: 50, // 지방 기본값
  });
  useEffect(() => {
    fetchUserGoal(); // 사용자 추천값 가져오기
  }, []);

  useEffect(() => {
    generateWeekDays(selectedDate);
    fetchDailySummary(selectedDate); // 선택된 날짜의 요약 데이터 가져오기
  }, [selectedDate]);

  // 화면이 포커스될 때마다 fetchDailySummary 호출
  useFocusEffect(
    React.useCallback(() => {
      fetchDailySummary(selectedDate); // 데이터를 새로고침
    }, [selectedDate])
  );

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

  const fetchUserGoal = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken'); // JWT 토큰 가져오기
      if (!token) {
        console.error('No JWT token found. Please log in.');
        return;
      }
  
      const response = await fetch(`${CONFIG.API_BASE_URL}/user`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`, // JWT 토큰 사용
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const user = await response.json();
      setUserGoal({
        calorieGoal: user.target_calories,
        carbGoal: user.recommended_carbs,
        proteinGoal: user.recommended_protein,
        fatGoal: user.recommended_fat,
      }); // 추천값 업데이트
    } catch (error) {
      console.error('Error fetching user goal:', error.message);
    }
  };
  

  const fetchDailySummary = async (date) => {
    try {
      const token = await AsyncStorage.getItem('jwtToken'); // 토큰 가져오기
      if (!token) {
        console.error('No JWT token found. Please log in.');
        return;
      }

      const response = await fetch(`${CONFIG.API_BASE_URL}/meal/meals-daily-summary?date=${date}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`, // JWT 토큰 사용
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const summary = await response.json();
      setDailySummary(summary); // 상태 업데이트
    } catch (error) {
      console.error('Error fetching daily summary:', error.message);
    }
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
  
  {/* 총 칼로리 */}
  <View style={styles.calorieRow}>
    <Text style={styles.subTitle}>총 칼로리</Text>
    <ProgressBar
      styleAttr="Horizontal"
      indeterminate={false}
      progress={dailySummary.totalCalories / userGoal.calorieGoal}
      color={
        dailySummary.totalCalories > userGoal.calorieGoal
          ? '#6603fc' // 초과하면 빨간색
          : '#008080' // 기본 색상
      }
    />
    <Text style={styles.calorieText}>
      {`${dailySummary.totalCalories.toFixed(1)} / ${userGoal.calorieGoal} Kcal`}
    </Text>
  </View>

  {/* 탄수화물 */}
  <View style={styles.macroRow}>
    <View style={styles.macroItem}>
      <Text style={styles.macroTitle}>탄수화물</Text>
      <ProgressBar
        styleAttr="Horizontal"
        indeterminate={false}
        progress={dailySummary.totalCarbohydrates / userGoal.carbGoal}
        color={
          dailySummary.totalCarbohydrates > userGoal.carbGoal
            ? '#6603fc'
            : '#008080'
        }
      />
      <Text style={styles.macroText}>
        {`${dailySummary.totalCarbohydrates.toFixed(1)} / ${userGoal.carbGoal}g`}
      </Text>
    </View>

    {/* 단백질 */}
    <View style={styles.macroItem}>
      <Text style={styles.macroTitle}>단백질</Text>
      <ProgressBar
        styleAttr="Horizontal"
        indeterminate={false}
        progress={dailySummary.totalProtein / userGoal.proteinGoal}
        color={
          dailySummary.totalProtein > userGoal.proteinGoal
            ? '#6603fc'
            : '#008080'
        }
      />
      <Text style={styles.macroText}>
        {`${dailySummary.totalProtein.toFixed(1)} / ${userGoal.proteinGoal}g`}
      </Text>
    </View>

    {/* 지방 */}
    <View style={styles.macroItem}>
      <Text style={styles.macroTitle}>지방</Text>
      <ProgressBar
        styleAttr="Horizontal"
        indeterminate={false}
        progress={dailySummary.totalFat / userGoal.fatGoal}
        color={
          dailySummary.totalFat > userGoal.fatGoal
            ? '#6603fc'
            : '#008080'
        }
      />
      <Text style={styles.macroText}>
        {`${dailySummary.totalFat.toFixed(1)} / ${userGoal.fatGoal}g`}
      </Text>
    </View>
  </View>
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
      <Footer />
    </View>
  );
};

export default MainScreen;