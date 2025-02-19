import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50, // 상단 여백
    justifyContent: 'space-between', // 버튼을 하단으로 밀기
  },
  backButton: {
    position: 'absolute',
    top: 15,
    left: 15,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 20, // 뒤로가기 버튼 바로 아래에 위치
  },
  buttonContainer: {
    marginBottom: 30, // 하단 고정
  },
  accountButton: {
    backgroundColor: '#008080',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  accountButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#008080',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default styles;
