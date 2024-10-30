// WorkoutSetupScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navbar from '../../components/navbar/Navbar';
import styles from './WorkoutSetupScreenStyles';
import Footer from '../../components/footer/Footer';

const WorkoutSetupScreen = ({ navigation }) => {
  const [hasRoutine, setHasRoutine] = useState(false);

  useEffect(() => {
    checkRoutine();
  }, []);

  const checkRoutine = async () => {
    try {
      const routine = await AsyncStorage.getItem('workoutRoutine');
      setHasRoutine(routine !== null);
    } catch (error) {
      console.error('루틴 상태를 불러오는 중 오류 발생:', error);
    }
  };

  const handleSetupRoutine = () => {
    navigation.navigate('RoutineSetup');
  };

  return (
    <View style={styles.container}>
      <Navbar />
      <View style={styles.contentContainer}>
        <Text style={styles.mytraining}>내 훈련</Text>

        {!hasRoutine ? (
          <View style={styles.routineCard}>
            <Image
              source={require('../../../assets/images/training.png')}
              style={styles.icon}
            />
            <Text style={styles.title}>운동 루틴 설정하기</Text>
            <Text style={styles.subtitle}>나만의 루틴을 설정해 보세요</Text>
            <TouchableOpacity style={styles.startButton} onPress={handleSetupRoutine}>
              <Text style={styles.startButtonText}>+ 시작하기</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text>루틴이 설정되었습니다!</Text>
        )}
      </View>
      <Footer />
    </View>
  );
};

export default WorkoutSetupScreen;
