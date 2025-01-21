import React, { useState, useEffect } from 'react';
import { View, Text, Alert, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dimensions } from 'react-native';
import Navbar from '../../../components/navbar/Navbar';
import styles from './StaticsMainScreenStyles';
import CONFIG from '../../../config';
import TabNavigation from '../../../components/tabnavigation/TabNavigation';
import ContentWrapper from '../../../components/contentwrapper/ContentWrapper';
import dayjs from 'dayjs';
import { LineChart } from 'react-native-chart-kit';
import { BarChart } from 'react-native-gifted-charts';



const StaticsMainScreen = ({ navigation }) => {
  const [totalWorkoutTime, setTotalWorkoutTime] = useState(0); // 총 운동 시간 (분)
  const [totalDays, setTotalDays] = useState(0); // 총 운동 일수
  const [totalVolume, setTotalVolume] = useState(0); // 총 볼륨
  const [weeklyWorkoutCounts, setWeeklyWorkoutCounts] = useState([]); // 주당 운동 횟수 데이터
  const [volumeData, setVolumeData] = useState([]); // 볼륨 데이터
  const [selectedPeriod, setSelectedPeriod] = useState('day'); // 'day', 'week', 'month'
  const recentData = weeklyWorkoutCounts.slice(-7);
  const [startDate, setStartDate] = useState(''); // 시작 날짜
  const [endDate, setEndDate] = useState(''); // 최근 날짜



  const screenWidth = Dimensions.get('window').width;

  // 서버에서 총 운동 시간, 일수 및 총 볼륨 가져오기
  const fetchTotalWorkoutStats = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken'); // JWT 토큰 가져오기
      if (!token) {
        Alert.alert('Error', '로그인이 필요합니다.');
        navigation.navigate('Login');
        return;
      }

      const url = `${CONFIG.API_BASE_URL}/statistic/summary`;
      console.log('요청 URL (Summary):', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('응답 상태 코드 (Summary):', response.status);

      if (!response.ok) {
        console.error('서버 응답 상태 코드 (Summary):', response.status, response.statusText);
        throw new Error('서버에서 데이터를 가져오는 데 실패했습니다.');
      }

      const data = await response.json();
      console.log('서버 응답 데이터 (Summary):', JSON.stringify(data, null, 2));

      setTotalWorkoutTime(data.totalWorkoutTime || 0);
      setTotalDays(data.totalDays || 0);
      setTotalVolume(data.totalVolume || 0);
    } catch (error) {
      console.error('운동 통계 가져오기 오류 (Summary):', error.message);
      Alert.alert('Error', '운동 통계 데이터를 불러오지 못했습니다.');
    }
  };
  const handleTabPress = (tab) => {
    if (tab === '운동') {
      console.log('운동 탭 클릭됨');
      // 운동 탭 클릭 시의 동작을 지정
      navigation.navigate('StaticsMain'); // 이미 운동 통계 화면일 경우 그대로 유지
    } else if (tab === '식단') {
      console.log('식단 탭 클릭됨');
      navigation.navigate('MealStats'); // 식단 화면으로 이동
    } else if (tab === '체중') {
      console.log('체중 탭 클릭됨');
      navigation.navigate('WeightStats'); // 체중 화면으로 이동 (WeightStatsScreen 가정)
    }
  };

  // 서버에서 주당 운동 횟수 데이터 가져오기
  const fetchWeeklyWorkoutCounts = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        Alert.alert('Error', '로그인이 필요합니다.');
        navigation.navigate('Login');
        return;
      }
  
      const url = `${CONFIG.API_BASE_URL}/statistic/workout/count`;
      console.log('운동 횟수 데이터 요청 URL:', url);
  
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log('응답 상태 코드 (운동 횟수):', response.status);
  
      if (!response.ok) {
        console.error('서버 응답 상태 코드 (운동 횟수):', response.status, response.statusText);
        throw new Error('운동 횟수 데이터를 가져오는 데 실패했습니다.');
      }
  
      const data = await response.json();
      console.log('서버 응답 데이터 (운동 횟수):', JSON.stringify(data, null, 2));
  
      // 최근 7일의 날짜 생성
      const today = dayjs();
      const last7Days = Array.from({ length: 7 }, (_, i) =>
        today.subtract(6 - i, 'day').format('YYYY-MM-DD') // 최근 7일 날짜 배열
      );
  
      // 데이터 매핑: 날짜 기준으로 운동 횟수 추가, 없는 날은 0으로 설정
      const mappedData = last7Days.map((date) => {
        const found = data.find((item) => item._id === date);
        return {
          date,
          count: found ? found.workoutCount : 0, // 등록되지 않은 날은 0으로 설정
        };
      });
  
      console.log('최근 7일 데이터:', mappedData);
      setWeeklyWorkoutCounts(mappedData); // 상태에 저장
    } catch (error) {
      console.error('운동 횟수 데이터 가져오기 오류:', error.message);
      Alert.alert('Error', '운동 횟수 데이터를 불러오지 못했습니다.');
    }
  };
  
  useEffect(() => {
    fetchTotalWorkoutStats();
    fetchWeeklyWorkoutCounts();
  }, []);

  useEffect(() => {
    fetchVolumeData();
  }, [selectedPeriod]); // 기간 변경 시 데이터 다시 요청
  

  const totalHours = (totalWorkoutTime / 60).toFixed(2); // 총 시간 (시간 단위)

  // 볼륨
  const fetchVolumeData = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        Alert.alert('Error', '로그인이 필요합니다.');
        navigation.navigate('Login');
        return;
      }

      const url = `${CONFIG.API_BASE_URL}/statistic/workout/volume?period=day`;
      console.log('볼륨 데이터 요청 URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('볼륨 데이터를 가져오는 데 실패했습니다.');
      }

      const data = await response.json();
      console.log('볼륨 데이터 응답:', JSON.stringify(data, null, 2));

      // 상태 업데이트
      setVolumeData(data.volumeData || []);

      // 시작 날짜와 최근 날짜 설정
      if (data.volumeData && data.volumeData.length > 0) {
        setStartDate(dayjs(data.volumeData[0].date).format('YYYY-MM-DD'));
        setEndDate(dayjs(data.volumeData[data.volumeData.length - 1].date).format('YYYY-MM-DD'));
      }
    } catch (error) {
      console.error('볼륨 데이터 가져오기 오류:', error.message);
      Alert.alert('Error', '볼륨 데이터를 불러오지 못했습니다.');
    }
  };

  const renderDailyWorkoutChart = () => {
    if (weeklyWorkoutCounts.length === 0) {
      return <Text style={{ textAlign: 'center', color: '#888', fontSize: 14 }}>운동 데이터가 없습니다.</Text>;
    }
  
    // 최근 7일 데이터 매핑
    const barChartData = weeklyWorkoutCounts.map((entry) => ({
      value: entry.count,
      label: dayjs(entry.date).format('MM/DD'),
    }));
  
    
    return (
      <View style={{ paddingHorizontal: 4 }}>
        <BarChart
          data={barChartData}
          height={60} // 차트 높이
          width={500} // 차트 너비 고정
          barWidth={20} // 막대 너비
          barBorderRadius={4} // 막대 모서리
          frontColor={'#008080'} // 막대 색상
          yAxisLabelTexts={['0', '1']} // Y축 라벨
          yAxisLabelWidth={20} // Y축 라벨 너비
          yAxisTextStyle={{
            color: '#888',
            fontSize: 16,
          }}
          xAxisLabelTextStyle={{
            color: '#000',
            fontSize: 12,
            fontWeight: '500',
          }}
          xAxisThickness={1} // X축 두께
          xAxisColor={'#D9D9D9'} // X축 색상
          yAxisThickness={0} // Y축 두께
          yAxisColor={'#D9D9D9'} // Y축 색상
          noOfSections={1} // Y축 구간
          maxValue={1} // Y축 최대값
          spacing={23} // 막대 간격
          hideRules={false} // 규칙선 표시
          rulesColor={'#D9D9D9'} // 규칙선 색상
          rulesThickness={1} // 규칙선 두께
          backgroundColor={'#FFFFFF'} // 배경색
        />
      </View>
    );
  };
  
  
  
  const renderVolumeChart = () => {
    if (volumeData.length === 0) {
      return <Text style={styles.noDataText}>볼륨 데이터가 없습니다.</Text>;
    }
  
    const labels = volumeData.map((entry) => dayjs(entry.date).format('YY-MM-DD')); // 날짜 형식
    const volumes = volumeData.map((entry) => entry.volume); // 볼륨 값
  
    return (
      <ScrollView horizontal contentContainerStyle={{ flexGrow: 1 }}>
        <LineChart
          data={{
            labels,
            datasets: [
              {
                data: volumes,
                color: (opacity = 1) => `rgba(0, 128, 128, ${opacity})`, // 선 색상 설정
                strokeWidth: 2, // 선 굵기
              },
            ],
          }}
          width={Math.max(300, labels.length * 50)} // 그래프 너비
          height={220} // 그래프 높이
          yAxisSuffix="kg" // Y축 단위
          fromZero={true} // Y축 0부터 시작
          chartConfig={{
            backgroundColor: '#FFFFFF',
            backgroundGradientFrom: '#FFFFFF',
            backgroundGradientTo: '#FFFFFF',
            decimalPlaces: 0, // 소수점 제거
            color: (opacity = 1) => `rgba(0, 128, 128, ${opacity})`, // 선 색상
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // 축 라벨 색상
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '4',
              strokeWidth: '2',
              stroke: '#008080', // 점 외곽선 색상
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
  

  return (
    <View style={styles.container}>
      <Navbar />
      <TabNavigation activeTab="운동" onTabPress={handleTabPress} />
      
      <ContentWrapper>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}>
        {/* 총 통계 제목 */}
        <Text style={styles.sectionTitle}>평균 통계</Text>
        
        {/* 총 통계 섹션 */}
        <View style={styles.statsSection}>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{totalDays}</Text>
              <Text style={styles.statLabel}>운동 일 수</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{totalHours}</Text>
              <Text style={styles.statLabel}>시간 (분)</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{totalVolume}</Text>
              <Text style={styles.statLabel}>볼륨 (kg)</Text>
            </View>
          </View>
        </View>
        
        {/* 주당 운동 횟수 */}
        <Text style={styles.sectionTitle}>운동 여부</Text>
        <View style={styles.statsSection}>
        <Text style={styles.subTitle}>
          최근 7일간의 운동 여부를 Check해 보세요
        </Text>
        {renderDailyWorkoutChart()}
        </View>

        {/* 버튼 섹션 */}
        <Text style={styles.sectionTitle}>볼륨 변화 추이</Text>
        <View style={styles.statsSection}>
        <Text style={{ textAlign: 'center', marginVertical: 10, fontSize: 14, color: '#555' }}>
        {startDate} ~ {endDate} 까지의 기록입니다.
      </Text>
  

        {renderVolumeChart()}
        </View>
        </ScrollView>
      </ContentWrapper>
    
    </View>
  );
};

export default StaticsMainScreen;
