import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  kakaoCircle: {
    backgroundColor: '#FEE500',
    width: 60, // 원형 크기
    height: 60,
    borderRadius: 30, // 원형으로 만들기
    justifyContent: 'center',
    alignItems: 'center', 
  },
  icon: {
    width: 40, // 로고의 너비
    height: 40, // 로고의 높이
  },
});

export default styles;