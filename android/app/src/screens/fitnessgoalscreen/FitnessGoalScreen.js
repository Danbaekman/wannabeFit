import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // JWT 토큰 저장용
import styles from './FitnessGoalScreenStyles';
import CONFIG from '../../config';

const FitnessGoalScreen = () => {
  const [bmr, setBMR] = useState(0);
  const [tdee, setTDEE] = useState(0);
  const [recommended_protein, setRecommendedProtein] = useState(0);
  const [recommended_fat, setRecommendedFat] = useState(0);
  const [recommended_carbs, setRecommendedCarbs] = useState(0);
  const [weeksToGoal, setWeeksToGoal] = useState(0);
  const [targetCalories, setTargetCalories] = useState(0);
  const [loading, setLoading] = useState(true);

  // JWT 토큰 저장을 위한 상태
  const [jwtToken, setJwtToken] = useState('');

  // JWT 토큰 가져오기
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await AsyncStorage.getItem('jwtToken');
        if (token) {
          setJwtToken(token);
          console.log('JWT 토큰 가져오기 성공:', token);
        }
      } catch (error) {
        console.error('JWT 토큰 가져오기 실패:', error);
      }
    };

    fetchToken();
  }, []);

  // 백엔드에서 데이터 가져오기
  useEffect(() => {
    const fetchFitnessGoalData = async () => {
      try {
        console.log('서버에서 fitness goal data 가져오는 중...');

        const response = await fetch(`${CONFIG.API_BASE_URL}/user`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`, // JWT 토큰을 Authorization 헤더에 추가
          },
        });

        const data = await response.json();
        console.log('백엔드에서 응답 성공', data);

        // 백엔드로부터 받은 데이터를 상태에 저장
        setBMR(data.bmr);
        setTDEE(data.tdee);
        setRecommendedProtein(data.recommended_protein);
        setRecommendedFat(data.recommended_fat);
        setRecommendedCarbs(data.recommended_carbs);
        setWeeksToGoal(data.weeksToGoal);
        setTargetCalories(data.target_calories);
        setLoading(false); // 데이터 로딩 완료
      } catch (error) {
        console.error('데이터 가져오기 오류:', error);
        setLoading(false); // 오류 발생 시 로딩 상태 종료
      }
    };

    // JWT 토큰이 있을 때만 데이터 요청
    if (jwtToken) {
      fetchFitnessGoalData();
    }
  }, [jwtToken]);  // jwtToken이 설정된 후 데이터 요청

  if (loading) {
    return <ActivityIndicator size="large" color="#008080" />; // 로딩 중 표시
  }

  // 전체 칼로리 계산
  const totalCalories = (recommended_carbs * 4) + (recommended_protein * 4) + (recommended_fat * 9);

  // 각 영양소의 비율 계산
  const carbPercentage = ((recommended_carbs * 4) / totalCalories) * 100;
  const proteinPercentage = ((recommended_protein * 4) / totalCalories) * 100;
  const fatPercentage = ((recommended_fat * 9) / totalCalories) * 100;

  return (
    <View style={styles.container}>
      {/* 내 목표 */}
      <View style={styles.goalContainer}>
        <View style={styles.goalHeader}>
          <Text style={styles.title}>내 목표</Text>
          <Text style={styles.subtitle}>달성까지 약 {weeksToGoal}주 걸려요.</Text>
        </View>

        <View style={styles.caloriesContainer}>
          <Text style={styles.caloriesText}>내 기초대사량 : {bmr} kcal</Text>
          <Text style={styles.caloriesText}>내 활동대사량 : {tdee} kcal</Text>
          <View style={styles.separator} />
          <Text style={styles.targetCaloriesText}>🔥 내 목표 칼로리 : {targetCalories}kcal</Text>
        </View>

        <Button title="목표 수정" onPress={() => {}} color="#008080" />
      </View>

      {/* 추천 탄단지 비율 */}
      <View style={styles.macroContainer}>
        <Text style={styles.title}>추천 탄단지 비율</Text>
        <View style={styles.macroRow}>
          <Text style={styles.macroLabel}>탄수화물</Text>
          <Text style={styles.macroValue}>{recommended_carbs}g</Text>
          <Text style={styles.macroKcal}>{Math.round(recommended_carbs * 4)}kcal ({Math.round(carbPercentage)}%)</Text>
        </View>
        <View style={styles.macroRow}>
          <Text style={styles.macroLabel}>단백질</Text>
          <Text style={styles.macroValue}>{recommended_protein}g</Text>
          <Text style={styles.macroKcal}>{Math.round(recommended_protein * 4)}kcal ({Math.round(proteinPercentage)}%)</Text>
        </View>
        <View style={styles.macroRow}>
          <Text style={styles.macroLabel}>지방</Text>
          <Text style={styles.macroValue}>{recommended_fat}g</Text>
          <Text style={styles.macroKcal}>{Math.round(recommended_fat * 9)}kcal ({Math.round(fatPercentage)}%)</Text>
        </View>
      </View>
    </View>
  );
};

export default FitnessGoalScreen;
