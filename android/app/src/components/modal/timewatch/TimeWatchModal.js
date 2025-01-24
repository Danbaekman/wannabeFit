import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, Alert, Vibration } from 'react-native';
import styles from './TimeWatchModalStyles';
import Ionicons from 'react-native-vector-icons/Ionicons'; // 아이콘 라이브러리

const TimeWatchModal = ({ visible, onClose }) => {
  const [time, setTime] = useState(60); // 기본 제공 60초
  const [isTimerRunning, setIsTimerRunning] = useState(false);

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

  // 분 쪼개기
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    // padStart는 문자열 메서드로 기본값 2자리로 제한(2자리 초과 시에는 그대로 출력)
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // 최저값 제한
  const handleTimeAdjust = (amount) => {
    setTime((prev) => Math.max(0, prev + amount)); // 최저값 0으로 제한
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.modalContainer}>
          <View style={styles.dragHandleContainer}>
            <View style={styles.dragHandle} />
          </View>
          {/* 원형 안에 시간 */}
          <View style={styles.timerCircle}>
            <Text style={styles.timerText}>{formatTime(time)}</Text>
          </View>
          {/* 재생/일시정지 버튼 */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.startPauseButton}
              onPress={handleStartPause}
            >
              <Ionicons
                name={isTimerRunning ? 'pause' : 'play'}
                size={44}
                color="black"
              />
            </TouchableOpacity>
            {/* 정지 버튼 */}
            {isTimerRunning && (
              <TouchableOpacity
                style={styles.stopButton}
                onPress={handleReset}
              >
                <Ionicons name="stop" size={32} color="black" />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.adjustButtonContainer}>
          {/* -15초 버튼 */}
            <TouchableOpacity
              style={styles.adjustButton}
              onPress={() => handleTimeAdjust(-15)}
            >
              <Text style={styles.adjustButtonText}>-15초</Text>
            </TouchableOpacity>
            {/* +15초 버튼 */}
            <TouchableOpacity
              style={styles.adjustButton}
              onPress={() => handleTimeAdjust(15)}
            >
              <Text style={styles.adjustButtonText}>+15초</Text>
            </TouchableOpacity>
            </View>
        </View>
      </View>
    </Modal>
  );
};

export default TimeWatchModal;
