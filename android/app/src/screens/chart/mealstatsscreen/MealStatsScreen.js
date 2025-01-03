import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Dimensions } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';
import Navbar from '../../../components/navbar/Navbar';
import TabNavigation from '../../../components/tabnavigation/TabNavigation';
import ContentWrapper from '../../../components/contentwrapper/ContentWrapper';
import styles from './MealStatsScreenStyles';

const MealStatsScreen = ({ navigation }) => {
  const screenWidth = Dimensions.get('window').width;

  // State 관리
  const [weeklyCalories, setWeeklyCalories] = useState([]);
  const [goalComparison, setGoalComparison] = useState({});
  const [selectedGoal, setSelectedGoal] = useState('다이어트'); // 사용자 목표

  // 하드코딩 데이터 설정
  useEffect(() => {
    const hardcodedWeeklyCalories = [1800, 2000, 2200, 1900, 2100, 2300, 2500];
    const hardcodedGoalComparison = {
      calorieComparison: 85,
      proteinComparison: 90,
      fatComparison: 80,
      carbsComparison: 70,
    };

    setWeeklyCalories(hardcodedWeeklyCalories);
    setGoalComparison(hardcodedGoalComparison);
  }, []);

  const handleTabPress = (tab) => {
    if (tab === '운동') {
      navigation.navigate('StaticsMain');
    } else if (tab === '체중') {
      navigation.navigate('WeightStats');
    }
  };

  const generateLabels = () => {
    const labels = [];
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(today.getDate() - (6 - i));
      const day = days[date.getDay()];
      const formattedDate = `${day}\n${date.getMonth() + 1}.${date.getDate()}`;
      labels.push(formattedDate);
    }
    return labels;
  };

  const renderCustomBarChart = () => {
    const barWidth = (screenWidth - 40) / weeklyCalories.length; // 각 막대의 너비
    const maxHeight = 140; // 그래프 최대 높이 (텍스트 포함)
    const boxPadding = 120; // 그래프 위아래 여유 공간 추가

    const maxCalories = 2500; // 최대 칼로리 값

    return (
      <Svg height={maxHeight + 100} width={screenWidth}>
        {weeklyCalories.map((value, index) => {
          const barHeight = (value / maxCalories) * maxHeight; // 막대 높이 비율 조정
          const x = index * barWidth + barWidth / 4; // X축 위치 계산
          const y = maxHeight - barHeight + boxPadding / 2; // 막대가 박스 하단에 붙도록 Y축 조정

          return (
            <React.Fragment key={index}>
              {/* 막대 */}
              <Rect
                x={x}
                y={y}
                width={barWidth / 2}
                height={barHeight}
                fill="#1abc9c"
                rx={4} // 모서리 둥글게
              />
              {/* 막대 위 텍스트 */}
              <SvgText
                x={x + barWidth / 4} // 막대의 중앙
                y={y - 10} // 막대 위로 약간 띄움
                fontSize="12"
                fill="#333"
                textAnchor="middle"
              >
                {value}
              </SvgText>
              {/* 날짜 텍스트 */}
              <SvgText
                x={x + barWidth / 4} // 막대의 중앙
                y={maxHeight + boxPadding / 2 + 20} // 요일 위치
                fontSize="12"
                fill="#333"
                textAnchor="middle"
              >
                {generateLabels()[index].split('\n')[0]} {/* 요일 */}
              </SvgText>
              <SvgText
                x={x + barWidth / 4} // 막대의 중앙
                y={maxHeight + boxPadding / 2 + 35} // 날짜를 조금 더 아래로 위치
                fontSize="12"
                fill="#333"
                textAnchor="middle"
              >
                {generateLabels()[index].split('\n')[1]} {/* 날짜 */}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
    );
  };

  return (
    <View style={styles.container}>
      <Navbar />
      <TabNavigation activeTab="식단" onTabPress={handleTabPress} />

      <ContentWrapper>
        {/* 제목: 총 칼로리 섭취량 */}
        <Text style={styles.sectionTitle}>총 칼로리 섭취량</Text>
        <View style={styles.statsSection}>
          <ScrollView horizontal>
            <View style={{ flexDirection: 'row' }}>{renderCustomBarChart()}</View>
          </ScrollView>
        </View>

        {/* 제목: 영양소 비율 */}
        <Text style={styles.sectionTitle}>영양소 비율</Text>
        <View style={styles.statsSection}>
          {/* 여기에 영양소 비율 섹션 내용 추가 가능 */}
        </View>

        {/* 제목: 목표 대비 섭취량 */}
        <Text style={styles.sectionTitle}>목표 대비 섭취량</Text>
        <View style={styles.statsSection}>
          <View style={styles.goalHeader}>
            <Text style={{ fontSize: 18, color: '#FF4500' }}>🔥</Text>
            <Text style={styles.goalSubtitle}>내 목표: {selectedGoal}</Text>
          </View>
          <Text style={styles.goalStatus}>
            {goalComparison.calorieComparison > 80
              ? '잘 수행 중이십니다!'
              : goalComparison.calorieComparison > 50
              ? '조금 미흡합니다'
              : '많이 미흡합니다'}
          </Text>
          <Text style={styles.averageText}>
            일주일 평균 <Text style={styles.highlightText}>{(weeklyCalories.reduce((a, b) => a + b, 0) / weeklyCalories.length).toFixed(0)} kcal</Text>을 먹었습니다.
          </Text>
          <Text style={styles.smallText}>평균 목표: 2,105kcal</Text>
        </View>
      </ContentWrapper>
    </View>
  );
};

export default MealStatsScreen;
