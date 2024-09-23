import React, { useState } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Alert } from 'react-native';
import NaverLogin from '@react-native-seoul/naver-login';
import CONFIG from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

// JWT 토큰을 저장하는 함수
const storeToken = async (token) => {
  try {
    await AsyncStorage.setItem('jwtToken', token);
    console.log('토큰 저장 완료');
  } catch (error) {
    console.error('토큰 저장 오류:', error);
  }
};

// JWT 토큰을 가져오는 함수
const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('jwtToken');
    if (token !== null) {
      console.log('저장된 토큰:', token);
      return token;
    }
  } catch (error) {
    console.error('토큰 가져오기 오류:', error);
  }
  return null;
};

const consumerKey = 'BWqwiKuQdZgMQExzACXH';
const consumerSecret = 'OHTX96R9nQ';
const appName = 'WannabeFit';

NaverLogin.initialize({
  appName,
  consumerKey,
  consumerSecret,
});

const NaverLoginButton = ({ navigation }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [failureResponse, setFailureResponse] = useState(null);

  // 서버로 accessToken 전달
  const sendAccessTokenToBack = async (accessToken) => {
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/auth/login/naver`, {  // 백엔드 서버의 엔드포인트를 입력
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accessToken }),  // JSON으로 액세스 토큰을 전송
      });

      const result = await response.json();
      if (response.ok) {
        console.log('백엔드 응답:', result);
        return result.jwtToken; // 서버로부터 받은 JWT 토큰 반환
      } else {
        console.error('Failed to get JWT from backend:', result);
        return null;
      }
    } catch (error) {
      console.error('토큰 전송 오류:', error);
      Alert.alert('서버 연결 실패', 'JWT 토큰을 받아오는 도중 오류가 발생했습니다.');
      return null;
    }
  };

  const login = async () => {
    try {
      const { failureResponse, successResponse } = await NaverLogin.login();

      if (successResponse) {
        setIsLoggedIn(true);
        console.log('로그인 성공:', successResponse);

        // 네이버 accessToken을 서버로 보내고 JWT 토큰을 받음
        const jwtToken = await sendAccessTokenToBack(successResponse.accessToken);

        if (jwtToken) {
          // JWT 토큰을 AsyncStorage에 저장
          await storeToken(jwtToken);

          // JWT 토큰을 다음 화면으로 전달
          navigation.navigate('InbodyInput', { jwtToken });
        } else {
          console.error('Failed to get JWT token from server');
        }
      } else if (failureResponse) {
        setFailureResponse(failureResponse);
        console.log('로그인 실패:', failureResponse);
        Alert.alert('로그인 실패', '네이버 로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      Alert.alert('로그인 오류', '로그인 도중 오류가 발생했습니다.');
    }
  };

  const logout = async () => {
    try {
      await NaverLogin.logout();
      setIsLoggedIn(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={login} style={styles.button}>
        <Text style={styles.buttonText}>네이버로 로그인</Text>
      </TouchableOpacity>

      {isLoggedIn && (
        <>
          <Text style={styles.successText}>로그인 성공!</Text>
          <TouchableOpacity onPress={logout} style={styles.button}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </>
      )}

      {failureResponse && (
        <Text style={styles.errorText}>로그인 실패: {failureResponse.message}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#03C75A',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
  successText: {
    color: 'green',
    marginTop: 10,
  },
});

export default NaverLoginButton;
