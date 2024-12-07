import React, { useState, useEffect } from 'react';
import { View, Text, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import Navbar from '../../../components/navbar/Navbar';
import styles from './TotalSetsScreenStyles';
import CONFIG from '../../../config';
import ContentWrapper from '../../../components/contentwrapper/ContentWrapper';

const TotalSetsScreen = ({ navigation }) => {
  const [totalSetsData, setTotalSetsData] = useState([]); // 날짜별 총 세트 수 데이터
  const screenWidth = Dimensions.get('window').width;

  // 서버에서 날짜별 총 세트 수 데이터 가져오기
  const fetchTotalSetsData = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        Alert.alert('Error', '로그인이 필요합니다.');
        navigation.navigate('Login');
        return;
      }

      const url = `${CONFIG.API_BASE_URL}/statistic/total-sets?period=day`;
      console.log('총 세트 수 요청 URL:', url);

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
        throw new Error('총 세트 수 데이터를 가져오는 데 실패했습니다.');
      }

      const data = await response.json();
      console.log('총 세트 수 데이터:', JSON.stringify(data, null, 2));

      // _id가 날짜이고 totalSets가 총 세트 수임을 가정
      setTotalSetsData(
        data.map((item) => ({
          date: item._id, // 날짜
          totalSets: item.totalSets, // 총 세트 수
        }))
      );
    } catch (error) {
      console.error('총 세트 수 데이터 가져오기 오류:', error.message);
      Alert.alert('Error', '총 세트 수 데이터를 불러오지 못했습니다.');
    }
  };

  useEffect(() => {
    fetchTotalSetsData();
  }, []);

  return (
    <View style={styles.container}>
      <Navbar />
      <ContentWrapper>
        <Text style={styles.sectionTitle}>날짜별 총 세트 수</Text>
        <ScrollView>
          {totalSetsData.length > 0 && (
            <BarChart
              data={{
                labels: totalSetsData.map((item) => item.date), // 날짜
                datasets: [{ data: totalSetsData.map((item) => item.totalSets) }], // 총 세트 수
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

export default TotalSetsScreen;
