// src/screens/MainScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { ProgressBar } from '@react-native-community/progress-bar-android'; // 경로 변경
import styles from '../styles/MainStyles';  // 스타일 파일 경로가 올바른지 확인하세요

const MainScreen = () => {
  return (
    <ScrollView style={styles.container}>
      {/* NavBar */}
      <View style={styles.navbar}>
        <Text style={styles.navbarTitle}>Wannabe Fit</Text>
      </View>

      {/* 로고 이미지 섹션 */}
      <View style={styles.logoContainer}>
        <View style={styles.logoBox}>
          <Text style={styles.logoText}>운동 프로그램을 소개받고 원하는 몸을 만들어보세요</Text>
        </View>
      </View>

      {/* 운동 프로그램 보러가기 버튼 */}
      <View style={styles.buttonContainer}>
        <Button title="운동 프로그램 보러가기" onPress={() => {}} />
      </View>

      {/* 오늘의 섭취 영양성분 */}
      <Text style={styles.nutritionTitle}>오늘의 섭취 영양성분</Text>
      <View style={styles.nutritionContainer}>
        {/* 섭취칼로리 */}
        <View style={styles.gaugeContainer}>
          <Text>칼로리: 1200 kcal</Text>
          <ProgressBar styleAttr="Horizontal" indeterminate={false} progress={0.6} />
        </View>

        {/* 단백질 */}
        <View style={styles.gaugeContainer}>
          <Text>단백질: 80g</Text>
          <ProgressBar styleAttr="Horizontal" indeterminate={false} progress={0.5} />
        </View>

        {/* 지방 */}
        <View style={styles.gaugeContainer}>
          <Text>지방: 40g</Text>
          <ProgressBar styleAttr="Horizontal" indeterminate={false} progress={0.3} />
        </View>

        {/* 나트륨 */}
        <View style={styles.gaugeContainer}>
          <Text>나트륨: 1000mg</Text>
          <ProgressBar styleAttr="Horizontal" indeterminate={false} progress={0.8} />
        </View>
      </View>

      {/* 목표 섭취량 메시지 */}
      <View style={styles.goalMessageContainer}>
        <Text>목표 섭취량에 미달하였습니다.</Text>
      </View>
    </ScrollView>
  );
};

export default MainScreen;  // default export 사용
