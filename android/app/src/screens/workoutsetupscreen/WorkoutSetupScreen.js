import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RoutineSetupScreen = ({ navigation }) => {
  const [routine, setRoutine] = useState('');

  const saveRoutine = async () => {
    try {
      await AsyncStorage.setItem('workoutRoutine', routine);
      navigation.goBack(); // 루틴 저장 후 이전 화면으로 돌아감
    } catch (error) {
      console.error('루틴 저장 중 오류 발생:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>운동 루틴 설정</Text>
      <TextInput
        style={styles.input}
        placeholder="루틴 이름을 입력하세요"
        value={routine}
        onChangeText={setRoutine}
      />
      <TouchableOpacity style={styles.saveButton} onPress={saveRoutine}>
        <Text style={styles.saveButtonText}>저장하기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    width: '100%',
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#008080',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RoutineSetupScreen;
