import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navbar from '../../../components/navbar/Navbar';
import Footer from '../../../components/footer/Footer';
import styles from './VolumeScreenStyles';
import CONFIG from '../../../config';

const screenWidth = Dimensions.get('window').width;

const VolumeScreen = ({ navigation }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('day'); // 기본값: 일간
  const [chartData, setChartData] = useState(null); // 차트 데이터 상태
  const [summary, setSummary] = useState({ total: 0, average: 0 }); // 요약 데이터

  // API 호출 함수
  const fetchWorkoutStats = async (period) => {
    const url = `${CONFIG.API_BASE_URL}/statistic/workout?period=${period}`;
    console.log('요청 URL:', url); // 요청 URL 로그

    try {
      const token = await AsyncStorage.getItem('jwtToken'); // 토큰 가져오기
      if (!token) {
        Alert.alert('Error', '로그인이 필요합니다.');
        navigation.navigate('Login');
        return;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // 토큰 추가
        },
      });

      console.log('응답 상태 코드:', response.status); // 응답 상태 코드 로그

      if (!response.ok) {
        console.error('서버 응답 상태 코드:', response.status, response.statusText);
        throw new Error('서버 응답 오류');
      }

      const data = await response.json();
      console.log('서버 응답 데이터:', data); // 서버 응답 데이터 로그

      // 서버에서 받은 데이터를 차트 형식으로 변환
      const labels = data.map((item) => item._id); // 기간에 따른 라벨 (예: 날짜/주/월)
      const values = data.map((item) => item.totalVolume); // **총 볼륨 사용**
      const total = values.reduce((sum, value) => sum + value, 0); // 총 볼륨 계산
      const average = total / values.length; // 평균 볼륨 계산

      setChartData({ labels, datasets: [{ data: values }] });
      setSummary({ total, average });
    } catch (error) {
      Alert.alert('Error', '운동 통계 데이터를 불러오지 못했습니다.');
      console.error('운동 통계 데이터 가져오기 오류:', error.message); // 에러 메시지 로그
    }
  };

  // 선택한 기간에 따라 데이터 로드
  useEffect(() => {
    fetchWorkoutStats(selectedPeriod);
  }, [selectedPeriod]);

  return (
    <View style={styles.container}>
      <Navbar />

      {/* 운동, 식단, 체중 탭 */}
      <View style={styles.tabContainer}>
        <Text style={styles.tabButtonActive}>운동</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Diet')}>
          <Text style={styles.tabButton}>식단</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Weight')}>
          <Text style={styles.tabButton}>체중</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contentWrapper}>
        {/* 상단 제목 */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>볼륨</Text>
        </View>

        {/* 차트 섹션 */}
        <ScrollView>
          <View style={styles.chartContainer}>
            {chartData && (
              <BarChart
                data={chartData}
                width={screenWidth - 40}
                height={220}
                chartConfig={{
                  backgroundColor: '#FFF',
                  backgroundGradientFrom: '#FFF',
                  backgroundGradientTo: '#FFF',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(0, 128, 128, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                style={styles.chart}
              />
            )}
          </View>

          {/* 기간 버튼 */}
          <View style={styles.periodContainer}>
            {['day', 'week', 'month', 'year'].map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.periodButton,
                  selectedPeriod === period && styles.periodButtonActive,
                ]}
                onPress={() => setSelectedPeriod(period)}
              >
                <Text
                  style={[
                    styles.periodButtonText,
                    selectedPeriod === period && styles.periodButtonTextActive,
                  ]}
                >
                  {period === 'day' ? '일간' : period === 'week' ? '주간' : period === 'month' ? '월간' : '연간'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* 요약 섹션 */}
          <View style={styles.summaryBox}>
            <Text style={styles.summaryText}>총 볼륨: {summary.total.toFixed(2)}kg</Text>
            <Text style={styles.summaryText}>평균 볼륨: {summary.average.toFixed(2)}kg</Text>
          </View>
        </ScrollView>
      </View>
      <Footer />
    </View>
  );
};

export default VolumeScreen;
