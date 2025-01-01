import React, { useState, useEffect } from 'react';
import { View, Text, Alert, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import Navbar from '../../../components/navbar/Navbar';
import TabNavigation from '../../../components/tabnavigation/TabNavigation';
import ContentWrapper from '../../../components/contentwrapper/ContentWrapper';
import styles from './MealStatsScreenStyles';
import CONFIG from '../../../config';

const MealStatsScreen = ({ navigation }) => {
  const screenWidth = Dimensions.get('window').width;

  // State 관리
  const [weeklyCalories, setWeeklyCalories] = useState([]);
  const [nutrientDistribution, setNutrientDistribution] = useState({});
  const [goalComparison, setGoalComparison] = useState({});
  const [selectedGoal, setSelectedGoal] = useState('다이어트'); // 사용자 목표

  // 총 칼로리 섭취량 API 호출
  const fetchWeeklyCalories = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        Alert.alert('Error', '로그인이 필요합니다.');
        navigation.navigate('Login');
        return;
      }

      const response = await fetch(`${CONFIG.API_BASE_URL}/calories/total?period=week`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setWeeklyCalories(data.totalCalories || []);
      } else {
        throw new Error('Failed to fetch weekly calories.');
      }
    } catch (error) {
      console.error('Error fetching weekly calories:', error.message);
      Alert.alert('Error', '주간 칼로리 데이터를 가져오는 데 실패했습니다.');
    }
  };

  // 영양소 비율 API 호출
  const fetchNutrientDistribution = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        Alert.alert('Error', '로그인이 필요합니다.');
        navigation.navigate('Login');
        return;
      }

      const response = await fetch(`${CONFIG.API_BASE_URL}/nutrition/distribution?period=week`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNutrientDistribution(data);
      } else {
        throw new Error('Failed to fetch nutrient distribution.');
      }
    } catch (error) {
      console.error('Error fetching nutrient distribution:', error.message);
      Alert.alert('Error', '영양소 비율 데이터를 가져오는 데 실패했습니다.');
    }
  };

  // 목표 대비 섭취량 비교 API 호출
  const fetchGoalComparison = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        Alert.alert('Error', '로그인이 필요합니다.');
        navigation.navigate('Login');
        return;
      }

      const response = await fetch(`${CONFIG.API_BASE_URL}/nutrition/goal-comparison?period=week`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setGoalComparison(data);
      } else {
        throw new Error('Failed to fetch goal comparison.');
      }
    } catch (error) {
      console.error('Error fetching goal comparison:', error.message);
      Alert.alert('Error', '목표 대비 데이터를 가져오는 데 실패했습니다.');
    }
  };

  useEffect(() => {
    fetchWeeklyCalories();
    fetchNutrientDistribution();
    fetchGoalComparison();
  }, []);

  return (
    <View style={styles.container}>
      <Navbar />
      <TabNavigation activeTab="식단" onTabPress={(tab) => console.log('탭 선택:', tab)} />
      <ContentWrapper>
        {/* 총 칼로리 섭취량 */}
        <Text style={styles.sectionTitle}>총 칼로리 섭취량</Text>
        <View style={styles.chartContainer}>
          <ScrollView horizontal>
            <BarChart
              data={{
                labels: ['5일', '6일', '7일', '8일', '9일', '10일', '11일'],
                datasets: [{ data: weeklyCalories }],
              }}
              width={screenWidth}
              height={220}
              fromZero
              chartConfig={{
                backgroundColor: '#fff',
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                color: (opacity = 1) => `rgba(26, 188, 156, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              style={styles.barChart}
            />
          </ScrollView>
        </View>

        {/* 영양소 비율 */}
        <Text style={styles.sectionTitle}>영양소 비율</Text>
        <View style={styles.chartContainer}>
          <PieChart
            data={[
              { name: '탄수화물', percentage: parseFloat(nutrientDistribution.carbs), color: '#f39c12', legendFontColor: '#333', legendFontSize: 15 },
              { name: '단백질', percentage: parseFloat(nutrientDistribution.protein), color: '#2ecc71', legendFontColor: '#333', legendFontSize: 15 },
              { name: '지방', percentage: parseFloat(nutrientDistribution.fat), color: '#e74c3c', legendFontColor: '#333', legendFontSize: 15 },
            ]}
            width={screenWidth}
            height={220}
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="percentage"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>

        {/* 목표 대비 섭취량 */}
        <Text style={styles.sectionTitle}>목표 대비 섭취량</Text>
        <View style={styles.goalComparisonContainer}>
          <Text style={styles.goalSubtitle}>내 목표: {selectedGoal}</Text>
          <Text style={styles.goalStatus}>
            {goalComparison.calorieComparison > 80
              ? '잘 수행 중이십니다!'
              : goalComparison.calorieComparison > 50
              ? '조금 미흡합니다'
              : '많이 미흡합니다'}
          </Text>
        </View>
      </ContentWrapper>
    </View>
  );
};

export default MealStatsScreen;
