import React, { useEffect, useState } from 'react';
import { View, Text, Animated } from 'react-native';
import styles from './WelcomeScreenStyles';

const WelcomeScreen = ({ navigation }) => {
  const [fadeAnim] = useState(new Animated.Value(0)); // 페이드 애니메이션 상태

  useEffect(() => {
    // 애니메이션 실행: 투명도 0 -> 1 -> 0
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        delay: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // 애니메이션이 끝난 뒤 Main 화면으로 이동
      navigation.replace('Main');
    });
  }, [fadeAnim, navigation]);

  return (
    <View style={styles.container}>
        <Animated.Image
        source={require('../../../assets/images/WannabefitLogo.png')} // 로고 이미지 경로
        style={[styles.logo, { opacity: fadeAnim }]}
        resizeMode="contain"
      />
    </View>
  );
};

export default WelcomeScreen;
