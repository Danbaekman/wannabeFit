import React from 'react';
import { View, Text, TouchableOpacity, Image} from 'react-native';
import styles from '../styles/LoginStyles';
import NaverLoginButton from '../components/buttons/naver/NaverLoginButton';
import KakaoLoginButton from '../components/buttons/kakao/KakaoLoginButton';
import GoogleLoginButton from '../components/buttons/google/GoogleLoginButton';

const LoginScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* 뒤로가기 버튼 */}
      <TouchableOpacity 
        onPress={() => navigation.navigate('Launch')} 
        style={styles.backButtonContainer}
      >
        <Text style={styles.backButton}>{'< 뒤로'}</Text>
      </TouchableOpacity>

      {/* 환영 메시지 */}
      <Text style={styles.welcomeText}>환영합니다!</Text>
      <Text style={styles.header}>계정 만들기</Text>

      {/* 설명 텍스트 */}
      <Text style={styles.description}>
        인바디 맞춤형 운동루틴을 무료로 경험해보세요.{'\n'}매일 식습관을 기록하며 변화하는 모습을 확인해보세요!
      </Text>

      {/* 로고 이미지 */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/WannabefitLogo.png')} // Ai.png 이미지 불러오기
          style={styles.image}
        />
      </View>

      {/* "소셜 계정으로 로그인" 섹션 */}
      <View style={styles.dividerContainer}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>소셜 계정으로 로그인</Text>
        <View style={styles.line} />
      </View>

      {/* 버튼들 */}
      <View style={styles.socialButtonContainer}>
        <KakaoLoginButton />
        <NaverLoginButton navigation={navigation} />
        <GoogleLoginButton />
      </View>
    </View>
  );
};
export default LoginScreen;
