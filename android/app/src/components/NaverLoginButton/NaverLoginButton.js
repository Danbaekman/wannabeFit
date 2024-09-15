import React, { useState } from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import NaverLogin from '@react-native-seoul/naver-login';

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

  const login = async () => {
    try {
      const { failureResponse, successResponse } = await NaverLogin.login();

      if (successResponse) {
        setSuccessResponse(successResponse);
        navigation.navigate('Main');
        console.log('로그인 성공:', successResponse);
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
