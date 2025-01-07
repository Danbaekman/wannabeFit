import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Dimensions } from 'react-native';
import Svg, { Rect, Text as SvgText, Circle } from 'react-native-svg';
import Navbar from '../../../components/navbar/Navbar';
import TabNavigation from '../../../components/tabnavigation/TabNavigation';
import ContentWrapper from '../../../components/contentwrapper/ContentWrapper';
import styles from './MealStatsScreenStyles';
import CONFIG from '../../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';


const MealStatsScreen = ({ navigation }) => {
  const screenWidth = Dimensions.get('window').width;

  // State 관리
  const [weeklyCalories, setWeeklyCalories] = useState([]);
  const [goalComparison, setGoalComparison] = useState([]);
  const [nutritionData, setNutritionData] = useState({});
  const [goalData, setGoalData] = useState({});
  const [selectedGoal, setSelectedGoal] = useState('다이어트'); // 사용자 목표
  const [daysToGoal, setDaysToGoal] = useState(null); // 목표까지 남은 일수
  const [filterPeriod, setFilterPeriod] = useState('1주일'); // 기본 필터 값
  const [isFilterVisible, setIsFilterVisible] = useState(false); // 필터 드롭다운 표시 여부
  const [firstRecordedDate, setFirstRecordedDate] = useState(null);
  const [dailyCalories, setDailyCalories] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지 (7개 단위로 슬라이싱)
  

  useEffect(() => {
    fetchFirstRecordedDate();
  }, []);

  useEffect(() => {
    if (firstRecordedDate) {
      fetchCaloriesData(firstRecordedDate).then((data) => {
        setWeeklyCalories(data); // 모든 데이터를 배열로 저장
      });
    }
  }, [firstRecordedDate]);
  
  
  // 첫 식단 기록한 날짜
  const fetchFirstRecordedDate = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      const response = await fetch(`${CONFIG.API_BASE_URL}/statistic/meal/first-recorded-date`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
        if (!response.ok) {
        console.error('HTTP Error:', response.status, response.statusText);
        return;
      }
      const data = await response.json();
      setFirstRecordedDate(data.firstRecordedDate);
      console.log('First recorded date:', data.firstRecordedDate);
    } catch (error) {
      console.error('Error fetching first recorded date:', error.message);
    }
  };
  
  // 일별 기록된 칼로리들 불러오기
  const fetchCaloriesData = async (startDate) => {
    if (!startDate) return; // 첫 기록 날짜가 없으면 실행하지 않음

    const token = await AsyncStorage.getItem('jwtToken');
    const endDate = new Date().toISOString().split('T')[0]; // 현재 날짜

    try {
        console.log(
            `Request URL: ${CONFIG.API_BASE_URL}/statistic/calories/daily?startDate=${startDate}&endDate=${endDate}`
          );
          
      const response = await fetch(
        `${CONFIG.API_BASE_URL}/statistic/calories/daily?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        console.error('HTTP Error:', response.status, response.statusText);
        return;
      }

      const data = await response.json();
      setDailyCalories(data); // 상태에 일별 칼로리 데이터 저장
      console.log('Fetched daily calories:', data);
    } catch (error) {
      console.error('Error fetching daily calories:', error.message);
    }
  };

  
  
  
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

  const handleFilterChange = (period) => {
    setFilterPeriod(period);
    setIsFilterVisible(false); // 드롭다운 닫기
  };
  


  const renderCustomBarChart = () => {
    const barWidth = 30; // 각 막대의 너비
    const maxHeight = 140; // 기본 막대 최대 높이
    const padding = 20; // 막대 간격
    const itemsPerPage = 7; // 한 페이지에 보여줄 데이터 개수
    const currentData = dailyCalories.slice(
      currentPage * itemsPerPage,
      (currentPage + 1) * itemsPerPage
    ); // 현재 페이지 데이터 슬라이싱
  
    // 최고 칼로리 계산
    const maxCalories = Math.max(...currentData.map((entry) => entry.totalCalories), 1);
  
    // 흰색 박스 높이 설정 (최대 250px 기준, 최고 칼로리 비율 적용)
    const dynamicHeight = Math.min(250, maxCalories / 10 + 150);
  
    const totalWidth = currentData.length * (barWidth + padding);
  
    const chartPaddingTop = 40; // 그래프 위쪽 패딩
    const barAndTextPadding = 20; // 막대와 텍스트 사이 패딩
    const textPaddingBetween = 17; // 요일과 날짜 간의 패딩
    const bottomPadding = 30; // 하단 여백

  
    return (
      <View style={{ height: dynamicHeight - bottomPadding }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10 }}
        >
          <Svg height={dynamicHeight} width={totalWidth}>
            {currentData.map((entry, index) => {
              const barHeight = (entry.totalCalories / maxCalories) * maxHeight;
              const x = index * (barWidth + padding);
              const y = maxHeight - barHeight + chartPaddingTop;
  
              return (
                <React.Fragment key={index}>
                  {/* 막대 */}
                  <Rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    fill="#1abc9c"
                    rx={4}
                  />
                  {/* 칼로리 값 */}
                  <SvgText
                    x={x + barWidth / 2}
                    y={y - barAndTextPadding+10}
                    fontSize="12"
                    fill="#333"
                    textAnchor="middle"
                  >
                    {Math.floor(entry.totalCalories)}
                  </SvgText>
                  {/* 요일 */}
                  <SvgText
                    x={x + barWidth / 2}
                    y={maxHeight + chartPaddingTop + barAndTextPadding}
                    fontSize="12"
                    fill="#666"
                    textAnchor="middle"
                  >
                    {new Date(entry.date).toLocaleDateString('ko-KR', {
                      weekday: 'short',
                    })}
                  </SvgText>
                  {/* 날짜 */}
                  <SvgText
                    x={x + barWidth / 2}
                    y={
                      maxHeight +
                      chartPaddingTop +
                      barAndTextPadding +
                      textPaddingBetween
                    }
                    fontSize="12"
                    fill="#333"
                    textAnchor="middle"
                  >
                    {`${new Date(entry.date).getMonth() + 1}`.padStart(2, '0') + '.' + `${new Date(entry.date).getDate()}`.padStart(2, '0')}
                  </SvgText>
                </React.Fragment>
              );
            })}
          </Svg>
        </ScrollView>
      </View>
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
  <View>
  {/* 제목: 영양성분 비율 */}
  <Text style={styles.sectionTitle}>영양성분 비율</Text>
  {/* 흰색 박스 */}
  <View style={styles.statsSection}>
    {/* 필터 버튼 */}
    <View style={styles.filterContainer}>
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setIsFilterVisible(!isFilterVisible)}
      >
        <Text style={styles.filterButtonText}>
          {filterPeriod} <Text style={styles.filterArrow}>▼</Text>
        </Text>
      </TouchableOpacity>
      {isFilterVisible && (
        <View style={styles.filterDropdown}>
          {['1주일', '1개월', '3개월', '6개월', '1년'].map((period) => (
            <TouchableOpacity
              key={period}
              style={styles.filterOption}
              onPress={() => handleFilterChange(period)}
            >
              <Text style={styles.filterOptionText}>{period}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
    {/* 원형 그래프 */}
    <View style={styles.pieChartContainer}>
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
