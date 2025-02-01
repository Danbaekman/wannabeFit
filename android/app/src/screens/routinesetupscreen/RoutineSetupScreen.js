import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Icon from 'react-native-vector-icons/Ionicons';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';
import styles from './RoutineSetupScreenStyles';
import CONFIG from '../../config';
import AddRoutineModal from '../../components/modal/addroutine/AddRoutineModal';
import DateDisplay from '../../components/datedisplay/DateDisplay';

const RoutineSetupScreen = ({ navigation, route }) => {
  const { selectedDate } = route.params;
  const [routines, setRoutines] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchRoutines();
  }, []);

  const fetchRoutines = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        Alert.alert('Error', '로그인이 필요합니다.');
        navigation.navigate('Login');
        return;
      }
  
      const response = await fetch(`${CONFIG.API_BASE_URL}/exercise/muscles/grouped`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch workouts: ${response.status}`);
      }
  
      const data = await response.json();
      const muscleGroups = data[0].muscles.map((muscle) => ({
        id: muscle._id, // _id 필드를 추가
        name: muscle.name,
        isCustom: muscle.isCustom,
      }));
  
      setRoutines(muscleGroups);
    } catch (error) {
      Alert.alert('Error', '운동 목록을 불러오지 못했습니다.');
      console.error('Fetch workouts error:', error);
    }
  };
  
  const handleRoutineDetail = (routineName) => {
    navigation.navigate('RoutineDetail', { routineName, selectedDate });
  };

  const handleAddRoutine = () => {
    setModalVisible(true);
  };

  const handleRoutineAdd = async (routineName) => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        Alert.alert('Error', '로그인이 필요합니다.');
        navigation.navigate('Login');
        return;
      }

      const response = await fetch(`${CONFIG.API_BASE_URL}/exercise/customMuscle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: routineName }),
      });

      if (response.ok) {
        fetchRoutines();
      } else {
        throw new Error('Failed to add custom muscle');
      }
    } catch (error) {
      Alert.alert('Error', '새로운 훈련을 추가하지 못했습니다.');
      console.error(error);
    } finally {
      setModalVisible(false);
    }
  };

  const handleDeleteRoutine = async (routineId) => {
  try {
    const token = await AsyncStorage.getItem('jwtToken');
    if (!token) {
      Alert.alert('Error', '로그인이 필요합니다.');
      navigation.navigate('Login');
      return;
    }

    const response = await fetch(`${CONFIG.API_BASE_URL}/exercise/customMuscle/${routineId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      fetchRoutines(); // 삭제 후 목록 갱신
      Alert.alert('Success', '훈련이 성공적으로 삭제되었습니다.');
    } else {
      const errorData = await response.json(); // 서버에서 반환된 에러 메시지 확인
      throw new Error(errorData.message || 'Failed to delete custom muscle');
    }
  } catch (error) {
    Alert.alert('Error', error.message || '커스텀 훈련을 삭제하지 못했습니다.');
    console.error(error);
  }
};


  const renderRightActions = (routine) => {
    if (!routine.isCustom) {
      return null; // 기본 항목은 삭제 버튼을 표시하지 않음
    }
  
    return (
      <View style={styles.deleteContainer}>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => handleDeleteRoutine(routine.name)}
        >
          <Icon name="trash-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
    );
  };
  

  const preventSwipeForDefault = (routine) => {
    if (!routine.isCustom) {
      Alert.alert('알림', '기본 제공 훈련은 삭제할 수 없습니다.');
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <Navbar />
      <DateDisplay date={selectedDate} />
      <View style={styles.contentContainer}>
        <Text style={styles.mytraining}>내 훈련</Text>

        {/* 운동 목록 */}
        <View style={styles.buttonContainer}>
          {routines.map((routine, index) => (
            <ReanimatedSwipeable
              key={index}
              renderRightActions={() => renderRightActions(routine)}
              friction={2}
              onSwipeableOpen={() => {
                if (routine.isCustom) {
                  handleDeleteRoutine(routine.id); // 스와이프 완료 시 삭제
                } else {
                  preventSwipeForDefault(routine); // 기본 항목 삭제 방지
                }
              }}
            >
              <TouchableOpacity
                style={styles.routineButton}
                onPress={() => handleRoutineDetail(routine.name)}
              >
                <Text style={styles.routineButtonText}>{routine.name}</Text>
                <Icon name="chevron-forward-outline" size={20} color="#888" />
              </TouchableOpacity>
            </ReanimatedSwipeable>
          ))}
        </View>

        {/* 추가 버튼 */}
        <TouchableOpacity style={styles.addButton} onPress={handleAddRoutine}>
          <Text style={styles.addButtonText}>+ 훈련 추가</Text>
        </TouchableOpacity>
        <AddRoutineModal
          visible={isModalVisible}
          onClose={() => setModalVisible(false)}
          onAddRoutine={handleRoutineAdd}
        />
      </View>
      <Footer />
    </GestureHandlerRootView>
  );
};

export default RoutineSetupScreen;
