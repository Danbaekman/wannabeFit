import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './AccountManagementScreenStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONFIG from '../../config';

const AccountManagementScreen = ({ navigation }) => {
  const handleLogout = async () => {
    Alert.alert(
      'Wannabefit',
      '로그아웃하시겠습니까?',
      [
        { text: '아니오', style: 'cancel' },
        {
          text: '네',
          onPress: async () => {
            await AsyncStorage.removeItem('jwtToken');
            navigation.replace('Launch'); // 로그인 화면으로 이동
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Wannabefit',
      '정말 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
      [
        { text: '아니오', style: 'cancel' },
        {
          text: '네',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('jwtToken');
              if (!token) return;
  
              const response = await fetch(`${CONFIG.API_BASE_URL}/user/delete`, { 
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
              });
  
              if (response.ok) {
                await AsyncStorage.multiRemove(['jwtToken', 'lastLoginMethod']); // ✅ 계정 삭제 시 `lastLoginMethod`도 함께 삭제
                navigation.replace('Launch');
              } else {
                Alert.alert('오류', '계정 삭제에 실패했습니다.');
              }
            } catch (error) {
              Alert.alert('오류', '서버와 연결할 수 없습니다.');
            }
          },
        },
      ]
    );
  };
  


  return (
    <View style={styles.container}>
      {/* 🔼 상단: 뒤로가기 버튼 */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={32} color="black" />
      </TouchableOpacity>

      {/* 🔽 바로 밑: 제목 */}
      <Text style={styles.headerText}>내 계정 관리</Text>

      {/* 🔽 하단: 로그아웃 & 회원 탈퇴 버튼 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.accountButton} onPress={handleLogout}>
          <Text style={styles.accountButtonText}>로그아웃</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
          <Text style={styles.deleteButtonText}>회원 탈퇴</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AccountManagementScreen;
