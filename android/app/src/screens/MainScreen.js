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
  const ITEM_WIDTH = 60; // 날짜 박스의 너비
  const SIDE_PADDING = (SCREEN_WIDTH - ITEM_WIDTH) / 2; // 강조된 날짜를 중앙에 고정시키기 위한 좌우 여백

  const renderWeekDays = () => {
    const currentDate = dayjs(selectedDate);
    const weekDays = [];
    for (let i = -14; i <= 14; i++) {
      const date = currentDate.add(i, 'day');
      weekDays.push({
        key: i,
        formatted: date.format('D일'),
        day: date.format('D일 (ddd)'),
        fullDate: date.format('YYYY-MM-DD'),
      });
    }
    return weekDays;
  };

  const weekDays = renderWeekDays();

  const handleScrollEnd = (event) => {
    const { contentOffset } = event.nativeEvent;
    const index = Math.round((contentOffset.x - SIDE_PADDING) / ITEM_WIDTH); // 중앙 강조 위치 인덱스 계산
    const newDate = weekDays[index]?.fullDate;

    if (newDate) {
      setSelectedDate(newDate);
    }
  };

  const handleMonthChange = (direction) => {
    const newDate = dayjs(selectedDate).add(direction, 'month').format('YYYY-MM-DD');
    setSelectedDate(newDate);

    // 새 월에 맞춰 스크롤뷰 중앙 날짜로 이동
    const index = weekDays.findIndex((day) => day.fullDate === newDate);
    if (index !== -1 && scrollRef.current) {
      const scrollPosition = index * ITEM_WIDTH - SCREEN_WIDTH / 2 + ITEM_WIDTH / 2;
      scrollRef.current.scrollTo({ x: scrollPosition, animated: true });
    }
  };

  React.useEffect(() => {
    // 초기 로딩 시 중앙으로 스크롤
    const index = weekDays.findIndex((day) => day.fullDate === selectedDate);
    if (index !== -1 && scrollRef.current) {
      const scrollPosition = index * ITEM_WIDTH - SIDE_PADDING;
      scrollRef.current.scrollTo({ x: scrollPosition, animated: false });
    }
  }, []);

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
        <ScrollView
          horizontal
          ref={scrollRef}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.weekScroll,
            { paddingHorizontal: SIDE_PADDING }, // 좌우 여백 추가
          ]}
          onMomentumScrollEnd={handleScrollEnd} // 스크롤이 끝났을 때 호출
        >
          {weekDays.map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dateBox,
                day.fullDate === selectedDate && styles.selectedDateBox,
              ]}
              onPress={() => setSelectedDate(day.fullDate)}
            >
              <Text
                style={[
                  styles.dateNumber,
                  day.fullDate === selectedDate && styles.selectedDateNumber,
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
