import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import styles from './KakaoLoginButtonStyles';

const KakaoLoginButton = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.kakaoCircle}>
      <Image
        source={require('../../../../assets/images/kakao1.png')} // 카카오 로고 이미지 경로
        style={[styles.icon, { resizeMode: 'contain', backgroundColor: '#FEE500' }]} // resizeMode 추가
      />
    </TouchableOpacity>
  );
};

export default KakaoLoginButton;
