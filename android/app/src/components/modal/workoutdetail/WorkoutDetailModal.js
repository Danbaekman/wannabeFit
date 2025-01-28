import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './WorkoutDetailModalStyles';

const WorkoutDetailModal = ({ visible, onClose, record }) => {
  console.log('WorkoutDetailModal record:', record);

  // 총 시간을 시간과 분으로 변환하는 함수
  const formatTotalTime = (totalTime) => {
    if (!totalTime || totalTime <= 0) return '0분';
    const hours = Math.floor(totalTime / 60);
    const minutes = totalTime % 60;
    if (hours > 0) {
      return `${hours}시간 ${minutes}분`;
    }
    return `${minutes}분`;
  };

  const screenHeight = Dimensions.get('screen').height; // 화면 높이
  const panY = useRef(new Animated.Value(screenHeight)).current; // 모달 초기 위치
  const translateY = panY.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0, 0, 1],
  });

  const resetBottomSheet = Animated.timing(panY, {
    toValue: 0,
    duration: 300,
    useNativeDriver: true,
  });

  const closeBottomSheet = Animated.timing(panY, {
    toValue: screenHeight,
    duration: 300,
    useNativeDriver: true,
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        panY.setValue(gestureState.dy); // Y축 드래그 값 업데이트
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          closeBottomSheet.start(() => onClose());
        } else {
          resetBottomSheet.start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (visible) {
      resetBottomSheet.start(); // 모달 열기
    }
  }, [visible]);
  
  const closeModal = () => {
    closeBottomSheet.start(() => {
      onClose(); // 모달 닫기 콜백 호출
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
      <TouchableOpacity style={styles.background} onPress={closeModal} />
        <Animated.View
          style={[styles.modalContent, { transform: [{ translateY }] }]}
          {...panResponder.panHandlers}
        >
            {/* 드래그 핸들 */}
          <View style={styles.dragHandleContainer}>
            <View style={styles.dragHandle} />
          </View>

          {/* 닫기 버튼 */}
          <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
            <Ionicons name="close-circle" size={32} color="#ccc" />
          </TouchableOpacity>

          <Text style={styles.modalTitle}>
            {record?.muscles?.map((muscle) => muscle.name).join(', ') || '운동 기록'} 상세보기
          </Text>

          {/* 총 시간 및 총 세트 수 */}
          <Text style={styles.summaryText}>
            총 시간: {formatTotalTime(record?.totalTime)}
          </Text>
          <Text style={styles.summaryText}>
            총 세트: {record?.totalSets || 0}
          </Text>

          {/* 전체 메모 */}
          <View>
            <Text style={styles.summaryText}>전체 메모</Text>
            <View style={styles.memoBox}>
              <Text style={styles.memoText}>
                {record?.memo || '메모가 없습니다.'}
              </Text>
            </View>
            <View style={styles.horizontalLine} />
          </View>

          <ScrollView>
            {record?.exercises?.map((exercise, index) => (
              <View key={index} style={styles.exerciseContainer}>
                <Text style={styles.exerciseName}>
                  {exercise.exerciseName?.name || '운동 이름 없음'}
                </Text>
                <View style={styles.exerciseDetailsBox}>
                  {exercise.sets.map((set, setIndex) => (
                    <Text key={setIndex} style={styles.exerciseDetails}>
                      세트 {setIndex + 1}: {set.weight || 0}kg x {set.reps || 0}회
                      {set.memo && <Text style={styles.setMemo}> (메모: {set.memo})</Text>}
                    </Text>
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default WorkoutDetailModal;
