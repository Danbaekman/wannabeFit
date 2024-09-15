import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import styles from '../styles/LoginStyles';
import NaverLoginButton from '../components/NaverLoginButton/NaverLoginButton';  // 네이버 로그인 버튼 컴포넌트 임포트


const LoginScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* 뒤로가기 버튼 */}
      <Text style={styles.backButton}>{'< 뒤로'}</Text>

      {/* 환영 메시지 */}
      <Text style={styles.welcomeText}>환영합니다!</Text>
      <Text style={styles.header}>계정 만들기</Text>

      {/* 설명 텍스트 */}
      <Text style={styles.description}>
        인바디 맞춤형 운동루틴을 무료로 경험해보세요!{'\n'}매일 식습관을 기록하며 나의 건강 상태 check
      </Text>

      {/* 로고 이미지 */}
      <View style={styles.LogoImageContainer}>
        <Image
          source={require('../../assets/images/wannabeFit-Logo.png')}  
          style={styles.LogoImage}
        />
      </View>

      <View>
        <Text style={styles.LogoText}>WannabeFit</Text>
      </View>

      {/* 카카오 로그인 버튼 */}
      <TouchableOpacity style={styles.kakaoButton}>
        <View style={styles.kakaoButtonContent}>
            <Image 
            source={require('../../assets/images/kakaotalk_sharing_btn_small.png')}  // Kakao 심볼 이미지
            style={styles.kakaoSymbol}
            />
        </View>
            <Text style={styles.kakaoText}>kakao로 시작하기</Text>
      </TouchableOpacity>

      {/* 네이버 로그인 버튼 */}
      <NaverLoginButton navigation={navigation} />
    </View>
  );
};


export default LoginScreen;
