import React, { useState } from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import NaverLogin from '@react-native-seoul/naver-login';
import CONFIG from '../../config';

const consumerKey = 'BWqwiKuQdZgMQExzACXH';
const consumerSecret = 'OHTX96R9nQ';
const appName = 'WannabeFit';

NaverLogin.initialize({
  appName,
  consumerKey,
  consumerSecret,
});

const NaverLoginButton = ( { navigation } ) => {
  const [success, setSuccessResponse] = useState();
  const [failure, setFailureResponse] = useState();
  const [getProfileRes, setGetProfileRes] = useState();

   //서버로 accessToken전달
   const sendAccessTokenToBack = async(accessToken) => {
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/auth/login/naver`, {  // 백엔드 서버의 엔드포인트를 입력
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accessToken: accessToken }),  // JSON으로 액세스 토큰을 전송
      });

      const result = await response.json();
      console.log('백엔드 응답:', result);
    } catch (error) {
      console.error('토큰 전송 오류:', error);
    }
  }

  const login = async () => {
    try {
      const { failureResponse, successResponse } = await NaverLogin.login();

      if (successResponse) {
        setSuccessResponse(successResponse);
        navigation.navigate('InbodyInput');
        console.log('로그인 성공:', successResponse);

        sendAccessTokenToBack(successResponse.accessToken);
      } else if (failureResponse) {
        setFailureResponse(failureResponse);
        console.log('로그인 실패:', failureResponse);
      }
    } catch (error) {
      console.error('로그인 오류:', error);
    }
  };

  const logout = async () => {
    try {
      await NaverLogin.logout();
      setSuccessResponse(undefined);
      setFailureResponse(undefined);
      setGetProfileRes(undefined);
    } catch (e) {
      console.error(e);
    }
  };

  const getProfile = async () => {
    try {
      if (success && success.accessToken) {
        const profileResult = await NaverLogin.getProfile(success.accessToken);
        setGetProfileRes(profileResult);
        console.log('사용자 프로필:', profileResult);
      }
    } catch (e) {
      console.error('프로필 가져오기 오류:', e);
      setGetProfileRes(undefined);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={login} style={styles.button}>
        <Text style={styles.buttonText}>네이버로 로그인</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={logout} style={styles.button}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>

      {success ? (
        <>
          <Text style={styles.successText}>로그인 성공! 액세스 토큰: {success.accessToken}</Text>
          <TouchableOpacity onPress={getProfile} style={styles.button}>
            <Text style={styles.buttonText}>Get Profile</Text>
          </TouchableOpacity>
          <View>
            <TouchableOpacity onPress={() => setSuccessResponse(undefined)} style={styles.button}>
              <Text style={styles.buttonText}>Clear Success State</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : null}

      {failure ? (
        <Text style={styles.errorText}>로그인 실패: {failure.message}</Text>
      ) : null}

      {getProfileRes ? (
        <Text style={styles.successText}>사용자 정보: {JSON.stringify(getProfileRes)}</Text>
      ) : null}
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
