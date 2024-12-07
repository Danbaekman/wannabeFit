import React, { useState, useEffect } from 'react';
import { View, Text, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import Navbar from '../../../components/navbar/Navbar';
import styles from './TopRepsScreenStyles';
import CONFIG from '../../../config';
import ContentWrapper from '../../../components/contentwrapper/ContentWrapper';

const TotalRepsScreen = ({ navigation }) => {
  const [totalRepsData, setTotalRepsData] = useState([]); // 날짜별 총 반복 수 데이터
  const screenWidth = Dimensions.get('window').width;

  // 서버에서 날짜별 총 반복 수 데이터 가져오기
  const fetchTotalRepsData = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        Alert.alert('Error', '로그인이 필요합니다.');
        navigation.navigate('Login');
        return;
      }

      const url = `${CONFIG.API_BASE_URL}/statistic/daily-reps`; // API 엔드포인트
      console.log('총 반복 수 요청 URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('응답 상태 코드:', response.status);

      if (!response.ok) {
        console.error('서버 응답 상태 코드:', response.status, response.statusText);
        throw new Error('총 반복 수 데이터를 가져오는 데 실패했습니다.');
      }

      const data = await response.json();
      console.log('총 반복 수 데이터:', JSON.stringify(data, null, 2));

      // _id가 날짜이고 totalReps가 총 반복 수임을 가정
      setTotalRepsData(
        data.map((item) => ({
          date: item._id, // 날짜
          totalReps: item.totalReps, // 총 반복 수
        }))
      );
    } catch (error) {
      console.error('총 반복 수 데이터 가져오기 오류:', error.message);
      Alert.alert('Error', '총 반복 수 데이터를 불러오지 못했습니다.');
    }
  };

  useEffect(() => {
    fetchTotalRepsData();
  }, []);

  return (
    <View style={styles.container}>
      <Navbar />
      <ContentWrapper>
        <Text style={styles.sectionTitle}>날짜별 총 반복 수</Text>
        <ScrollView>
          {totalRepsData.length > 0 && (
            <BarChart
              data={{
                labels: totalRepsData.map((item) => item.date), // 날짜
                datasets: [{ data: totalRepsData.map((item) => item.totalReps) }], // 총 반복 수
              }}
              width={screenWidth - 40}
              height={220}
              chartConfig={{
                backgroundColor: '#FFFFFF',
                backgroundGradientFrom: '#FFFFFF',
                backgroundGradientTo: '#FFFFFF',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 128, 128, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              style={styles.chart}
            />
          )}
        </ScrollView>
      </ContentWrapper>
    </View>
  );
};

export default TotalRepsScreen;
