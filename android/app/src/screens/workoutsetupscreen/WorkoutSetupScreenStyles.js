import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    width: '100%',
  },
  mytraining: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#008080',
    alignSelf: 'center',
    width: '100%',
    marginBottom: 10,
    marginTop: 30,
  },
  routineCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
    width: '100%',
    minHeight: 556,
  },
  icon: {
    width: 240,
    height: 240,
    marginBottom: 10, // 아이콘과 타이틀 간격 조정
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 30,
    marginBottom: 5, // 타이틀과 서브타이틀 간격 줄이기
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
    marginBottom: 10, // 서브타이틀과 버튼 간격
  },
  startButton: {
    backgroundColor: '#008080',
    paddingVertical: 10,
    paddingHorizontal: 60,
    borderRadius: 20,
    marginTop: 'auto', // 버튼이 카드 박스 하단에 붙도록 설정
  },
  startButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  navbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default styles;
