import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { ProgressBar } from '@react-native-community/progress-bar-android';
import styles from '../styles/MainStyles';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import dayjs from 'dayjs';

const MainScreen = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const handlePrevWeek = () => {
    const prevDate = dayjs(selectedDate).subtract(7, 'day').format('YYYY-MM-DD');
    setSelectedDate(prevDate);
  };

  const handleNextWeek = () => {
    const nextDate = dayjs(selectedDate).add(7, 'day').format('YYYY-MM-DD');
    setSelectedDate(nextDate);
  };

  const renderWeekDays = () => {
    const currentDate = dayjs(selectedDate);
    const weekDays = [];
    for (let i = -3; i <= 3; i++) {
      const date = currentDate.add(i, 'day');
      weekDays.push(
        <Text
          key={i}
          style={[
            styles.dateNumber,
            i === 0 && styles.selectedDate, // 선택된 날짜 스타일 적용
          ]}
        >
          {i === 0 ? `${date.format('D일 (ddd)')}` : date.format('D')}
        </Text>
      );
    }
    return weekDays;
  };

  return (
    <View style={styles.mainContainer}>
      <Navbar />

      {/* 달력 부분 */}
      <View style={styles.calendarContainer}>
        <View style={styles.dateContainer}>
          <TouchableOpacity onPress={handlePrevWeek} style={styles.arrowButton}>
            <Ionicons name="chevron-back-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.dateText}>{dayjs(selectedDate).format('M월')}</Text>
          <TouchableOpacity onPress={handleNextWeek} style={styles.arrowButton}>
            <Ionicons name="chevron-forward-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.weekContainer}>{renderWeekDays()}</View>
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
