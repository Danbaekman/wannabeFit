// RoutineSetupScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';
import styles from './RoutineSetupScreenStyles';

const RoutineSetupScreen = ({ navigation }) => {
    
  const handleSaveRoutine = () => {
    // 루틴 추가 로직을 구현하거나, 저장 완료 후 다른 화면으로 이동할 수 있습니다.
    navigation.goBack();
  };

  const handleRoutineDetail = (routineName) => {
    // 각 버튼을 눌렀을 때의 상세 루틴 페이지로 이동하는 로직
    navigation.navigate('RoutineDetail', { routineName });
  };

  return (
    <View style={styles.container}>
      <Navbar />
      <View style={styles.contentContainer}>
        <Text style={styles.mytraining}>내 훈련</Text>

        {/* 운동 목록 버튼 */}
        <View style={styles.buttonContainer}>
          {['하체', '가슴', '등', '어깨', '팔'].map((routine) => (
            <TouchableOpacity
              key={routine}
              style={styles.routineButton}
              onPress={() => handleRoutineDetail(routine)}
            >
              <Text style={styles.routineButtonText}>{routine}</Text>
              <Icon name="chevron-forward-outline" size={20} color="#888" />
            </TouchableOpacity>
          ))}
        </View>

        {/* 훈련 추가 버튼 */}
        <TouchableOpacity style={styles.addButton} onPress={handleSaveRoutine}>
          <Text style={styles.addButtonText}>+ 훈련 추가</Text>
        </TouchableOpacity>
      </View>
      <Footer />
    </View>
  );
};

export default RoutineSetupScreen;
