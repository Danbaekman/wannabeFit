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
  },
  mytraining: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#008080',
    alignSelf: 'center',
    width: '100%',
    marginBottom: 20,
    marginTop: 20,
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
    minHeight: 540,
  },
  icon: {
    width: 200,
    height: 200,
    marginBottom: 10, // 아이콘과 타이틀 간격 조정
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5, // 타이틀과 서브타이틀 간격 줄이기
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 20, // 서브타이틀과 버튼 간격
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
