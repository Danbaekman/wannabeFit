import { NaverLogin, getProfile } from '@react-native-seoul/naver-login';
import { TouchableOpacity, Text, Image } from 'react-native';
import React from 'react';
import styles from './NaverLoginButtonStyles';

// Android 네이버 로그인 키 설정
const naverLoginKeys = {
  kConsumerKey: 'BWqwiKuQdZgMQExzACXH', // Naver client ID
  kConsumerSecret: 'OHTX96R9nQ', // Naver secret ID
  kServiceAppName: 'WannabeFit',
};

const NaverLoginButton = () => {
  const naverLogin = () => {
    NaverLogin.login(naverLoginKeys)
      .then(token => {
        // 토큰이 성공적으로 받아졌을 때 사용자 정보를 가져옵니다.
        getProfile(token.accessToken)
          .then(profile => {
            console.log(profile);
          })
          .catch(err => {
            console.error('Failed to get profile: ', err);
          });
      })
      .catch(err => {
        console.error('Login failed: ', err);
      });
  };

  return (
    <TouchableOpacity style={styles.naverButton} onPress={naverLogin}>
      <Image
        source={require('../../../assets/images/naver_Logo.png')}
        style={styles.naverIcon}
      />
      <Text style={styles.naverText}>네이버로 시작하기</Text>
    </TouchableOpacity>
  );
};

export default NaverLoginButton;
