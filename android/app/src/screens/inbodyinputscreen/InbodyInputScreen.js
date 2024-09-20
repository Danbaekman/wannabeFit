import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import styles from './InbodyInputScreenStyles';
import CONFIG from '../../config';
import Modal from 'react-native-modal'; // 모달 컴포넌트 임포트

const InbodyInputScreen = ({ navigation, route }) => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [exerciseFrequency, setExerciseFrequency] = useState('');
  const [goal, setGoal] = useState(''); // 운동 목표
  const [modalVisible, setModalVisible] = useState(false); // 모달창 제어

  // NaverLoginButton.js에서 전달 받은 accessToken사용
  const { accessToken } = route.params;

  // "다음" 버튼을 눌렀을 때 모달창 열기
  const handleNextButton = () => {
    setModalVisible(true);
  };

  // 모달에서 운동 목표를 선택하고, 서버로 데이터를 전송
  const selectGoal = (selectedGoal) => {
    setGoal(selectedGoal);
  };

  const handleSubmit = async () => {
    setModalVisible(false); // 완료 버튼을 눌렀을 때 모달 닫기

    const userInfo = {
      height: parseFloat(height),
      weight: parseFloat(weight),
      gender: gender === '남자' ? 'M' : 'F',
      birthdate,
      targetWeight: parseFloat(targetWeight),
      exerciseFrequency: parseInt(exerciseFrequency), //Picker 컴포넌트의 value 속성은 항상 문자열 형태로 값을 전달(따라서 int형으로 변환 필요)
      goal, // 선택한 운동 목표 추가
    };

    console.log('전송할 데이터:', userInfo);
    console.log('전송할 액세스 토큰:', accessToken);

    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(userInfo),
      });

      if (response.ok) {
        console.log('User info submitted successfully!');
        navigation.navigate('Main');
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
          <Text style={[styles.genderButtonText, gender === '남자' && styles.selectedGenderText]}>남자</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.genderButton, gender === '여자' && styles.selectedGenderButton]}
          onPress={() => setGender('여자')}
        >
          <Icon name="female" size={20} color={gender === '여자' ? '#008080' : '#000'} />
          <Text style={[styles.genderButtonText, gender === '여자' && styles.selectedGenderText]}>여자</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>생년월일:</Text>
      <TextInput
        style={styles.input}
        value={birthdate}
        onChangeText={(text) => setBirthdate(text)}
        placeholder="생년월일을 입력하세요 (예: 1990-01-01)"
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
      <Picker
        selectedValue={exerciseFrequency}
        style={styles.picker}
        onValueChange={(itemValue) => setExerciseFrequency(itemValue)}
      >
        <Picker.Item label="운동 빈도를 선택하세요" value="" />
        <Picker.Item label="거의 안함" value="0" />
        <Picker.Item label="가벼운 운동(1~3일/1주)" value="1" />
        <Picker.Item label="보통(3~5일/1주)" value="2" />
        <Picker.Item label="적극적인 운동(6~7일/1주)" value="3" />
        <Picker.Item label="매우 적극적인 운동(운동선수)" value="4" />
      </Picker>

      {/* 운동 목표 선택 버튼 */}
      <Button title="다음" onPress={handleNextButton} />

      {/* 운동 목표 선택 모달 */}
      <Modal 
        isVisible={modalVisible} 
        onBackdropPress={() => setModalVisible(false)} 
        backdropColor="black"
        backdropOpacity={0.5}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>나의 운동 목적은?</Text>
          <Text style={styles.modalSubtitle}>목적에 맞춰 식단과 운동법을 추천드립니다.</Text>

          {/* 벌크업 선택 */}
          <TouchableOpacity onPress={() => selectGoal('bulk')}>
            <View style={styles.modalOption}>
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons name="weight-lifter" size={30} color="#008080" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.modalText}>벌크업</Text>
                <Text style={styles.modalDescription}>단백질과 탄수화물의 비율</Text>
              </View>
              <View style={[styles.checkCircle, goal === 'bulk' ? styles.checkCircleSelected : null]} />
            </View>
          </TouchableOpacity>

          {/* 다이어트 선택 */}
          <TouchableOpacity onPress={() => selectGoal('diet')}>
            <View style={styles.modalOption}>
              <View style={styles.iconCircle}>
                <FontAwesome5 name="running" size={30} color="#008080" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.modalText}>다이어트</Text>
                <Text style={styles.modalDescription}>단백질은 높게, 탄수는 낮게</Text>
              </View>
              <View style={[styles.checkCircle, goal === 'diet' ? styles.checkCircleSelected : null]} />
            </View>
          </TouchableOpacity>

          {/* 유지 선택 */}
          <TouchableOpacity onPress={() => selectGoal('maintain')}>
            <View style={styles.modalOption}>
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons name="walk" size={30} color="#008080" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.modalText}>유지</Text>
                <Text style={styles.modalDescription}>균형잡힌 구성</Text>
              </View>
              <View style={[styles.checkCircle, goal === 'maintain' ? styles.checkCircleSelected : null]} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSubmit} style={styles.completeButton}>
            <Text style={styles.completeButtonText}>완료</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default InbodyInputScreen;