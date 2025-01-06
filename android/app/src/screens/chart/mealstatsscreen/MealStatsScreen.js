import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Dimensions } from 'react-native';
import Svg, { Rect, Text as SvgText, Circle } from 'react-native-svg';
import Navbar from '../../../components/navbar/Navbar';
import TabNavigation from '../../../components/tabnavigation/TabNavigation';
import ContentWrapper from '../../../components/contentwrapper/ContentWrapper';
import styles from './MealStatsScreenStyles';

const MealStatsScreen = ({ navigation }) => {
  const screenWidth = Dimensions.get('window').width;

  // State 관리
  const [weeklyCalories, setWeeklyCalories] = useState([]);
  const [goalComparison, setGoalComparison] = useState([]);
  const [nutritionData, setNutritionData] = useState({});
  const [goalData, setGoalData] = useState({});
  const [selectedGoal, setSelectedGoal] = useState('다이어트'); // 사용자 목표
  const [daysToGoal, setDaysToGoal] = useState(null); // 목표까지 남은 일수

  // 하드코딩 데이터 설정
  useEffect(() => {
    const hardcodedWeeklyCalories = [1800, 2000, 2200, 1900, 2100, 2300, 2500];
    const hardcodedGoalComparison = [
      { day: '월', status: '만족' },
      { day: '화', status: '보통' },
      { day: '수', status: '미흡' },
      { day: '목', status: '만족' },
      { day: '금', status: '보통' },
      { day: '토', status: '만족' },
      { day: '일', status: '미흡' },
    ];
    const hardcodedGoalData = {
      carbs: 200,
      protein: 150,
      fat: 50,
      goalDays: 30, // 목표 달성까지 총 소요 예상 일수
    };
    const hardcodedNutritionData = {
      carbs: 174,
      protein: 140,
      fat: 40,
    };

    const daysElapsed = 15; // 현재까지 경과된 일수 (하드코딩 값)
    const daysLeft = hardcodedGoalData.goalDays - daysElapsed;
    setDaysToGoal(daysLeft);

    setWeeklyCalories(hardcodedWeeklyCalories);
    setGoalComparison(hardcodedGoalComparison);
    setGoalData(hardcodedGoalData);
    setNutritionData(hardcodedNutritionData);
  }, []);

  const handleTabPress = (tab) => {
    if (tab === '운동') {
      navigation.navigate('StaticsMain'); // 운동 통계 화면으로 이동
    } else if (tab === '체중') {
      navigation.navigate('WeightStats'); // 체중 통계 화면으로 이동
    } else if (tab === '식단') {
      navigation.navigate('MealStatsScreen'); // 현재 화면
    }
  };

  const calculatePercentage = (actual, target) => {
    const percentage = ((actual / target) * 100).toFixed(0);
    if (percentage >= 95) return { percentage, status: '과도' };
    if (percentage >= 85) return { percentage, status: '근접' };
    return { percentage, status: '미흡' };
  };

  const renderCustomBarChart = () => {
    const barWidth = (screenWidth - 40) / weeklyCalories.length;
    const maxHeight = 140;
    const boxPadding = 120;

    return (
      <Svg height={maxHeight + boxPadding} width={screenWidth}>
        {weeklyCalories.map((value, index) => {
          const barHeight = (value / 2500) * maxHeight;
          const x = index * barWidth + barWidth / 4;
          const y = maxHeight - barHeight + boxPadding / 2;

          return (
            <React.Fragment key={index}>
              {/* 막대 */}
              <Rect
                x={x}
                y={y}
                width={barWidth / 2}
                height={barHeight}
                fill="#1abc9c"
                rx={4}
              />
              {/* 막대 위 텍스트 */}
              <SvgText
                x={x + barWidth / 4}
                y={y - 10}
                fontSize="12"
                fill="#333"
                textAnchor="middle"
              >
                {value}
              </SvgText>
              {/* 날짜 텍스트 */}
              <SvgText
                x={x + barWidth / 4}
                y={maxHeight + boxPadding / 2 + 20}
                fontSize="12"
                fill="#333"
                textAnchor="middle"
              >
                {['월', '화', '수', '목', '금', '토', '일'][index]}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
    );
  };

  const renderGrowthBarChart = () => {
    const barWidth = (screenWidth - 80) / goalComparison.length; // 좌우 여백 고려
    const maxHeight = 100; // 그래프 높이
    const statusMap = { '미흡': 1, '보통': 2, '만족': 3 }; // 상태를 숫자로 매핑
    const colorMap = { '미흡': '#e74c3c', '보통': '#f1c40f', '만족': '#2ecc71' }; // 상태별 색상

    return (
      <Svg height={maxHeight + 40} width={screenWidth}>
        {/* Y축 눈금 */}
        {['만족', '보통', '미흡'].map((status, index) => (
          <SvgText
            key={status}
            x="20"
            y={(maxHeight / 3) * index + 20}
            fontSize="12"
            fill="#333"
            textAnchor="end"
          >
            {status}
          </SvgText>
        ))}
        {/* 상태 막대 */}
        {goalComparison.map((item, index) => {
          const barHeight = (statusMap[item.status] / 3) * maxHeight;
          const x = index * barWidth + 60; // X축 위치
          const y = maxHeight - barHeight + 20; // Y축 위치

          return (
            <React.Fragment key={index}>
              <Rect
                x={x}
                y={y}
                width={barWidth / 2}
                height={barHeight}
                fill={colorMap[item.status]}
                rx={4}
              />
              <SvgText
                x={x + barWidth / 4}
                y={maxHeight + 30}
                fontSize="12"
                fill="#333"
                textAnchor="middle"
              >
                {item.day}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
    );
  };

  const renderPieChart = (actual, target, color, label) => {
    const { percentage, status } = calculatePercentage(actual, target);
    const radius = 40; // 원형 그래프 크기
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
    return (
      <View style={styles.pieChartWrapper}>
        <Svg width={100} height={100}>
          {/* 배경 원 */}
          <Circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#e0e0e0"
            strokeWidth="10"
            fill="none"
          />
          {/* 비율 원 */}
          <Circle
            cx="50"
            cy="50"
            r={radius}
            stroke={color}
            strokeWidth="10"
            fill="none"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
          />
          {/* 퍼센트 텍스트 */}
          <SvgText
            x="50"
            y="50"
            textAnchor="middle"
            alignmentBaseline="middle"
            fontSize="14"
            fill={color}
          >
            {`${percentage}%`}
          </SvgText>
        </Svg>
        {/* 설명 텍스트 */}
        <Text style={styles.pieChartText}>
          {label}: <Text style={styles.pieChartTextHighlight}>{status}</Text>
        </Text>
      </View>
    );
  };
  
  

  return (
    <View style={styles.container}>
      <Navbar />
      <TabNavigation activeTab="식단" onTabPress={handleTabPress} />

      <ScrollView>
        <ContentWrapper>
          {/* 제목: 총 칼로리 섭취량 */}
          <Text style={styles.sectionTitle}>총 칼로리 섭취량</Text>
          <View style={styles.statsSection}>
            <ScrollView horizontal>
              <View style={{ flexDirection: 'row' }}>{renderCustomBarChart()}</View>
            </ScrollView>
          </View>

          {/* 제목: 영양성분 비율 */}
          <Text style={styles.sectionTitle}>영양성분 비율</Text>
          <View style={[styles.statsSection, styles.pieChartContainer]}>
          <View style={styles.pieChartWrapper}>
    {renderPieChart(
      nutritionData.carbs,
      goalData.carbs,
      '#1abc9c',
      '탄수화물'
    )}
  </View>
  <View style={styles.pieChartWrapper}>
    {renderPieChart(
      nutritionData.protein,
      goalData.protein,
      '#3498db',
      '단백질'
    )}
  </View>
  <View style={styles.pieChartWrapper}>
    {renderPieChart(
      nutritionData.fat,
      goalData.fat,
      '#e74c3c',
      '지방'
    )}
  </View>
</View>

          {/* 제목: 목표까지 남은 날짜 */}
          <View style={styles.statsSection}>
            {daysToGoal > 0 ? (
              <Text style={[styles.goalStatus, { textAlign: 'center' }]}>
                🔥 {selectedGoal}까지 약 {daysToGoal}일 남았습니다.
              </Text>
            ) : (
              <Text style={[styles.goalStatus, { textAlign: 'center', color: '#FF4500' }]}>
                🎉 {selectedGoal} 목표를 달성하셨습니다! 축하드립니다!
              </Text>
            )}
          </View>

          {/* 제목: 목표 대비 성장률 */}
          <Text style={styles.sectionTitle}>목표 대비 성장률</Text>
          <View style={styles.statsSection}>
            {renderGrowthBarChart()}
          </View>
        </ContentWrapper>
      </ScrollView>
    </View>
  );
};

export default MealStatsScreen;
