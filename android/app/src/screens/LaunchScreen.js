import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import styles from '../styles/LaunchStyles';


const LaunchScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      {/* 제목 부분 */}
      <Text style={styles.title}>이상적인 몸을 향해</Text>
      <Text style={styles.subtitle}>Wannabefit</Text>
      <Text style={styles.description}>
        워너비 핏과 함께 멋진 몸을 가꾸어 보세요.
      </Text>

      {/* 기능 설명 섹션 */}
      <View style={styles.feature}>
        {/* 회색 원 안에 이미지 삽입 */}
        <View style={styles.circle}>
          <Image
            source={require('../../assets/images/UI.png')}  // Ai.png 이미지 불러오기
            style={styles.image}
          />
        </View>
        <View style={styles.featureText}>
          <Text style={styles.featureTitle}>간단 명료한 UI</Text>
          <Text style={styles.featureDescription}>
            간단한 UI를 제공함으로써 원하는 기능에 누구나 쉽게 접근할 수 있습니다.
          </Text>
        </View>
      </View>

      <View style={styles.feature}>
        <View style={styles.circle}>
          <Image
            source={require('../../assets/images/levelUp.png')}  // 두 번째 이미지
            style={styles.image}
          />
        </View>
        <View style={styles.featureText}>
          <Text style={styles.featureTitle}>확실한 동기부여</Text>
          <Text style={styles.featureDescription}>
            레벨업 시스템으로 경쟁하며 레벨에 맞는 권한을 경험해 보세요!
          </Text>
        </View>
      </View>

      <View style={styles.feature}>
        <View style={styles.circle}>
          <Image
            source={require('../../assets/images/Ai.png')}  // 세 번째 이미지
            style={styles.image}
          />
        </View>
        <View style={styles.featureText}>
          <Text style={styles.featureTitle}>AI 기반의 시스템</Text>
          <Text style={styles.featureDescription}>
            AI 기반의 1:1 코칭 시스템으로 최적의 운동과 식단 루틴을 경험해 보세요.
          </Text>
        </View>
      </View>

      {/* 시작하기 버튼 */}
      <TouchableOpacity style={styles.startButton}
      title="로그인 창 이동"
      onPress={() =>
      navigation.navigate('Login')
  }>
        <Text style={styles.startButtonText}>시작하기</Text>
      </TouchableOpacity>

      {/* 로그인 안내 */}
      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.loginText}>이미 계정이 있습니까?</Text>
        <Text style={styles.loginLink}>로그인</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LaunchScreen;
