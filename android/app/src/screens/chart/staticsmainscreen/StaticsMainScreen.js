import React, { useState, useEffect } from 'react';
import { View, Text, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navbar from '../../../components/navbar/Navbar';
import styles from './StaticsMainScreenStyles';
import CONFIG from '../../../config';

const StaticsMainScreen = ({ navigation }) => {
  const [totalWorkoutTime, setTotalWorkoutTime] = useState(0); // 총 운동 시간 (분)
  const [totalDays, setTotalDays] = useState(0); // 총 운동 일수

  // 서버에서 총 운동 시간 및 일수 가져오기
  const fetchTotalWorkoutStats = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken'); // JWT 토큰 가져오기
      if (!token) {
        Alert.alert('Error', '로그인이 필요합니다.');
        navigation.navigate('Login');
        return;
      }

      const url = `${CONFIG.API_BASE_URL}/statistic/workout/total`;
      console.log('요청 URL:', url); // 요청 URL 로그

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
        throw new Error('서버에서 데이터를 가져오는 데 실패했습니다.');
      }

      const data = await response.json();
      console.log('서버 응답 데이터:', JSON.stringify(data, null, 2)); // 서버 응답 로그

      setTotalWorkoutTime(data.totalWorkoutTime || 0);
      setTotalDays(data.totalDays || 0);
    } catch (error) {
      console.error('운동 통계 가져오기 오류:', error.message); // 에러 로그
      Alert.alert('Error', '운동 통계 데이터를 불러오지 못했습니다.');
    }
  };

  useEffect(() => {
    fetchTotalWorkoutStats();
  }, []);

  const totalHours = (totalWorkoutTime / 60).toFixed(2); // 총 시간 (시간 단위)

  return (
    <View style={styles.container}>
      <Navbar />
      <View style={styles.tabContainer}>
        <Text style={styles.tabButtonActive}>운동</Text>
        <Text style={styles.tabButton}>식단</Text>
        <Text style={styles.tabButton}>체중</Text>
      </View>
      <View style={styles.contentWrapper}>
        {/* 요약 섹션 */}
        <View style={styles.summaryContainer}>
          <Text style={styles.totalWorkoutTime}>총 운동 시간: {totalHours}시간</Text>
          <Text style={styles.daysTracked}>기록한 날로부터 {totalDays}일간 운동하셨습니다.</Text>
        </View>

        {/* 버튼 섹션 */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.statButton}
            onPress={() => navigation.navigate('Volume')}
          >
            <Text style={styles.statButtonText}>볼륨</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statButton}>
            <Text style={styles.statButtonText}>종목별 최고 무게</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statButton}>
            <Text style={styles.statButtonText}>총 반복 수</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statButton}>
            <Text style={styles.statButtonText}>총 세트 수</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statButton}>
            <Text style={styles.statButtonText}>운동 횟수</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default StaticsMainScreen;
