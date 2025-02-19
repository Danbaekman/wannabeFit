import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import styles from './LoginHistoryModalStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import NaverLogin from '@react-native-seoul/naver-login';
import CONFIG from '../../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; // ✅ useNavigation 추가


const LoginHistoryModal = ({ isVisible, onClose, lastLoginMethod}) => {
    const navigation = useNavigation();
  // 로그인 방식에 따른 Bold 적용
  const getLoginMethodText = () => {
    switch (lastLoginMethod) {
      case 'naver':
        return <Text>최근에 <Text style={styles.boldText}>네이버</Text> 로 로그인한 이력이 있습니다.</Text>;
      case 'google':
        return <Text>최근에 <Text style={styles.boldText}>구글</Text> 로 로그인한 이력이 있습니다.</Text>;
      case 'kakao':
        return <Text>최근에 <Text style={styles.boldText}>카카오</Text> 로 로그인한 이력이 있습니다.</Text>;
      default:
        return <Text>최근 로그인 기록이 없습니다.</Text>;
    }
  };

  const autoLogin = async () => {
    if (!lastLoginMethod) return;

    try {
      let accessToken;
      if (lastLoginMethod === 'naver') {
        const { successResponse } = await NaverLogin.login();
        if (!successResponse) throw new Error('네이버 로그인 실패');
        accessToken = successResponse.accessToken;
      }
      // TODO: Google, Kakao 추가
      // else if (lastLoginMethod === 'google') { ... }
      // else if (lastLoginMethod === 'kakao') { ... }

      // ✅ 백엔드에 accessToken 전달 후 JWT 토큰 저장
      const response = await fetch(`${CONFIG.API_BASE_URL}/auth/login/${lastLoginMethod}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken }),
      });

      if (!response.ok) throw new Error(`서버 오류: ${response.status}`);
      const result = await response.json();
      await AsyncStorage.setItem('jwtToken', result.jwtToken);
      navigation.replace('Welcome') // ✅ 로그인 성공 후 Welcome 화면으로 이동
    } catch (error) {
      console.error(`${lastLoginMethod} 로그인 오류:`, error);
    }
  };


  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose} // ✅ 배경 터치 시 닫기
      swipeDirection="down" // ✅ 아래로 스와이프하면 닫힘
      onSwipeComplete={onClose}
      backdropOpacity={0.5} // ✅ 배경 투명도 설정
      style={styles.modalContainer} // ✅ 모달 스타일 적용
      animationIn="slideInUp"
      animationOut="slideOutDown"
    >
      <View style={styles.modalContent}>
        {/* 닫기 버튼 */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>

        <Text style={styles.modalTitle}>최근 로그인 기록</Text>

        <Text style={styles.modalDescription}>{getLoginMethodText()}</Text>

        {/* 앱 아이콘 */}
        <Image
          source={require('../../../../assets/images/WannabefitLogo.png')} // 앱 아이콘
          style={styles.appIcon}
        />

        <Text style={styles.modalDescription2}>
          해당 계정을 사용하여 워너비핏에 로그인하십시오.
        </Text>

        {lastLoginMethod && (
          <TouchableOpacity style={styles.modalLoginButton} onPress={autoLogin}>
            <Text style={styles.modalLoginButtonText}>로그인</Text>
          </TouchableOpacity>
        )}
      </View>
    </Modal>
  );
};

export default LoginHistoryModal;
