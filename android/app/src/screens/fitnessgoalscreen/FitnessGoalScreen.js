import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, TouchableOpacity,Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // JWT 토큰 저장용
import styles from './FitnessGoalScreenStyles';
import CONFIG from '../../config';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import EditModal from '../../components/modal/fitnessgoal/EditModal';
import ConfettiCannon from 'react-native-confetti-cannon'; // 축하 애니메이션 라이브러리



const FitnessGoalScreen = ({ navigation }) => {
  const [bmr, setBMR] = useState(0);
  const [tdee, setTDEE] = useState(0);
  const [recommended_protein, setRecommendedProtein] = useState(0);
  const [recommended_fat, setRecommendedFat] = useState(0);
  const [recommended_carbs, setRecommendedCarbs] = useState(0);
  const [weeksToGoal, setWeeksToGoal] = useState(0);
  const [targetCalories, setTargetCalories] = useState(0);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalFields, setModalFields] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);

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
        setShowConfetti(true); 
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

  // 완료 버튼을 눌렀을 때 Main 화면으로 이동
  const handleComplete = async () => {
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/user/update-goals`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`, // JWT 토큰 포함
        },
        body: JSON.stringify({
          target_calories: targetCalories,        // 목표 칼로리
          recommended_protein: recommended_protein, // 추천 단백질
          recommended_fat: recommended_fat,        // 추천 지방
          recommended_carbs: recommended_carbs,    // 추천 탄수화물
        }),
      });
  
      if (response.ok) {
        console.log('Goals updated successfully!');
        navigation.navigate('Welcome'); // Main 화면으로 이동
      } else {
        console.error('Failed to update goals:', response.status);
        Alert.alert('오류', '목표를 업데이트하는 데 실패했습니다.');
      }
    } catch (error) {
      console.error('Error updating goals:', error);
      Alert.alert('오류', '목표를 업데이트하는 도중 오류가 발생했습니다.');
    }
  };
  
  

  const handleEdit = (type) => {
    if (type === 'calories') {
      setModalTitle('목표 칼로리 입력');
      setModalFields([
        {
          label: '목표 칼로리 (Kcal)',
          key: 'calories',
          value: String(targetCalories),
        },
      ]);
    } else if (type === 'macros') {
      setModalTitle('탄단지 직접 입력');
      setModalFields([
        { label: '탄수화물 (g)', key: 'carbs', value: String(recommended_carbs) },
        { label: '단백질 (g)', key: 'protein', value: String(recommended_protein) },
        { label: '지방 (g)', key: 'fat', value: String(recommended_fat) },
      ]);
    }
    setModalVisible(true);
  };

  const handleFieldChange = (key, value) => {
    const updatedFields = modalFields.map((field) =>
      field.key === key ? { ...field, value } : field
    );
    setModalFields(updatedFields);
  };

  const handleSubmit = () => {
    modalFields.forEach((field) => {
      if (field.key === 'calories') setTargetCalories(Number(field.value));
      if (field.key === 'carbs') setRecommendedCarbs(Number(field.value));
      if (field.key === 'protein') setRecommendedProtein(Number(field.value));
      if (field.key === 'fat') setRecommendedFat(Number(field.value));
    });
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {showConfetti && (
        <ConfettiCannon
          count={200} 
          origin={{ x: -10, y: 0 }} 
          fadeOut={true} 
          explosionSpeed={350} 
          autoStart={true}
          onAnimationEnd={() => setShowConfetti(false)} // 애니메이션 종료 후 상태 초기화
        />
      )}
  
    {/* 뒤로 가기 버튼 */}
    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
      <Icon name="arrow-left" size={24} color="#008080" />
    </TouchableOpacity>

  {/* 내 목표 */}
  <View style={styles.goalContainer}>
    <Text style={styles.congratsText}>🎉 목표가 설정되었습니다!</Text>
    <View style={styles.rowContainer}>
      <Text style={styles.title}>내 목표 
        <Text style={styles.subtitle}> 달성까지 약 {weeksToGoal}주 걸려요.</Text>
      </Text>
      
      <TouchableOpacity onPress={() => handleEdit('calories')} style={styles.editButton}>
        <Icon name="edit" size={16} color="#008080" />
        <Text style={styles.editButtonText}>직접 수정</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.caloriesContainer}>
      <Text style={styles.caloriesText}>내 기초대사량 : {bmr} kcal</Text>
      <Text style={styles.caloriesText}>내 활동대사량 : {tdee} kcal</Text>
      <View style={styles.separator} />
      <Text style={styles.targetCaloriesText}>🔥 내 목표 칼로리 : {Math.round(targetCalories)} kcal</Text>
    </View>
  </View>

  {/* 추천 탄단지 비율 */}
  <View style={styles.macroContainer}>
  <View style={styles.rowContainer}>
    <Text style={styles.title}>추천 탄단지 비율</Text>
    <TouchableOpacity onPress={() => handleEdit('macros')} style={styles.editButton}>
        <Icon name="edit" size={16} color="#008080" />
        <Text style={styles.editButtonText}>직접 수정</Text>
    </TouchableOpacity>
  </View>
  <View style={styles.borderBox}>
    <View style={styles.macroRow}>
      <View>
        <Text style={styles.macroLabel}>탄수화물</Text>
        <Text style={styles.macroValue}>{recommended_carbs}g</Text>
      </View>
      <View>
        <Text style={styles.macroKcal}>{Math.round(recommended_carbs * 4)}kcal</Text>
        <Text style={styles.macroPercentage}>({Math.round(carbPercentage)}%)</Text>
      </View>
    </View>
    <View style={styles.macroRow}>
      <View>
        <Text style={styles.macroLabel}>단백질</Text>
        <Text style={styles.macroValue}>{recommended_protein}g</Text>
      </View>
      <View>
        <Text style={styles.macroKcal}>{Math.round(recommended_protein * 4)}kcal</Text>
        <Text style={styles.macroPercentage}>({Math.round(proteinPercentage)}%)</Text>
      </View>
    </View>
    <View style={styles.lastMacroRow}>
      <View>
        <Text style={styles.macroLabel}>지방</Text>
        <Text style={styles.macroValue}>{recommended_fat}g</Text>
      </View>
      <View>
        <Text style={styles.macroKcal}>{Math.round(recommended_fat * 9)}kcal</Text>
        <Text style={styles.macroPercentage}>({Math.round(fatPercentage)}%)</Text>
      </View>
    </View>
  </View>
</View>
<EditModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={modalTitle}
        fields={modalFields}
        onFieldChange={handleFieldChange}
        onSubmit={handleSubmit}
      />
<View style={styles.finalCompleteButtonContainer}>
        <TouchableOpacity style={styles.finalCompleteButton} onPress={handleComplete}>
          <Text style={styles.finalCompleteButtonText}>완료</Text>
        </TouchableOpacity>
      </View>
</View>

    
  );
};

export default FitnessGoalScreen;
