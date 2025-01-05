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
    };
    const hardcodedNutritionData = {
      carbs: 174,
      protein: 140,
      fat: 40,
    };

    setWeeklyCalories(hardcodedWeeklyCalories);
    setGoalComparison(hardcodedGoalComparison);
    setGoalData(hardcodedGoalData);
    setNutritionData(hardcodedNutritionData);
  }, []);

  const handleTabPress = (tab) => {
    if (tab === '운동') {
      navigation.navigate('StaticsMain');
    } else if (tab === '체중') {
      navigation.navigate('WeightStats');
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

  const renderPieChart = (actual, target, color, label) => {
    const { percentage, status } = calculatePercentage(actual, target);
    const radius = 40; // 원형 그래프 크기 조정
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <View style={{ alignItems: 'center', margin: 10, width: '30%' }}>
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
          {/* 텍스트 */}
          <SvgText
            x="50"
            y="50"
            textAnchor="middle"
            alignmentBaseline="middle"
            fontSize="12"
            fill={color}
          >
            {`${percentage}%`}
          </SvgText>
        </Svg>
        <Text style={{ marginTop: 5, fontSize: 12, color: '#333', textAlign: 'center' }}>
          {label}: <Text style={{ color }}>{status}</Text>
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
          <View style={[styles.statsSection, { flexDirection: 'row', justifyContent: 'space-evenly' }]}>
            {renderPieChart(
              nutritionData.carbs,
              goalData.carbs,
              '#1abc9c',
              '탄수화물'
            )}
            {renderPieChart(
              nutritionData.protein,
              goalData.protein,
              '#3498db',
              '단백질'
            )}
            {renderPieChart(
              nutritionData.fat,
              goalData.fat,
              '#e74c3c',
              '지방'
            )}
          </View>

          {/* 제목: 목표 대비 성장률 */}
          <Text style={styles.sectionTitle}>목표 대비 성장률</Text>
          <View style={styles.statsSection}>
            {goalComparison.map((day, index) => (
              <Text key={index} style={styles.averageText}>
                {`${day.day}: ${day.status}`}
              </Text>
            ))}
          </View>
        </ContentWrapper>
      </ScrollView>
    </View>
  );
};

export default MealStatsScreen;
