import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#008080', // 초록색 배경
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 160, // 로고 너비 (앱 아이콘 크기)
    height: 160, // 로고 높이 (앱 아이콘 크기)
    borderRadius: 20, // 둥근 모서리
    marginBottom: 20, // 아래 텍스트와 간격
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '400',
    color: '#fff',
  },
});

export default styles;
