import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, Animated, PanResponder, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from './RoutineDetailScreenStyles';
import Navbar from '../../components/navbar/Navbar';
import CONFIG from '../../config';
import AddRoutineDetailModal from '../../components/modal/addroutinedetail/AddRoutineDetailModal';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, { useAnimatedStyle, useSharedValue, interpolate} from 'react-native-reanimated';
import Footer from '../../components/footer/Footer';
import DateDisplay from '../../components/datedisplay/DateDisplay';




// 근육 ID 가져오기 함수 - 컴포넌트 외부에 정의하여 재사용 가능
const fetchMusclesId = (muscleName, musclesData) => {
  const musclesArray = musclesData[0]?.muscles || [];
  const matchedMuscle = musclesArray.find(
    (muscle) => muscle.name.trim().toLowerCase() === muscleName.trim().toLowerCase()
  );
  return matchedMuscle ? matchedMuscle._id : null;
};

const renderRightActions = (progress, dragX, item) => {
  const progressValue = useSharedValue(0);
  const vibrated = useSharedValue(false); // 진동 상태 추적

  // 배경색과 크기 변화 애니메이션
  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolate(
      progressValue.value,
      [0, 0.5, 1],
      ['#FFFFFF', '#FFD700', '#FF3B30']
    );
    const scale = interpolate(progressValue.value, [0, 1], [1, 1.2]);
    return { backgroundColor, transform: [{ scale }] };
  });

  // 스와이프 진행도 업데이트 및 진동 트리거
  const handleSwipeProgress = (dragX) => {
    const normalizedProgress = Math.min(1, Math.abs(dragX / 200));
    progressValue.value = normalizedProgress;

    if (!vibrated.value && normalizedProgress > 0.5) {
      Vibration.vibrate(50); // 진동
      vibrated.value = true;
    }

    if (normalizedProgress <= 0.5) {
      vibrated.value = false;
    }
  };

  return (
    <Reanimated.View style={[styles.deleteContainer, animatedStyle]}>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleWorkoutDelete(item._id)}
      >
        <Icon name="trash-outline" size={24} color="white" />
      </TouchableOpacity>
    </Reanimated.View>
  );
};



const RoutineDetailScreen = ({ route, navigation }) => {
  const { routineName, selectedDate } = route.params; // route로부터 데이터 받음
  const [selectedWorkouts, setSelectedWorkouts] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [musclesData, setMusclesData] = useState([]);
  const [isTrashVisible, setIsTrashVisible] = useState(false);
  const trashZoneY = Dimensions.get('window').height * 0.1; // 휴지통 영역 높이
  const positions = useRef([]);

  useEffect(() => {
    fetchWorkouts(); // 운동 데이터 가져오기
  }, []);
  useEffect(() => {
    console.log('useEffect 실행 - fetchWorkouts 호출');
    fetchWorkouts(); // 운동 데이터 가져오기
  }, []);
  
  useEffect(() => {
    console.log('musclesData 상태 변경:', JSON.stringify(musclesData, null, 2));
  }, [musclesData]);
  useEffect(() => {
    // `positions`를 `workouts` 길이에 맞게 업데이트
    positions.current = workouts.map(
      (_, index) => positions.current[index] || new Animated.ValueXY({ x: 0, y: 0 })
    );
  }, [workouts]);
  

  const fetchWorkouts = async () => {
    console.log('API 호출 시도');
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        Alert.alert('Error', '로그인이 필요합니다.');
        navigation.navigate('Login');
        return;
      }

      const response = await fetch(`${CONFIG.API_BASE_URL}/exercise/exercises`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const musclesResponse = await fetch(`${CONFIG.API_BASE_URL}/exercise/muscles/grouped`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!musclesResponse.ok) {
        throw new Error('Failed to fetch muscle data');
      }

      const musclesData = await musclesResponse.json();
      setMusclesData(musclesData); // musclesData를 상태로 저장
      console.log('근육 데이터 구조:', JSON.stringify(musclesData, null, 2));

      if (!response.ok) {
        throw new Error(`Failed to fetch workouts: ${response.status}`);
      }

      const data = await response.json();
      console.log('전체 운동 데이터:', JSON.stringify(data, null, 2));

      // routineName과 연결된 운동만 필터링
      const filteredWorkouts = data.filter((exercise) =>
        exercise.muscles.some((muscle) => muscle.name === routineName)
      );

      setWorkouts(filteredWorkouts);
      console.log('필터링된 운동 데이터:', JSON.stringify(filteredWorkouts, null, 2));
    } catch (error) {
      Alert.alert('Error', '운동 목록을 불러오지 못했습니다.');
      console.error('Fetch workouts error:', error);
    }
  };

  const handleWorkoutAdd = async (workoutName) => {
    try {
      console.log('운동 추가 시작:', workoutName);
      console.log('현재 musclesData:', JSON.stringify(musclesData, null, 2));
  
      const muscleId = fetchMusclesId(routineName, musclesData);
  
      if (!muscleId) {
        console.error(`Error: ${routineName}에 해당하는 근육 데이터를 찾을 수 없습니다.`);
        Alert.alert('Error', '근육 데이터를 찾을 수 없습니다.');
        return;
      }
  
      console.log('찾은 근육 ID:', muscleId);
  
      // 서버 요청
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        Alert.alert('Error', '로그인이 필요합니다.');
        navigation.navigate('Login');
        return;
      }
  
      const response = await fetch(`${CONFIG.API_BASE_URL}/exercise/add-exercises`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: workoutName,
          muscles: [muscleId],
        }),
      });
      
  
      if (!response.ok) {
        if (response.status === 409) {
            // 이미 존재하는 운동일 때
            Alert.alert('안내', data.message);
            return;
        }
        throw new Error(data.message || '운동 추가 실패');
    }

      fetchWorkouts();
      setModalVisible(false);
      Alert.alert('운동 추가', '새 운동이 성공적으로 추가되었습니다!');
    } catch (error) {
      console.error('운동 추가 중 오류 발생:', error);
      Alert.alert('Error', '운동을 추가하는 데 실패했습니다.');
    }
  };

  const handleWorkoutDelete = async (workoutId) => {
    try {
        console.log('운동 삭제 시도:', workoutId);

        const token = await AsyncStorage.getItem('jwtToken');
        if (!token) {
            Alert.alert('Error', '로그인이 필요합니다.');
            navigation.navigate('Login');
            return;
        }

        // ExerciseName 삭제를 위한 API 호출
        const response = await fetch(`${CONFIG.API_BASE_URL}/exercise/exercises/${workoutId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            throw new Error('운동 삭제 실패');
        }

        fetchWorkouts(); // 운동 목록 갱신
        Alert.alert('운동 삭제', '운동이 성공적으로 삭제되었습니다.');
    } catch (error) {
        console.error('운동 삭제 중 오류 발생:', error);
        Alert.alert('WannabeFit', '운동을 삭제하는 데 실패했습니다.');
    }
};

  const toggleWorkoutSelection = (workout) => {
    setSelectedWorkouts((prevSelected) => {
      const exists = prevSelected.find((w) => w._id === workout._id);
      if (exists) {
        return prevSelected.filter((w) => w._id !== workout._id);
      } else {
        return [...prevSelected, workout];
      }
    });
  };

  const handleNextStep = () => {
    if (selectedWorkouts.length === 0) {
      Alert.alert('Error', '최소 하나의 운동을 선택해주세요.');
      return;
    }

    navigation.navigate('WorkoutEntry', {
      selectedWorkouts,
      routineName,
      selectedDate,
    });
  };
  
  const renderWorkoutItem = ({ item }) => (
    
    <ReanimatedSwipeable
      friction={2} // 스와이프 속도 조절
      rightThreshold={40} // 우측 스와이프 임계값
      overshootRight={false} // 스와이프가 넘어가지 않도록 설정
      overshootLeft={false} // 좌측 스와이프가 넘어가지 않도록 설정
      onSwipeableOpen={() => {
        if (item.isCustom) {
          handleWorkoutDelete(item._id); // 커스텀 운동만 삭제
        } else {
          Alert.alert('안내', '기본 제공 운동은 삭제할 수 없습니다.');
        }
      }}
      renderRightActions={(progress, dragX) =>
        renderRightActions(progress, dragX, item) // 삭제 아이콘 표시
      }
    >
      <TouchableOpacity
        style={[
          styles.workoutItem,
          selectedWorkouts.some((w) => w._id === item._id) && styles.selectedWorkoutItem,
        ]}
        onPress={() => toggleWorkoutSelection(item)}
      >
        <Text style={styles.workoutName}>{item.name}</Text>
        <Icon
          name={
            selectedWorkouts.some((w) => w._id === item._id)
              ? 'checkbox-outline'
              : 'square-outline'
          }
          size={24}
          color={
            selectedWorkouts.some((w) => w._id === item._id) ? '#008080' : '#888'
          }
        />
      </TouchableOpacity>
    </ReanimatedSwipeable>
    
  );
  
  
  return (
    <View style={styles.container}>
      <Navbar />
      <DateDisplay date={selectedDate} />
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>{routineName} 운동</Text>
          <TouchableOpacity onPress={handleNextStep}>
            <Text style={styles.nextButtonText}>다음 단계로</Text>
          </TouchableOpacity>
        </View>
  
        <FlatList
          data={workouts}
          keyExtractor={(item) => item._id}
          renderItem={renderWorkoutItem}
          ListEmptyComponent={<Text style={styles.noText}>운동 목록이 없습니다.</Text>}
          contentContainerStyle={styles.workoutList}
        />
  
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>+ 직접 추가</Text>
        </TouchableOpacity>
  
        <AddRoutineDetailModal
          visible={isModalVisible}
          onClose={() => setModalVisible(false)}
          onAddExercise={handleWorkoutAdd}
        />
      </View>
      <Footer/>
    </View>
  );
  
};

export default RoutineDetailScreen;
