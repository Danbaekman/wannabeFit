import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#008080',
  },
  contentContainer: {
    flexGrow: 1, 
    padding: 20,
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  mytraining: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#008080',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%',
    marginVertical: 10,
  },
  routineButton: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  routineButtonText: {
    fontSize: 18,
    color: '#333',
  },
  addButton: {
    backgroundColor: '#008080',
    position: 'absolute',
    bottom: 60,
    right: 40,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 25,
    alignItems: 'center', // 수평 중앙 정렬
    justifyContent: 'center', // 수직 중앙 정렬
  },
  addButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center', // 텍스트 정렬
    lineHeight: 30, // fontSize와 동일하게 설정
  },
  newRoutineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  newRoutineInput: {
    flex: 1,
    fontSize: 18,
    color: '#333',
  },
  completeButton: {
    marginLeft: 10,
    backgroundColor: '#008080',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
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
  deleteContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#008080', // 삭제 버튼 배경색
    width: 60, // 삭제 버튼의 너비
    height: 56, // `routineButton`의 높이와 동일하게 설정
    borderRadius: 8,
    marginBottom: 0, // 추가 여백 제거
    marginTop: 0, // 추가 여백 제거
    marginVertical: 0, // 상하 여백 제거
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  
  
});

export default styles;
