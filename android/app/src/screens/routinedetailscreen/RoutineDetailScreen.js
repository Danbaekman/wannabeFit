import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from './RoutineDetailScreenStyles';
import Navbar from '../../components/navbar/Navbar';

const RoutineDetailScreen = ( {route, navigation}) => {
  const { routineName } = route.params; // route는 현재 화면이 어떤 경로로부터 왔는지와 함께, 다른 화면으로부터 전달받은 데이터를 가지고 있다.
  //운동 목록 하드코딩(추후 수정)
  const [selectedWorkouts, setSelectedWorkouts ] = useState([]);
  // const [workouts, setWorkouts] = useState([]); //백엔드연결시 추가예정
  
  //벡엔드 api로 추후 수정
  const workouts = [
    { id: '1', name: '풀업' },
    { id: '2', name: '데드리프트' },
    { id: '3', name: '랫풀 다운' },
    { id: '4', name: '시티드 로우' },
    { id: '5', name: '암풀 다운' },
    { id: '6', name: '바벨 로우' },
    { id: '7', name: '덤벨 로우' },
  ]

  // // 백엔드에서 운동 목록 불러오기(이걸로 수정 예정)
  // useEffect(() => {
  //   const fetchWorkouts = async () => {
  //     try {
  //       const response = await fetch('https://your-backend-api.com/api/workouts');
  //       const data = await response.json();
  //       setWorkouts(data); // 데이터 설정
  //     } catch (error) {
  //       console.error('운동 목록을 불러오는 중 오류 발생:', error);
  //     }
  //   };

  //   fetchWorkouts();
  // }, []); // 컴포넌트가 처음 렌더링될 때만 실행


  const toggleWorkoutSelection = (workoutId) => {
    setSelectedWorkouts((prevSelected) => {
      if (prevSelected.includes(workoutId)) {
        return prevSelected.filter((id => id !== workoutId))
      } else {
        return [...prevSelected, workoutId];
      }
    })
  }

  const handleNextStep = () => {
    navigation.navigate('workout', selectedWorkouts);
  }

  const renderWorkoutItem = ({item}) => (
    <TouchableOpacity style={[styles.workoutItem, selectedWorkouts.includes(item.id)&& styles.selectedWorkoutItem]}
      onPress={()=>toggleWorkoutSelection(item.id)}>
      <Text style={styles.workoutName}>{item.name}</Text>
      <Icon
      name={selectedWorkouts.includes(item.id) ? "checkbox-outline" : "square-outline"}
      size={24}
      color={selectedWorkouts.includes(item.id) ? "#008080" : "#888"} />
    </TouchableOpacity>
  )
  return (
    <View style={{ flex: 1 }}>
      <Navbar />
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.headerText}>{routineName} 운동</Text>
        <TouchableOpacity onPress={handleNextStep}>
          <Text style={styles.nextButtonText}>다음 단계로</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id}
        renderItem={renderWorkoutItem}
        ListEmptyComponent={<Text>운동 목록이 없습니다.</Text>}
        contentContainerStyle={styles.workoutList}
      />
    </View>
    </View>
  );
};

export default RoutineDetailScreen;