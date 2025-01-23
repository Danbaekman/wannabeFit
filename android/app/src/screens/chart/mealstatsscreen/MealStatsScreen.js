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
import { BarChart } from 'react-native-gifted-charts';
import dayjs from 'dayjs';
import Footer from '../../../components/footer/Footer';



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
  const [goalComparisonData, setGoalComparisonData] = useState({});

  

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

  useEffect(() => {
    fetchNutritionDistribution(); // 영양성분 데이터 가져오기
  }, []);

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
  

  // 영양성분 서버에서 받아오기
 // 영양성분 데이터 서버에서 받아오기
const fetchNutritionDistribution = async (selectedPeriod) => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      const response = await fetch(`${CONFIG.API_BASE_URL}/statistic/nutrition/distribution?period=${selectedPeriod}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        console.error('Failed to fetch nutrition distribution:', response.statusText);
        return;
      }
  
      const data = await response.json();
      setNutritionData(data); // 받아온 데이터로 상태 업데이트
    } catch (error) {
      console.error('Failed to fetch nutrition distribution:', error.message);
    }
  };

  // 목표대비 섭취량 api
  const fetchGoalComparison = async (period = '전체') => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      const response = await fetch(
        `${CONFIG.API_BASE_URL}/statistic/nutrition/goal-comparison?period=${period}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (!response.ok) {
        console.error('Error fetching goal comparison:', response.statusText);
        return;
      }
  
      const data = await response.json();
      console.log('Received goalComparisonData from server:', data);
      setGoalComparison(data); // 상태에 저장
    } catch (error) {
      console.error('Error fetching goal comparison:', error.message);
    } 
  };
  
  // 호출 시
  useEffect(() => {
    fetchGoalComparison(); // 기본적으로 전체 기간 조회
  }, []);
  
  // 필터 버튼 선택 시 호출
  const handleFilterChange = (selectedPeriod) => {
    setFilterPeriod(selectedPeriod); // 선택된 기간을 상태에 저장 (UI 업데이트용)
    fetchNutritionDistribution(selectedPeriod); // 서버에서 데이터 새로 가져오기
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

  const renderCustomBarChart = () => {
    if (!filteredData || filteredData.length === 0) {
      return <Text style={{ textAlign: 'center', marginTop: 20 }}>데이터가 없습니다.</Text>;
    }
  
    // BarChart에 사용할 데이터 매핑
    const barChartData = filteredData.map((entry) => ({
      value: entry.totalCalories,
      label: dayjs(entry.date).format('MM/DD'),
      frontColor: '#008080', // 막대 색상
      topLabelComponent: () => (
        <Text style={{ 
          fontSize: 12, // 글씨 크기
          color: '#333',
          marginBottom: 10, // 그래프와의 거리
          textAlign: 'center',
        }}>
          {Math.floor(entry.totalCalories)}
        </Text>
      ),
    }));
  
    // 그래프의 최대값에 여유 공간 추가 (최대값에 10% 여유)
    const maxCalories = Math.max(...filteredData.map((entry) => entry.totalCalories), 1);
    const adjustedMaxValue = Math.ceil(maxCalories * 1.1);
  
    return (
      <View style={{ marginVertical: 20 }}>
        <BarChart
          data={barChartData}
          barWidth={30} // 막대 너비
          spacing={20} // 막대 간 간격
          barBorderRadius={4}
          maxValue={adjustedMaxValue} // 최대값 조정
          noOfSections={4} // Y축 섹션 개수
          yAxisLabelWidth={40} // Y축 라벨 너비
          yAxisTextStyle={{ color: '#666', fontSize: 12 }} // Y축 라벨 스타일
          xAxisLabelTextStyle={{ color: '#333', fontSize: 12, }} // X축 라벨 스타일
          xAxisThickness={1} // X축 두께
          xAxisColor="#D9D9D9" // X축 색상
          yAxisThickness={0} // Y축 두께
          yAxisColor="#D9D9D9" // Y축 색상
          hideRules={0} // 규칙선 표시
          rulesColor="#D9D9D9" // 규칙선 색상
          rulesThickness={0.5} // 규칙선 두께
          backgroundColor="#FFFFFF" // 차트 배경색
          height={200} // 그래프 전체 높이 증가
          stepValue={500} // Y축 간격
          hideYAxisText={true} 
        />
      </View>
    );
  };
  
  
  
  const renderPieChart = (percentage, color, label) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <View style={styles.pieChartWrapper}>
        <Svg width={100} height={100}>
          {/* Background Circle */}
          <Circle cx="50" cy="50" r={radius} stroke="#e0e0e0" strokeWidth="10" fill="none" />
          {/* Percentage Circle */}
          <Circle
            cx="50"
            cy="50"
            r={radius}
            stroke={color}
            strokeWidth="10"
            fill="none"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            transform={`rotate(-90, 50, 50)`} // 0도에서 시작하도록 회전
          />
          {/* Percentage Text */}
          <SvgText x="50" y="50" textAnchor="middle" alignmentBaseline="middle" fontSize="14" fill={color}>
            {`${percentage}%`}
          </SvgText>
        </Svg>
        <Text style={styles.pieChartText}>{label}</Text>
      </View>
    );
  };

  const { startDate, endDate } = getDateRange(currentDate);

  const renderGoalComparison = () => {
    if (!goalComparison || Object.keys(goalComparison).length === 0) {
      return <Text style={{ textAlign: 'center', marginTop: 20 }}>데이터가 없습니다.</Text>;
    }
  
    const { calorieComparison = 'N/A', proteinComparison = 'N/A', fatComparison = 'N/A', carbsComparison = 'N/A' } = goalComparison;
  
    const getStatus = (value) => {
      const percentage = parseFloat(value);
      if (isNaN(percentage)) return { status: 'N/A', color: '#aaa' };
      if (percentage < 70) return { status: '미흡', color: '#e74c3c' }; // 빨간색
      if (percentage >= 70 && percentage <= 100) return { status: '양호', color: '#3498db' }; // 파란색
      return { status: '초과', color: '#2ecc71' }; // 녹색
    };
  
    return (
      <View>
        {/* 상단 안내 문구 */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            <Text style={{ color: '#000' }}>0~70%:</Text> <Text style={{ color: '#e74c3c' }}>미흡</Text>,{' '}
            <Text style={{ color: '#000' }}>70~100%:</Text> <Text style={{ color: '#3498db' }}>양호</Text>,{' '}
            <Text style={{ color: '#000' }}>100% 이상:</Text> <Text style={{ color: '#2ecc71' }}>초과</Text>
          </Text>
        </View>
  
        {/* 목표 대비 비교 */}
        {[
          { label: '칼로리', value: calorieComparison },
          { label: '탄수화물', value: carbsComparison },
          { label: '단백질', value: proteinComparison },
          { label: '지방', value: fatComparison },
        ].map(({ label, value }) => {
          const { status, color } = getStatus(value);
          return (
            <View key={label} style={styles.comparisonRow}>
              {/* 좌측: 라벨 */}
              <Text style={styles.comparisonLabel}>{label}</Text>
              {/* 우측: 퍼센트 및 상태 */}
              <View style={styles.comparisonValueContainer}>
                <Text style={[styles.comparisonValue, { color }]}>{value}</Text>
                <Text style={[styles.comparisonStatus, { color }]}>{status}</Text>
              </View>
            </View>
          );
        })}
      </View>
    );
  };
  
  

  return (
    <View style={styles.container}>
      <Navbar />
      <TabNavigation activeTab="식단" onTabPress={handleTabPress} />
        <ContentWrapper>
        <ScrollView>
          <Text style={styles.sectionTitle}>총 칼로리 섭취량</Text>
          <View style={styles.statsSection}>
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
      {['1주일', '1개월', '3개월', '6개월', '1년',].map((period) => (
        <TouchableOpacity
          key={period}
          style={styles.filterOption}
          onPress={() => {
            handleFilterChange(period); // 선택된 기간을 서버에 전달하여 데이터를 가져옴
            setIsFilterVisible(false); // 드롭다운 닫기
          }}
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
        {renderPieChart(Math.round(parseFloat(nutritionData.carbs)), '#1abc9c', '탄수화물')}
    </View>
    <View style={styles.pieChartWrapper}>
        {renderPieChart(Math.round(parseFloat(nutritionData.protein)), '#3498db', '단백질')}
    </View>
    <View style={styles.pieChartWrapper}>
        {renderPieChart(Math.round(parseFloat(nutritionData.fat)), '#e74c3c', '지방')}
    </View>
    </View>

  </View>
</View>

          {/* 제목: 목표 대비 성장률 */}
        <Text style={styles.sectionTitle}>목표 대비 평균 섭취율</Text>
            <View style={styles.statsSection}>
            {renderGoalComparison()}
        </View>
        </ScrollView>
        </ContentWrapper>
        <Footer />
    </View>
  );
};

export default MealStatsScreen;