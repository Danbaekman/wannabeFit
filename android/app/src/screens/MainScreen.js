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

  const handlePrevDay = () => {
    const prevDate = dayjs(selectedDate).subtract(1, 'day').format('YYYY-MM-DD');
    setSelectedDate(prevDate);
  };

  const handleNextDay = () => {
    const nextDate = dayjs(selectedDate).add(1, 'day').format('YYYY-MM-DD');
    setSelectedDate(nextDate);
  };

  return (
    <View style={styles.mainContainer}>
      <Navbar />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 날짜 */}
        <View style={styles.dateContainer}>
          <TouchableOpacity onPress={handlePrevDay} style={styles.arrowButton}>
            <Ionicons name="chevron-back-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.dateText}>{dayjs(selectedDate).format('M월 D일 (ddd)')}</Text>
          <TouchableOpacity onPress={handleNextDay} style={styles.arrowButton}>
            <Ionicons name="chevron-forward-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

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
        <Text style={styles.title}>식단</Text>
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

        {/* 운동 */}
        <View style={styles.exerciseContainer}>
          <Text style={styles.exerciseText}>
            <Text style={styles.bold}>총 시간: 55분</Text>
            {'  '}
            내 훈련에 들어가서 기록하고 성장해보아요.
          </Text>
        </View>

        {/* 통계 */}
        <TouchableOpacity style={styles.statsBox} onPress={() => navigation.navigate('Statistics')}>
          <Ionicons name="stats-chart-outline" size={30} color="#008080" />
          <Text style={styles.statsText}>통계로 확인하기</Text>
        </TouchableOpacity>
      </ScrollView>

      <Footer />
    </View>
  );
};

export default MainScreen;
