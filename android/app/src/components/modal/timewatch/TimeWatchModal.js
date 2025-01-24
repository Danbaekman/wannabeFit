import React, { useState, useEffect, useRef,  } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Alert,
  Vibration,
  Animated,
  PanResponder,
  Dimensions
} from 'react-native';
import styles from './TimeWatchModalStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';

const TimeWatchModal = ({ visible, onClose }) => {
  const [time, setTime] = useState(60); // 기본 제공 60초
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const screenHeight = Dimensions.get('screen').height; // 화면 높이
  const panY = useRef(new Animated.Value(screenHeight)).current; // 모달의 Y축 위치
  const translateY = panY.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0, 0, 1],
  });

  const resetBottomSheet = Animated.timing(panY, {
    toValue: 0, // 모달 초기 위치
    duration: 300,
    useNativeDriver: true,
  });

  const closeBottomSheet = Animated.timing(panY, {
    toValue: screenHeight, // 화면 아래로 이동
    duration: 300,
    useNativeDriver: true,
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => false,
      onPanResponderMove: (event, gestureState) => {
        panY.setValue(gestureState.dy); // 드래그 Y축 업데이트
      },
      onPanResponderRelease: (event, gestureState) => {
        if (gestureState.dy > 0 && gestureState.vy > 1.5) {
          closeModal(); // 아래로 빠르게 드래그하면 모달 닫기
        } else {
          resetBottomSheet.start(); // 원래 위치로 복귀
        }
      },
    })
  ).current;

  useEffect(() => {
    if (visible) {
      resetBottomSheet.start(); // 모달 열기 애니메이션
    }
  }, [visible]);

  const closeModal = () => {
    closeBottomSheet.start(() => {
      onClose(); // 모달 닫기 콜백 호출
    });
  };

  useEffect(() => {
    let timer;
    if (time > 0 && isTimerRunning) {
      timer = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
    } else if (time === 0) {
      clearInterval(timer);
      setIsTimerRunning(false);

      // 알림 발생
      Vibration.vibrate(1000); // 1초 진동
      Alert.alert('휴식 종료', '다음 세트를 시작하세요!');
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, time]);

  const handleStartPause = () => {
    if (time === 0) {
      setTime(60); // 타이머 초기화
    }
    setIsTimerRunning((prev) => !prev);
  };

  const handleReset = () => {
    setIsTimerRunning(false);
    setTime(60);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleTimeAdjust = (amount) => {
    setTime((prev) => Math.max(0, prev + amount)); // 최저값 0으로 제한
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.background} onPress={closeModal} />
        <Animated.View
          style={[styles.modalContainer, { transform: [{ translateY }] }]}
          {...panResponder.panHandlers} // PanResponder 연결
        >
          <View style={styles.dragHandleContainer}>
            <View style={styles.dragHandle} />
          </View>
          <View style={styles.timerCircle}>
            <Text style={styles.timerText}>{formatTime(time)}</Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.startPauseButton} onPress={handleStartPause}>
              <Ionicons name={isTimerRunning ? 'pause' : 'play'} size={44} color="black" />
            </TouchableOpacity>
            {isTimerRunning && (
              <TouchableOpacity style={styles.stopButton} onPress={handleReset}>
                <Ionicons name="stop" size={32} color="black" />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.adjustButtonContainer}>
            <TouchableOpacity style={styles.adjustButton} onPress={() => handleTimeAdjust(-15)}>
              <Text style={styles.adjustButtonText}>-15초</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.adjustButton} onPress={() => handleTimeAdjust(15)}>
              <Text style={styles.adjustButtonText}>+15초</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default TimeWatchModal;
