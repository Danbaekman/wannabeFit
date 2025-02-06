import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import styles from './InbodyInputScreenStyles';
import CONFIG from '../../config';
import Modal from 'react-native-modal'; // 모달 컴포넌트 임포트
import AsyncStorage from '@react-native-async-storage/async-storage'; // JWT 토큰 저장용
import GoalSelectionModal from '../../components/modal/inbodyinput/GoalSelectionModal';

const InbodyInputScreen = ({ navigation }) => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [birthdateValid, setBirthdateValid] = useState(true);
  const [targetWeight, setTargetWeight] = useState('');
  const [exerciseFrequency, setExerciseFrequency] = useState('');
  const [goal, setGoal] = useState(''); // 운동 목표
  const [modalVisible, setModalVisible] = useState(false); // 모달창 제어
  const [jwtToken, setJwtToken] = useState(''); // JWT 토큰 저장

  // AsyncStorage에서 JWT 토큰을 불러오는 함수
  useEffect(() => {
    const getToken = async () => {
      try {
        const token = await AsyncStorage.getItem('jwtToken');
        if (token) {
          setJwtToken(token);
        }
      } catch (error) {
        console.error('Failed to retrieve JWT token from storage:', error);
      }
    };

    getToken();
  }, []);

  // 생년월일 입력 시 자동으로 "-" 추가하는 함수
  const formatBirthdate = (text) => {
    // 숫자만 입력받기
    let cleaned = text.replace(/\D/g, '');

    // 최대 8자리까지만 입력 가능 (YYYYMMDD)
    if (cleaned.length > 8) {
      cleaned = cleaned.slice(0, 8);
    }

    let formatted = '';
    if (cleaned.length <= 4) {
      formatted = cleaned;
    } else if (cleaned.length <= 6) {
      formatted = `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
    } else {
      formatted = `${cleaned.slice(0, 4)}-${cleaned.slice(4, 6)}-${cleaned.slice(6)}`;
    }

    setBirthdate(formatted);
    setBirthdateValid(cleaned.length === 8); // 정확한 8자리 입력 시 유효한 값으로 판단
  };

  // "다음" 버튼을 눌렀을 때 모달창 열기
  const handleNextButton = () => {
    setModalVisible(true);
  };

  // 모달에서 운동 목표를 선택
  const selectGoal = (selectedGoal) => {
    setGoal(selectedGoal);
  };

  const handleSubmit = async () => {
    setModalVisible(false); // 완료 버튼을 눌렀을 때 모달 닫기

    const userInfo = {
      gender: gender === '남자' ? 'M' : 'F',
      height: parseFloat(height),
      weight: parseFloat(weight),
      birthdate,
      targetWeight: parseFloat(targetWeight),
      exerciseFrequency: parseInt(exerciseFrequency),
      goal, // 선택한 운동 목표 추가
    };

    console.log('전송할 데이터:', userInfo);
    console.log('전송할 JWT 토큰:', jwtToken);

    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`, // JWT 토큰 전송
        },
        body: JSON.stringify(userInfo),
      });

      if (response.ok) {
        console.log('User info submitted successfully!');
        navigation.navigate('FitnessGoal');
      } else {
        console.error('Failed to submit user info:', response.status);
        Alert.alert('오류', '사용자 정보를 제출하는 데 실패했습니다.');
      }
    } catch (error) {
      console.error('Error submitting user info:', error);
      Alert.alert('오류', '사용자 정보를 제출하는 도중 오류가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>인바디 정보 입력하기</Text>

      <Text style={styles.label}>키:</Text>
      <TextInput
        style={styles.input}
        value={height}
        onChangeText={(text) => setHeight(text)}
        placeholder="키를 입력하세요 (cm)"
        keyboardType="numeric"
      />

      <Text style={styles.label}>몸무게:</Text>
      <TextInput
        style={styles.input}
        value={weight}
        onChangeText={(text) => setWeight(text)}
        placeholder="몸무게를 입력하세요 (kg)"
        keyboardType="numeric"
      />

      <Text style={styles.label}>성별:</Text>
      <View style={styles.genderContainer}>
        <TouchableOpacity
          style={[styles.genderButton, gender === '남자' && styles.selectedGenderButton]}
          onPress={() => setGender('남자')}
        >
          <Icon name="male" size={20} color={gender === '남자' ? '#008080' : '#000'} />
          <Text style={[styles.genderButtonText, gender === '남자' && styles.selectedGenderText]}> 남자</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.genderButton, gender === '여자' && styles.selectedGenderButton]}
          onPress={() => setGender('여자')}
        >
          <Icon name="female" size={20} color={gender === '여자' ? '#008080' : '#000'} />
          <Text style={[styles.genderButtonText, gender === '여자' && styles.selectedGenderText]}> 여자</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>생년월일:</Text>
      <TextInput
        style={[styles.input, !birthdateValid && styles.inputError]} // 유효성 검사 실패 시 스타일 변경
        value={birthdate}
        onChangeText={formatBirthdate} // 자동으로 "-" 삽입
        placeholder="YYYY-MM-DD"
        keyboardType="numeric"
        maxLength={10} // YYYY-MM-DD 포함 최대 10자리 입력 가능
      />

      <Text style={styles.label}>목표 몸무게:</Text>
      <TextInput
        style={styles.input}
        value={targetWeight}
        onChangeText={(text) => setTargetWeight(text)}
        placeholder="목표 몸무게를 입력하세요 (kg)"
        keyboardType="numeric"
      />

      <Text style={styles.label}>운동 빈도:</Text>
      <View style={styles.pickerContainer}>
        {/* 기본값이 선택되지 않았을 때만 Placeholder 표시 */}
        {exerciseFrequency === null && (
          <Text style={styles.pickerPlaceholderText}>운동 빈도를 선택하세요</Text>
        )}

        <Picker
          selectedValue={exerciseFrequency}
          style={styles.picker}
          onValueChange={(itemValue) => setExerciseFrequency(itemValue)}
        >
          <Picker.Item label="거의 안함" value="0" />
          <Picker.Item label="가벼운 운동(1~3일/1주)" value="1" />
          <Picker.Item label="보통(3~5일/1주)" value="2" />
          <Picker.Item label="적극적인 운동(6~7일/1주)" value="3" />
          <Picker.Item label="매우 적극적인 운동(운동선수)" value="4" />
        </Picker>
      </View>

      {/* 운동 목표 선택 버튼 */}
      <TouchableOpacity style={styles.nextButton} onPress={handleNextButton}>
        <Text style={styles.nextButtonText}>다음</Text>
      </TouchableOpacity>

      {/* 운동 목표 선택 모달 */}
      <GoalSelectionModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        selectGoal={setGoal}
        goal={goal}
        handleSubmit={handleSubmit}
      />
    </View>
  );
};

export default InbodyInputScreen;
