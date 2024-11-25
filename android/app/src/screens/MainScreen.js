import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import React, { useState, useRef } from 'react';
import { ProgressBar } from '@react-native-community/progress-bar-android';
import styles from '../styles/MainStyles';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import dayjs from 'dayjs';

const MainScreen = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const scrollRef = useRef(null);

  const SCREEN_WIDTH = Dimensions.get('window').width;
  const ITEM_WIDTH = SCREEN_WIDTH / 7; // 화면 너비를 7등분하여 날짜 크기 설정

  // 주간 날짜 데이터 생성
  const renderWeekDays = () => {
    const currentDate = dayjs(selectedDate);
    const weekDays = [];
    for (let i = -30; i <= 30; i++) {
      const date = currentDate.add(i, 'day');
      weekDays.push({
        key: i,
        formatted: date.format('D일'),
        day: date.format('ddd'), // 요일 추가
        fullDate: date.format('YYYY-MM-DD'),
      });
    }
    return weekDays;
  };

  const weekDays = renderWeekDays();

  // 스크롤 종료 시 중앙 강조 날짜 업데이트
  const handleScrollEnd = (event) => {
    const { contentOffset } = event.nativeEvent;
  
    // 중앙 인덱스 계산
    const index = Math.round(contentOffset.x / ITEM_WIDTH);
  
    if (index >= 0 && index < weekDays.length) {
      const newDate = weekDays[index]?.fullDate;
  
      if (newDate) {
        setSelectedDate(newDate); // 선택된 날짜 업데이트
      }
    }
  };
  
  const handleDatePress = (date) => {
    const index = weekDays.findIndex((day) => day.fullDate === date);
  
    if (index !== -1 && scrollRef.current) {
      const scrollPosition = index * ITEM_WIDTH;
      scrollRef.current.scrollTo({ x: scrollPosition, animated: true });
      setSelectedDate(date); // 선택된 날짜 업데이트
    }
  };
  
  React.useEffect(() => {
    const index = weekDays.findIndex((day) => day.fullDate === selectedDate);
  
    if (index !== -1 && scrollRef.current) {
      const scrollPosition = index * ITEM_WIDTH;
      scrollRef.current.scrollTo({ x: scrollPosition, animated: false });
    }
  }, [selectedDate]);
  
  return (
    <View style={styles.mainContainer}>
      <Navbar />

      {/* 달력 부분 */}
      <View style={styles.calendarContainer}>
        <View style={styles.dateContainer}>
          <TouchableOpacity onPress={() => handleMonthChange(-1)} style={styles.arrowButton}>
            <Ionicons name="chevron-back-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.dateText}>{dayjs(selectedDate).format('M월')}</Text>
          <TouchableOpacity onPress={() => handleMonthChange(1)} style={styles.arrowButton}>
            <Ionicons name="chevron-forward-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* 중앙 고정된 강조 박스 */}
        <View style={styles.centerHighlightBox}>
          <Text style={styles.highlightedDate}>
            {dayjs(selectedDate).format('D일 (ddd)')}
          </Text>
        </View>

        <ScrollView
  horizontal
  ref={scrollRef}
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={styles.weekScroll}
  onMomentumScrollEnd={handleScrollEnd} // 스크롤 종료 시 호출
>
  {weekDays.map((day, index) => (
    <TouchableOpacity
      key={index}
      style={styles.dateBox}
      onPress={() => handleDatePress(day.fullDate)} // 날짜 클릭 시 호출
    >
      <Text
        style={[
          styles.dateNumber,
          day.fullDate === selectedDate && styles.selectedDateNumber, // 강조 스타일
        ]}
      >
        {day.formatted}
      </Text>
    </TouchableOpacity>
  ))}
</ScrollView>

      </View>

      {/* 둥근 모서리가 적용된 컨텐츠 박스 */}
      <View style={styles.contentContainer}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* 섭취 영양 성분 */}
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

          {/* 식단 */}
          <View style={styles.summaryBox}>
            <Text style={styles.title}>식단</Text>
            <Text style={styles.goalText}>내 목표: 벌크업 하기</Text>
            <View style={styles.gridContainer}>
              {['아침', '점심', '저녁', '간식'].map((meal, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.gridItem}
                  onPress={() => navigation.navigate('MealSetting', { mealType: meal })}
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
