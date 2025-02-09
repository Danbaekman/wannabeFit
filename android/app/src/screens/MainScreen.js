import { View, Text, TouchableOpacity, ScrollView, Image, Alert, TextInput} from 'react-native';
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
  const [mealCalories, setMealCalories] = useState({
    breakfast: 0,
    lunch: 0,
    dinner: 0,
    snack: 0,
  });
  const goalTextMapping = {
    bulk: '벌크업',
    diet: '다이어트',
    maintain: '유지',
  };
  const goalText = goalTextMapping[userGoal.goal] || '목표 없음';
  const [userWeight, setUserWeight] = useState(null); // 서버에서 가져온 실제 몸무게
  const [tempWeight, setTempWeight] = useState(null); // UI에서 조정 중인 임시 몸무게



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
        goal: user.goal,
        targetWeight: user.targetWeight,
      }); 
      setUserWeight(user.weight); // 사용자의 현재 체중 설정
      setTempWeight(user.weight);
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
  
      // 상태 업데이트
      setDailySummary(summary); // 전체 요약 업데이트
      setMealCalories({
        breakfast: summary.breakfast?.totalCalories || 0,
        lunch: summary.lunch?.totalCalories || 0,
        dinner: summary.dinner?.totalCalories || 0,
        snack: summary.snack?.totalCalories || 0,
      });
    } catch (error) {
      console.error('Error fetching daily summary:', error.message);
    }
  };


  // 날짜별 몸무게 추가
  const fetchWeights = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        console.error('No JWT token found. Please log in.');
        return;
      }
  
      const response = await fetch(`${CONFIG.API_BASE_URL}/weight?date=${selectedDate}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const weightData = await response.json();
  
      if (weightData) {
        setTempWeight(weightData.weight); // 수정된 체중 값 설정
      } else {
        setTempWeight(userWeight); // 수정된 값이 없으면 초기값 사용
      }
    } catch (error) {
      console.error('Error fetching weights:', error.message);
    }
  };
  
  useEffect(() => {
    fetchWeights();
  }, [selectedDate]);
  
  const saveWeight = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        Alert.alert('오류', '로그인이 필요합니다.');
        return;
      }
  
      const response = await fetch(`${CONFIG.API_BASE_URL}/weight/weight-update`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          weight: tempWeight,
          date: selectedDate,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      Alert.alert('Wannabefit', `해당 날짜 ${selectedDate} 에 체중 ${tempWeight}kg 로 저장되었습니다.`);
      setUserWeight(tempWeight);
    } catch (error) {
      console.error('Error saving weight:', error.message);
      Alert.alert('오류', '체중을 저장하는 데 실패했습니다.');
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
            <Text style={styles.sectionTitle}>오늘의 총 섭취량</Text>
            <View style={styles.summaryBox}>
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
      {`${Math.round(dailySummary.totalCalories)} / `}
      <Text style={styles.calorieGoalText}>{`${Math.round(userGoal.calorieGoal)} Kcal`}</Text>
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
            ? '#b119bf'
            : '#008080'
        }
      />
      <Text style={styles.macroText}>
        {`${Math.round(dailySummary.totalCarbohydrates)} / `}
        <Text style={styles.calorieGoalText}>{`${Math.round(userGoal.carbGoal)}g`}</Text>
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
        {`${Math.round(dailySummary.totalProtein)} / `}
        <Text style={styles.calorieGoalText}>{`${Math.round(userGoal.proteinGoal)}g`}</Text>
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
        {`${Math.round(dailySummary.totalFat)} / `}
        <Text style={styles.calorieGoalText}>{`${Math.round(userGoal.fatGoal)}g`}</Text>
      </Text>
    </View>
  </View>
</View>


            {/* 식단 */}
            <Text style={styles.sectionTitle}>식단</Text>
            <View style={styles.summaryBox}>
            <Text style={styles.goalContainer}>
              <Text style={styles.goalPrefix}>내 목표: </Text>
              <Text style={styles.goalText}>{goalText}</Text>
            </Text>


              <View style={styles.gridContainer}>
                {[['아침', '점심'], ['저녁', '간식']].map((row, rowIndex) => (
                  <View key={rowIndex} style={styles.gridRow}>
                    {row.map((meal, index) => {
                      const mealType = ['breakfast', 'lunch', 'dinner', 'snack'][rowIndex * 2 + index];

                      return (
                        <TouchableOpacity
                          key={index}
                          style={styles.gridItem}
                          onPress={() => navigation.navigate('MealSetting', { mealType: meal, selectedDate })}
                        >
                          {/* 우측 상단 칼로리 표시 */}
                          <Text style={styles.mealCalories}>
                            {Math.round(mealCalories[mealType] || 0)}
                            <Text style={styles.kcalText}> kcal</Text>
                          </Text>


                          {/* 중앙 아이콘 */}
                          <View style={styles.plusIcon}>
                            <Ionicons name="add-outline" size={50} color="#008080" />
                          </View>

                          {/* 하단 텍스트 */}
                          <Text style={styles.gridItemText}>{meal}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ))}
              </View>
            </View>
            <Text style={styles.sectionTitle}>체중</Text>
            <View style={styles.summaryBox}>
 
  {/* 목표 체중 텍스트 */}
  {/* 목표 체중 텍스트 및 기록하기 버튼 */}
  <View style={styles.goalRow}>
    <Text style={styles.weightGoalText}>
      <Text style={styles.goalPrefix}>내 목표: </Text>
      <Text style={styles.goalText}>{userGoal.targetWeight || 0}kg</Text>
    </Text>
    <TouchableOpacity
      style={styles.recordButton}
      onPress={saveWeight} // 기록하기 함수 호출
      disabled={tempWeight === null}
    >
      <Ionicons name="refresh-outline" size={16} color="#008080" />
      <Text style={styles.recordButtonText}>기록하기</Text>
    </TouchableOpacity>
  </View>


{/* 체중계 디자인 */}
<View style={styles.weightInputContainer}>
  <View style={styles.scaleBox}>
    <View style={styles.inputBoxContainer}>
      {/* - 버튼 */}
      <TouchableOpacity
        style={styles.adjustButton}
        onPress={() => {
          if (tempWeight !== null) {
            setTempWeight(Math.max(0, tempWeight - 1));
          } else if (userWeight !== null) {
            setTempWeight(Math.max(0, userWeight - 1));
          }
        }}
      >
        <Ionicons name="remove-outline" size={20} color="#FFF" />
      </TouchableOpacity>

      {/* 체중 입력란 */}
      <View style={styles.inputBox}>
        <TextInput
          style={styles.inputText}
          value={tempWeight !== null ? String(tempWeight) : userWeight !== null ? String(userWeight) : ''}
          onChangeText={(text) => {
            const weight = parseFloat(text);
            if (!isNaN(weight)) {
              setTempWeight(weight);
            }
          }}
          keyboardType="numeric" // 숫자 전용 키보드
          maxLength={3} // 최대 5자리 (예: 999.99)
          placeholder="0"
          placeholderTextColor="#AAA"
        />
        <Text style={styles.kgText}>kg</Text>
      </View>

      {/* + 버튼 */}
      <TouchableOpacity
        style={styles.adjustButton}
        onPress={() => {
          if (tempWeight !== null) {
            setTempWeight(tempWeight + 1);
          } else if (userWeight !== null) {
            setTempWeight(userWeight + 1);
          }
        }}
      >
        <Ionicons name="add-outline" size={20} color="#FFF" />
      </TouchableOpacity>
    </View>

    {/* 양발 아이콘 */}
    <Image
      source={require('../../assets/images/foot.png')}
      style={[styles.footImage, { tintColor: '#ccc' }]}
    />
  </View>
</View>
</View>

          </ScrollView>
        </View>
      <Footer />
    </View>
  );
};

export default MainScreen;