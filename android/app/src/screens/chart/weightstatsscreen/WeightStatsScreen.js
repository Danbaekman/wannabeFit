import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
import Navbar from '../../../components/navbar/Navbar';
import TabNavigation from '../../../components/tabnavigation/TabNavigation';
import ContentWrapper from '../../../components/contentwrapper/ContentWrapper';
import styles from './WeightStatsScreenStyles';
import CONFIG from '../../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart } from 'react-native-chart-kit';
import dayjs from 'dayjs';
import Footer from '../../../components/footer/Footer';

const WeightStatsScreen = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(false); 

  const [weightTrends, setWeightTrends] = useState([]);
  const [weightSummary, setWeightSummary] = useState({
    minWeight: null,
    maxWeight: null,
    avgWeight: null,
  });
  const [targetWeight, setTargetWeight] = useState(null);
  const [recentWeight, setRecentWeight] = useState(null); // 최근 체중
  const [selectedPeriod, setSelectedPeriod] = useState('day'); 
  const generateDateRange = (startDate, endDate) => {
    const dateArray = [];
    let currentDate = dayjs(startDate);
  
    while (currentDate.isBefore(dayjs(endDate)) || currentDate.isSame(dayjs(endDate))) {
      dateArray.push(currentDate.format('YYYY-MM-DD'));
      currentDate = currentDate.add(1, 'day');
    }
  
    return dateArray;
  };
  const [startDate, setStartDate] = useState(null);
const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD')); // 초기 값: 오늘 날짜
const aggregateDataByPeriod = (data, period) => {
    const groupedData = {};
  
    data.forEach((item) => {
      const startOfPeriod =
        period === 'week'
          ? dayjs(item.date).startOf('week')
          : dayjs(item.date).startOf('month');
  
      const endOfPeriod =
        period === 'week'
          ? dayjs(item.date).endOf('week')
          : dayjs(item.date).endOf('month');
  
      const dateKey = startOfPeriod.format('YYYY-MM-DD');
  
      if (!groupedData[dateKey]) {
        groupedData[dateKey] = {
          totalWeight: 0,
          count: 0,
          dateRangeLabel: `${startOfPeriod.format('YY-MM-DD')} ~ ${endOfPeriod.format('YY-MM-DD')}`, // 변경된 날짜 형식
        };
      }
  
      groupedData[dateKey].totalWeight += item.weight;
      groupedData[dateKey].count += 1;
    });
  
    return Object.entries(groupedData).map(([key, value]) => ({
      date: key,
      weight: value.totalWeight / value.count, // 평균 무게 계산
      dateRangeLabel: value.dateRangeLabel, // 범위 텍스트
    }));
  };
  
  useEffect(() => {
    fetchWeightData();
  }, [selectedPeriod]);

  const fetchWeightData = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        Alert.alert('오류', '로그인이 필요합니다.');
        return;
      }
  
      // 사용자 정보 가져오기
      const userResponse = await fetch(`${CONFIG.API_BASE_URL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!userResponse.ok) {
        console.error('사용자 정보 가져오기 실패:', userResponse.statusText);
        return;
      }
  
      const userData = await userResponse.json();
      const startDate = dayjs(userData.created_at).format('YYYY-MM-DD');
      const initialWeight = userData.weight;
      setStartDate(startDate);
      setTargetWeight(userData.targetWeight);
  
      // 날짜 범위 계산
      const { startDate: fetchStartDate, endDate } = calculateDateRange(selectedPeriod, startDate);
  
      // 체중 변화 데이터 가져오기
      const trendsResponse = await fetch(
        `${CONFIG.API_BASE_URL}/statistic/weight/trends?startDate=${fetchStartDate}&endDate=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (!trendsResponse.ok) {
        const errorText = await trendsResponse.text();
        console.error('체중 변화 추이 가져오기 실패:', trendsResponse.status, errorText);
        Alert.alert('오류', '체중 변화 추이 데이터를 가져오는 데 실패했습니다.');
        return;
      }
  
      const originalData = await trendsResponse.json(); // 원본 데이터 저장
      if (!originalData.some((item) => item.date === startDate)) {
        originalData.unshift({
          date: startDate,
          weight: initialWeight,
        });
      }
  
      // `recentWeight`를 항상 원본 데이터에서 계산
      const latestWeightEntry = originalData.reduce((latest, current) =>
        dayjs(current.date).isAfter(latest.date) ? current : latest
      );
      setRecentWeight(latestWeightEntry.weight); // 최신 체중 설정
  
      // 주간 또는 월간 데이터 요약
      let trendsData = [...originalData];
      if (selectedPeriod === 'week' || selectedPeriod === 'month') {
        trendsData = aggregateDataByPeriod(originalData, selectedPeriod);
      }
  
      setWeightTrends(trendsData);
  
      // 체중 요약 데이터 가져오기
      const summaryResponse = await fetch(`${CONFIG.API_BASE_URL}/statistic/weight/summary`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (summaryResponse.ok) {
        const summaryData = await summaryResponse.json();
        setWeightSummary(summaryData);
      } else {
        const errorText = await summaryResponse.text();
        console.error('체중 요약 데이터 가져오기 실패:', summaryResponse.status, errorText);
        Alert.alert('오류', '체중 요약 데이터를 가져오는 데 실패했습니다.');
      }
    } catch (error) {
      console.error('체중 데이터 가져오기 오류:', error.message);
      Alert.alert('오류', '데이터를 가져오는 도중 문제가 발생했습니다.');
    }
  };
  
  

  const calculateDateRange = (period, firstRecordedDate) => {
    const now = dayjs();
    const startRecordedDate = dayjs(firstRecordedDate); // 첫 기록 날짜
    let startDate, endDate;
  
    switch (period) {
      case 'day':
        startDate = startRecordedDate.format('YYYY-MM-DD'); // 첫 기록 날짜
        endDate = now.endOf('day').format('YYYY-MM-DD'); // 오늘까지
        break;
      case 'week':
        startDate = startRecordedDate.startOf('week').format('YYYY-MM-DD');
        endDate = now.endOf('week').format('YYYY-MM-DD');
        break;
      case 'month':
        startDate = startRecordedDate.startOf('month').format('YYYY-MM-DD');
        endDate = now.endOf('month').format('YYYY-MM-DD');
        break;
      default:
        startDate = startRecordedDate.format('YYYY-MM-DD');
        endDate = now.endOf('day').format('YYYY-MM-DD');
    }
  
    return { startDate, endDate };
  };
  

  const renderPeriodButtons = () => {
    const periods = [
      { label: '일간', value: 'day' },
      { label: '주간', value: 'week' },
      { label: '월간', value: 'month' },
    ];

    return (
      <View style={styles.periodButtonContainer}>
        {periods.map((period) => (
          <TouchableOpacity
            key={period.value}
            style={[
              styles.periodButton,
              selectedPeriod === period.value
                ? styles.periodButtonActive
                : styles.periodButtonInactive,
            ]}
            onPress={() => setSelectedPeriod(period.value)}
          >
            <Text
              style={[
                styles.periodButtonText,
                selectedPeriod === period.value
                  ? styles.periodButtonTextActive
                  : styles.periodButtonTextInactive,
              ]}
            >
              {period.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderWeightTrendsChart = () => {
    if (!weightTrends || weightTrends.length === 0) {
      return <Text style={styles.noDataText}>체중 기록이 없습니다.</Text>;
    }
  
    // 레이블 및 데이터 설정
    const labels = weightTrends.map((entry) =>
        selectedPeriod === 'day' ? dayjs(entry.date).format('YY-MM-DD') : entry.dateRangeLabel
      );
    const weights = weightTrends.map((entry) => entry.weight);
    
  
    return (
      <ScrollView horizontal contentContainerStyle={{ flexGrow: 1 }}>
        <LineChart
          data={{
            labels, // 주간/월간 범위 텍스트를 레이블로 사용
            datasets: [
              {
                data: weights,
                color: () => '#008080',
              },
            ],
          }}
          width={Math.max(300, weights.length * 50)}
          height={220}
          yAxisSuffix="kg"
          chartConfig={{
            backgroundColor: '#FFFFFF',
            backgroundGradientFrom: '#FFFFFF',
            backgroundGradientTo: '#FFFFFF',
            decimalPlaces: 1,
            color: () => '#000000',
            labelColor: () => '#000000',
            style: {
              borderRadius: 16,
            },
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </ScrollView>
    );
  };
  
  

  const renderWeightSummary = () => {
    const { minWeight, maxWeight, avgWeight } = weightSummary;
  
    if (minWeight === null || maxWeight === null || avgWeight === null) {
      return <Text style={styles.noDataText}>체중 요약 데이터가 없습니다.</Text>;
    }
  
    const remainingWeight =
      targetWeight !== null && recentWeight !== null
        ? (targetWeight - recentWeight).toFixed(1)
        : null;
  
    return (
      <View>
        {remainingWeight !== null && (
            <Text style={styles.summaryText}>
            <Text style={styles.goalText}>
            목표 체중
            </Text>
            <Text>까지{' '}</Text>
            <Text style={styles.goalWeight}>{remainingWeight}</Text> kg 남았습니다.   
          </Text>        
        )}
        <View style={styles.summaryRow}>
        <View style={styles.summaryColumn}>
          <Text style={styles.summaryLabel}>최소 체중</Text>
          <Text style={styles.summaryValue}>{minWeight} kg</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryColumn}>
          <Text style={styles.summaryLabel}>평균 체중</Text>
          <Text style={styles.summaryValue}>{avgWeight !== null ? parseFloat(avgWeight).toFixed(1) : 'N/A'} kg</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryColumn}>
          <Text style={styles.summaryLabel}>최대 체중</Text>
          <Text style={styles.summaryValue}>{maxWeight} kg</Text>
        </View>
      </View>
      </View>
    );
  };
  

  return (
    <View style={styles.container}>
      <Navbar />
      <TabNavigation activeTab="체중" onTabPress={(tab) => navigation.navigate(tab === '운동' ? 'StaticsMain' : 'MealStats')} />

      <ScrollView>
        <ContentWrapper>
          <Text style={styles.sectionTitle}>체중 변화 추이</Text>
          <View style={styles.statsSection}>
            {renderWeightTrendsChart()}
            {renderPeriodButtons()}</View>

          <Text style={styles.sectionTitle}>체중 요약</Text>
          <View style={styles.statsSection}>{renderWeightSummary()}</View>
        </ContentWrapper>
      </ScrollView>
      <Footer/>
    </View>
  );
};

export default WeightStatsScreen;
