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
  const [goalComparison, setGoalComparison] = useState([]);
  const [nutritionData, setNutritionData] = useState({});
  const [goalData, setGoalData] = useState({});
  const [selectedGoal, setSelectedGoal] = useState('다이어트');
  const [daysToGoal, setDaysToGoal] = useState(null);
  const [filterPeriod, setFilterPeriod] = useState('1주일');
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [firstRecordedDate, setFirstRecordedDate] = useState(null);
  const [dailyCalories, setDailyCalories] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDateRange = (currentDate) => {
    const endDate = new Date(currentDate);
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 29);
    return { startDate, endDate };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchFirstRecordedDate();
        if (firstRecordedDate) {
          await fetchCaloriesData(firstRecordedDate);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [firstRecordedDate]);

  useEffect(() => {
    if (dailyCalories.length > 0) {
      filterDataForLast30Days();
    }
  }, [dailyCalories, currentDate]);

  const fetchFirstRecordedDate = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      const response = await fetch(
        `${CONFIG.API_BASE_URL}/statistic/meal/first-recorded-date`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (!response.ok) {
        console.error('HTTP Error:', response.status, response.statusText);
        return;
      }
      const data = await response.json();
      setFirstRecordedDate(data.firstRecordedDate);
    } catch (error) {
      console.error('Error fetching first recorded date:', error.message);
    }
  };

  const fetchCaloriesData = async (startDate) => {
    if (!startDate) return;

    const token = await AsyncStorage.getItem('jwtToken');
    const endDate = new Date().toISOString().split('T')[0];
    try {
      const response = await fetch(
        `${CONFIG.API_BASE_URL}/statistic/calories/daily?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) {
        console.error('HTTP Error:', response.status, response.statusText);
        return;
      }
      const data = await response.json();
      setDailyCalories(data);
    } catch (error) {
      console.error('Error fetching daily calories:', error.message);
    }
  };

  const filterDataForLast30Days = () => {
    const { startDate, endDate } = getDateRange(currentDate);
    const filtered = dailyCalories.filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate >= startDate && entryDate <= endDate;
    });
    setFilteredData(filtered);
  };

  const handleTabPress = (tab) => {
    if (tab === '운동') {
      navigation.navigate('StaticsMain');
    } else if (tab === '체중') {
      navigation.navigate('WeightStats');
    }
  };

  const handlePrevious30Days = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() - 30);
      return newDate;
    });
  };

  const handleNext30Days = () => {
    const today = new Date();
    if (currentDate < today) {
      setCurrentDate((prev) => {
        const newDate = new Date(prev);
        newDate.setDate(newDate.getDate() + 30);
        return newDate;
      });
    }
  };
  const calculatePercentage = (actual, target) => {
    const percentage = ((actual / target) * 100).toFixed(0);
    if (percentage >= 95) return { percentage, status: '과도' };
    if (percentage >= 85) return { percentage, status: '근접' };
    return { percentage, status: '미흡' };
  };

  const renderCustomBarChart = () => {
    if (!filteredData || filteredData.length === 0) {
      return <Text style={{ textAlign: 'center', marginTop: 20 }}>데이터가 없습니다.</Text>;
    }

    const barWidth = 30;
    const maxHeight = 140;
    const padding = 20;
    const maxCalories = Math.max(...filteredData.map((entry) => entry.totalCalories), 1);

    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Svg height={maxHeight + 60} width={filteredData.length * (barWidth + padding)}>
          {filteredData.map((entry, index) => {
            const barHeight = (entry.totalCalories / maxCalories) * maxHeight;
            const x = index * (barWidth + padding);
            const y = maxHeight - barHeight;

            return (
              <React.Fragment key={index}>
                <Rect x={x} y={y} width={barWidth} height={barHeight} fill="#1abc9c" rx={4} />
                <SvgText
                  x={x + barWidth / 2}
                  y={y - 10}
                  fontSize="12"
                  fill="#333"
                  textAnchor="middle"
                >
                  {Math.floor(entry.totalCalories)}
                </SvgText>
                <SvgText
                  x={x + barWidth / 2}
                  y={maxHeight + 20}
                  fontSize="12"
                  fill="#666"
                  textAnchor="middle"
                >
                  {new Date(entry.date).toLocaleDateString('ko-KR', {
                    day: 'numeric',
                    month: 'numeric',
                  })}
                </SvgText>
              </React.Fragment>
            );
          })}
        </Svg>
      </ScrollView>
    );
  };
  const renderPieChart = (actual, target, color, label) => {
    const { percentage, status } = calculatePercentage(actual, target);
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <View style={styles.pieChartWrapper}>
        <Svg width={100} height={100}>
          <Circle cx="50" cy="50" r={radius} stroke="#e0e0e0" strokeWidth="10" fill="none" />
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
          <SvgText x="50" y="50" textAnchor="middle" alignmentBaseline="middle" fontSize="14" fill={color}>
            {`${percentage}%`}
          </SvgText>
        </Svg>
        <Text style={styles.pieChartText}>
          {label}: <Text style={styles.pieChartTextHighlight}>{status}</Text>
        </Text>
      </View>
    );
  };
  // 성장률 그래프 추가
const renderGrowthBarChart = () => {
    if (!goalComparison || goalComparison.length === 0) {
      return <Text style={{ textAlign: 'center', marginTop: 20 }}>데이터가 없습니다.</Text>;
    }
  
    const barWidth = (screenWidth - 80) / goalComparison.length;
    const maxHeight = 100;
    const statusMap = { 미흡: 1, 보통: 2, 만족: 3 }; // 상태를 숫자로 매핑
    const colorMap = { 미흡: '#e74c3c', 보통: '#f1c40f', 만족: '#2ecc71' }; // 상태별 색상
  
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
  


  const { startDate, endDate } = getDateRange(currentDate);

  return (
    <View style={styles.container}>
      <Navbar />
      <TabNavigation activeTab="식단" onTabPress={handleTabPress} />

      <ScrollView>
        <ContentWrapper>
          <View style={styles.dateRangeContainer}>
            <TouchableOpacity onPress={handlePrevious30Days} style={styles.arrowButton}>
              <Text style={styles.arrowText}>{'<'}</Text>
            </TouchableOpacity>
            <Text style={styles.dateRangeText}>
              {startDate.toLocaleDateString('ko-KR')} ~ {endDate.toLocaleDateString('ko-KR')}
            </Text>
            <TouchableOpacity onPress={handleNext30Days} style={styles.arrowButton}>
              <Text style={styles.arrowText}>{'>'}</Text>
            </TouchableOpacity>
          </View>

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