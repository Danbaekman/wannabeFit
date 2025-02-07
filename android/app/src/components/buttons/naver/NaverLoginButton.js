import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, View, Alert, Image, } from 'react-native';
import NaverLogin from '@react-native-seoul/naver-login';
import CONFIG from '../../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import styles from './NaverLoginButtonStyles';

// 네이버 애플리케이션 키 정보
const consumerKey = 'BWqwiKuQdZgMQExzACXH';
const consumerSecret = 'OHTX96R9nQ';
const appName = 'WannabeFit';

// 네이버 SDK 초기화
NaverLogin.initialize({
  appName,
  consumerKey,
  consumerSecret,
});

// JWT 토큰을 저장하는 함수
const storeToken = async (token) => {
  try {
    await AsyncStorage.setItem('jwtToken', token);
    console.log('토큰 저장 완료');
  } catch (error) {
    console.error('토큰 저장 오류:', error);
  }
};

// JWT 토큰을 삭제하는 함수 (로그아웃 시 사용)
const removeToken = async () => {
  try {
    await AsyncStorage.removeItem('jwtToken');
    console.log('토큰 삭제 완료');
  } catch (error) {
    console.error('토큰 삭제 오류:', error);
  }
};

// 서버로 accessToken 전달
const sendAccessTokenToBack = async (accessToken) => {
  try {
    const response = await fetch(`${CONFIG.API_BASE_URL}/auth/login/naver`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ accessToken }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`서버 오류: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('백엔드 응답:', result);
    return { jwtToken: result.jwtToken, statusCode: response.status };
  } catch (error) {
    console.error('토큰 전송 오류:', error);
    Alert.alert('서버 연결 실패', 'JWT 토큰을 받아오는 도중 오류가 발생했습니다.');
    return null;
  }
};

// 로그인 버튼 컴포넌트
const NaverLoginButton = ({ navigation }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [failureResponse, setFailureResponse] = useState(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        console.log('JWT 토큰 없음, 로그인 필요');
      } else {
        console.log('JWT 토큰 존재:', token);
        await AsyncStorage.removeItem('jwtToken'); // 기존 토큰 삭제
      }
    };
  
    checkLoginStatus();
  }, []);
  


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

  // 로그인을 위한 함수
  const login = async () => {
    try {
      const { failureResponse, successResponse } = await NaverLogin.login();

      if (successResponse) {
        setIsLoggedIn(true);
        console.log('로그인 성공:', successResponse);

        const { jwtToken, statusCode } = await sendAccessTokenToBack(successResponse.accessToken);
        if (jwtToken) {
          await storeToken(jwtToken);

          // 상태 코드에 따라 화면 이동 처리
          if (statusCode === 200) {
            console.log('이미 등록된 사용자, Main 화면으로 이동');
            navigation.navigate('Welcome'); // 이미 등록된 사용자
          } else if (statusCode === 201) {
            navigation.navigate('InbodyInput', { jwtToken }); // 등록되지 않은 사용자
          }
        } else {
          console.error('Failed to get JWT token from server');
        }
      } else if (failureResponse) {
        setFailureResponse(failureResponse);
        Alert.alert('로그인 실패', '네이버 로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      Alert.alert('로그인 오류', '로그인 도중 오류가 발생했습니다.');
    }
  };

 // 로그아웃을 위한 함수
 const logout = async () => {
  try {
    console.log('로그아웃 시작');

    // 1. 네이버 SDK 로그아웃
    await NaverLogin.logout();
    console.log('네이버 로그아웃 성공');

    // 2. 네이버 서버에서 토큰 삭제
    await NaverLogin.deleteToken();
    console.log('네이버 토큰 삭제 성공');

    // 3. 클라이언트에서 JWT 토큰 확인 및 삭제
    const jwtToken = await AsyncStorage.getItem('jwtToken');
    if (!jwtToken) {
      console.warn('JWT 토큰이 없습니다. 로그아웃 중단.');
      Alert.alert('로그아웃 오류', '로그인 상태가 아닙니다.');
      return;
    }
    console.log('JWT 토큰 확인:', jwtToken);

    // JWT 디코딩
    const decodedToken = jwtDecode(jwtToken);
    const userId = decodedToken.userId;
    console.log('디코딩된 userId:', userId);

    // 4. 서버에 로그아웃 요청 보내기
    console.log('서버로 보낼 데이터:', { userId });
    const response = await fetch(`${CONFIG.API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({ userId }),
    });

    console.log('서버 응답 상태:', response.status);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`서버 로그아웃 오류: ${response.status} - ${errorText}`);
    }
    console.log('서버 로그아웃 성공');

    // 5. 클라이언트에서 JWT 토큰 삭제 및 상태 초기화
    await AsyncStorage.removeItem('jwtToken');
    setIsLoggedIn(false);
    console.log('JWT 토큰 및 AsyncStorage 초기화 완료');

    Alert.alert('로그아웃', '성공적으로 로그아웃되었습니다.');
  } catch (error) {
    console.error('로그아웃 오류:', error);
    Alert.alert('로그아웃 오류', '로그아웃 도중 오류가 발생했습니다.');
  }
};



  return (
    <View>
      {!isLoggedIn ? (
        <TouchableOpacity onPress={login}>
          <Image
          source={require('../../../../assets/images/naver.png')}
          style={styles.icon}  
        />
        </TouchableOpacity>
      ) : (
        <>
          <Text style={styles.successText}>로그인 성공!</Text>
        </>
      )}

      {failureResponse && (
        <Text style={styles.errorText}>로그인 실패: {failureResponse.message}</Text>
      )}
    </View>
  );
};

export default NaverLoginButton;
