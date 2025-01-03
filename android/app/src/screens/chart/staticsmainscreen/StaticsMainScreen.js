import React, { useState, useEffect } from 'react';
import { View, Text, Alert, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import Navbar from '../../../components/navbar/Navbar';
import styles from './StaticsMainScreenStyles';
import CONFIG from '../../../config';
import TabNavigation from '../../../components/tabnavigation/TabNavigation';
import ContentWrapper from '../../../components/contentwrapper/ContentWrapper';

const StaticsMainScreen = ({ navigation }) => {
  const [totalWorkoutTime, setTotalWorkoutTime] = useState(0); // 총 운동 시간 (분)
  const [totalDays, setTotalDays] = useState(0); // 총 운동 일수
  const [totalVolume, setTotalVolume] = useState(0); // 총 볼륨
  const [weeklyWorkoutCounts, setWeeklyWorkoutCounts] = useState([]); // 주당 운동 횟수 데이터

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

      const url = `${CONFIG.API_BASE_URL}/statistic/weekly`;
      console.log('주당 운동 데이터 요청 URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('응답 상태 코드 (Weekly):', response.status);

      if (!response.ok) {
        console.error('서버 응답 상태 코드 (Weekly):', response.status, response.statusText);
        throw new Error('주당 운동 데이터 가져오기 실패');
      }

      const data = await response.json();
      console.log('서버 응답 데이터 (Weekly):', JSON.stringify(data, null, 2));

      // _id가 문자열인지 확인하고 변환
      setWeeklyWorkoutCounts(
        data.map((item) => ({
          date: typeof item._id === 'string' ? item._id : item._id.toString(),
          count: item.workoutCount || 0,
        }))
      );
    } catch (error) {
      console.error('주당 운동 데이터 가져오기 오류 (Weekly):', error.message);
      Alert.alert('Error', '주당 운동 데이터를 불러오지 못했습니다.');
    }
  };

  useEffect(() => {
    fetchTotalWorkoutStats();
    fetchWeeklyWorkoutCounts();
  }, []);

  const totalHours = (totalWorkoutTime / 60).toFixed(2); // 총 시간 (시간 단위)

  return (
    <View style={styles.container}>
      <Navbar />
      <TabNavigation activeTab="운동" onTabPress={handleTabPress} />
      <ContentWrapper>
        {/* 총 통계 제목 */}
        <Text style={styles.sectionTitle}>총 통계</Text>
        
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
        <Text style={styles.sectionTitle}>주당 운동 횟수</Text>
        <View style={styles.statsSection}>
          <ScrollView>
            {weeklyWorkoutCounts.length > 0 && (
              <BarChart
              data={{
                labels: Array.from({ length: 7 }, (_, i) => {
                  const date = new Date();
                  date.setDate(date.getDate() + i * 7); // 현재 날짜부터 7일 간격
                  return `${date.getMonth() + 1}/${date.getDate()}`; // MM/DD 형식
                }),
                datasets: [
                  {
                    data: weeklyWorkoutCounts.map((item) => item.count), // 운동 횟수 데이터
                  },
                ],
              }}
              width={screenWidth - 40} // 그래프 너비
              height={220} // 그래프 높이
              fromZero={true} // Y축 0부터 시작
              yAxisInterval={1} // Y축 간격 설정
              chartConfig={{
                backgroundColor: '#FFFFFF',
                backgroundGradientFrom: '#FFFFFF',
                backgroundGradientTo: '#FFFFFF',
                decimalPlaces: 0, // 소수점 제거
                color: (opacity = 1) => `rgba(0, 128, 128, ${opacity})`, // 바 색상
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // 축 라벨 색상
              }}
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
              verticalLabelRotation={0} // X축 라벨 회전
            />
            
            
            )}
          </ScrollView>
        </View>

        {/* 버튼 섹션 */}
        <Text style={styles.sectionTitle}>통계 더 보기</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.statButton}
            onPress={() => navigation.navigate('Volume')}
          >
            <Text style={styles.statButtonText}>볼륨</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.statButton}
            onPress={() => navigation.navigate('TopReps')}>
            <Text style={styles.statButtonText}>총 반복 수</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.statButton}
            onPress={() => navigation.navigate('TotalSets')}>
            <Text style={styles.statButtonText}>총 세트 수</Text>
          </TouchableOpacity>
        </View>
      </ContentWrapper>
    </View>
  );
};

export default StaticsMainScreen;
