import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 반투명 배경
  },
  modalContainer: {
    backgroundColor: '#333333',
    width: '100%',
    height: '85%', // 모달 높이
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  dragHandleContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  dragHandle: {
    width: 50,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ccc',
  },
  timerCircle: {
    width: 320,
    height: 320,
    borderRadius: 160,
    borderWidth: 20,
    borderColor: '#008080',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  timerText: {
    fontSize: 80,
    color: 'white',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 40,
  },
  startPauseButton: {
    backgroundColor: '#008080',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopButton: {
    marginLeft: 40, // 버튼 간 간격 유지
    backgroundColor: '#008080',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adjustButtonContainer: {
    marginTop:30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%', // 버튼들 간 간격 조정
  },
  adjustButton: {
    backgroundColor: '#008080',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2, 
    borderColor: '#008080', 
    borderStyle: 'dashed',
  },
  adjustButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default styles;
