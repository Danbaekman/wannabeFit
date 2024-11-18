import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { ProgressBar } from '@react-native-community/progress-bar-android';
import styles from '../styles/MainStyles';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';
import { Calendar } from 'react-native-calendars';
import dayjs from 'dayjs';
import Ionicons from 'react-native-vector-icons/Ionicons';

const MainScreen = ({ navigation }) => {
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const handlePrevDay = () => {
    const prevDate = dayjs(selectedDate).subtract(1, 'day').format('YYYY-MM-DD');
    setSelectedDate(prevDate);
  };

  const handleNextDay = () => {
    const nextDate = dayjs(selectedDate).add(1, 'day').format('YYYY-MM-DD');
    setSelectedDate(nextDate);
  };

  const toggleCalendar = () => {
    setCalendarVisible(!isCalendarVisible);
  };

  return (
    <View style={{ flex: 1 }}>
      <Navbar />

      <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
        {/* 달력 토글 버튼 */}
        <View style={styles.dateToggleContainer}>
          <TouchableOpacity onPress={handlePrevDay} style={styles.navButton}>
            <Text style={styles.navButtonText}>{'<'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleCalendar} style={styles.dateButtonFullWidth}>
            <Text style={styles.dateButtonText}>
              {dayjs(selectedDate).format('M월 D일 (ddd)')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleNextDay} style={styles.navButton}>
            <Text style={styles.navButtonText}>{'>'}</Text>
          </TouchableOpacity>
        </View>

        {/* 오늘의 섭취 영양성분 */}
        <Text style={styles.nutritionTitle}>오늘의 섭취 영양성분</Text>
        <View style={styles.nutritionContainer}>
          <View style={styles.gaugeContainer}>
            <Text style={styles.subTitle}>총 칼로리</Text>
            <ProgressBar styleAttr="Horizontal" indeterminate={false} progress={0.83} />
            <Text style={styles.nutrientText}>1322/1600kcal</Text>
          </View>

          <Text style={styles.subTitle}>탄/단/지 비율</Text>
          <View style={styles.nutrientRow}>
            <View style={styles.nutrientColumn}>
              <Text style={styles.nutrientText}>탄수화물</Text>
              <ProgressBar styleAttr="Horizontal" indeterminate={false} progress={0.09} style={[styles.progressBar, { width: '90%' }]} />
              <Text style={styles.nutrientText}>20g/225g</Text>
            </View>

            <View style={styles.nutrientColumn}>
              <Text style={styles.nutrientText}>단백질</Text>
              <ProgressBar styleAttr="Horizontal" indeterminate={false} progress={0.25} style={[styles.progressBar, { width: '70%' }]} />
              <Text style={styles.nutrientText}>40g/160g</Text>
            </View>

            <View style={styles.nutrientColumn}>
              <Text style={styles.nutrientText}>지방</Text>
              <ProgressBar styleAttr="Horizontal" indeterminate={false} progress={0.64} style={[styles.progressBar, { width: '50%' }]} />
              <Text style={styles.nutrientText}>43g/67g</Text>
            </View>
          </View>
        </View>

        {/* 목표 섭취량 메시지 */}
        <View style={styles.goalMessageContainer}>
          <Text>
            목표 섭취량에{' '}
            <Text style={{ fontWeight: 'bold', color: 'black' }}>미달</Text>
            하였습니다.
          </Text>
        </View>

        {/* 큰 제목 */}
        <Text style={styles.nutritionTitle}>식단</Text>

        {/* 식단 박스 - 2행 2열 */}
        <View style={styles.mealPlanGrid}>
          {/* 아침 */}
          <TouchableOpacity
            style={styles.mealBox}
            onPress={() => navigation.navigate('MealSetting', { mealType: 'breakfast' })}
          >
            <Ionicons name="cafe-outline" size={40} color="#FFA500" />
            <Text style={styles.mealText}>아침</Text>
          </TouchableOpacity>

          {/* 점심 */}
          <TouchableOpacity
            style={styles.mealBox}
            onPress={() => navigation.navigate('MealSetting', { mealType: 'lunch' })}
          >
            <Ionicons name="fast-food-outline" size={40} color="#32CD32" />
            <Text style={styles.mealText}>점심</Text>
          </TouchableOpacity>

          {/* 저녁 */}
          <TouchableOpacity
            style={styles.mealBox}
            onPress={() => navigation.navigate('MealSetting', { mealType: 'dinner' })}
          >
            <Ionicons name="restaurant-outline" size={40} color="#4682B4" />
            <Text style={styles.mealText}>저녁</Text>
          </TouchableOpacity>

          {/* 간식 */}
          <TouchableOpacity
            style={styles.mealBox}
            onPress={() => navigation.navigate('MealSetting', { mealType: 'snack' })}
          >
            <Ionicons name="ice-cream-outline" size={40} color="#DAA520" />
            <Text style={styles.mealText}>간식</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Footer />
    </View>
  );
};

export default MainScreen;
