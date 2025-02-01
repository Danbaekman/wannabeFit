import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import styles from '../styles/LaunchStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LaunchScreen = ({ navigation }) => {
  const checkLoginStatus = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      if (token) {
        console.log('로그인 상태 확인: 토큰 있음');
      } else {
        console.log('로그인 상태 확인: 토큰 없음');
        Alert.alert(
          '로그인 필요',
          '이전 로그인 기록이 없습니다. 로그인 창으로 이동하시겠습니까?',
          [
            {
              text: '취소',
              onPress: () => console.log('로그인 취소'),
              style: 'cancel',
            },
            {
              text: '확인',
              onPress: () => navigation.navigate('Login'), // 로그인 창으로 이동
            },
          ],
          { cancelable: false } // 외부 터치로 닫히지 않게 설정
        );
      }
    } catch (error) {
      console.error('토큰 확인 중 오류:', error);
    }
  }, [navigation]);

  // 화면이 렌더링될 때 로그인 상태 확인
  React.useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]);

  return (
    <View style={styles.container}>
      {/* 제목 부분 */}
      <Text style={styles.title}>이상적인 몸을 향해</Text>
      <Text style={styles.subtitle}>Wannabefit</Text>
      <Text style={styles.description}>
        워너비 핏과 함께 멋진 몸을 얻어가세요
      </Text>

      {/* 기능 설명 섹션 */}
      <View style={styles.feature}>
        <View style={styles.circle}>
          <Image
            source={require('../../assets/images/UI.png')} // Ai.png 이미지 불러오기
            style={styles.image}
          />
        </View>
        <View style={styles.featureText}>
          <Text style={styles.featureTitle}>간단 명료한 UI</Text>
          <Text style={styles.featureDescription}>
            간단한 UI를 제공하여 원하는 기능에 누구나 쉽게 접근할 수 있습니다.
          </Text>
        </View>
      </View>

      <View style={styles.feature}>
        <View style={styles.circle}>
        <Image
          source={require('../../assets/images/target.png')} // 맞춤형 목표 설정
          style={styles.image}
        />
        </View>
        <View style={styles.featureText}>
          <Text style={styles.featureTitle}>맞춤형 목표 설정</Text>
          <Text style={styles.featureDescription}>
            신체정보를 바탕으로 원하는 목적에 맞는 목표를 제공해 드립니다.
          </Text>
        </View>
      </View>

      <View style={styles.feature}>
        <View style={styles.circle}>
          <Image
            source={require('../../assets/images/chart.png')} // 세 번째 이미지
            style={styles.image}
          />
        </View>
        <View style={styles.featureText}>
          <Text style={styles.featureTitle}>통계 데이터 지원</Text>
          <Text style={styles.featureDescription}>
            목표를 위해 얼만큼 도달했는지 통계를 통해 확인해 보세요!
          </Text>
        </View>
      </View>

      {/* 시작하기 버튼 */}
      <TouchableOpacity
        style={styles.startButton}
        title="로그인 창 이동"
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.startButtonText}>시작하기</Text>
      </TouchableOpacity>

      {/* 로그인 안내 */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={checkLoginStatus} // 로그인 상태 확인을 다시 호출
      >
        <Text style={styles.loginText}>이미 계정이 있습니까?</Text>
        <Text style={styles.loginLink}>로그인</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LaunchScreen;
