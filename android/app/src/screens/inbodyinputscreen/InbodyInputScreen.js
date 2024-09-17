import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './InbodyInputScreenStyles';
import CONFIG from '../../config';

const InbodyInputScreen = ({ navigation }) => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [exerciseFrequency, setExerciseFrequency] = useState('');

  const handleSubmit = async () => {
    const userInfo = {
      height: parseFloat(height),
      weight: parseFloat(weight),
      gender,
      birthdate,
      targetWeight: parseFloat(targetWeight),
      exerciseFrequency,
    };

    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
        <Picker.Item label="거의 안함" value="거의 안함" />
        <Picker.Item label="가끔 함" value="가끔 함" />
        <Picker.Item label="주 1~2회" value="주 1~2회" />
        <Picker.Item label="주 3~4회" value="주 3~4회" />
        <Picker.Item label="주 5회 이상" value="주 5회 이상" />
      </Picker>

      <Button title="다음" onPress={handleSubmit} />
    </View>
  );
};

export default InbodyInputScreen;
