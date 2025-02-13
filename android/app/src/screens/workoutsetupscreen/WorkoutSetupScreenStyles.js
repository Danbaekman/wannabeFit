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
  warningText: {
    fontSize: 14,
    color: '#FF0000',
    textAlign: 'center',
    marginBottom: 20,
  },
  routineSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  routineTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  routineSubtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
  },
  addRoutineContainer: {
    borderWidth: 2,
    borderColor: '#008080',
    borderStyle: 'dotted',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    height: 150,
  },
  addRoutineText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#008080',
    marginBottom: 15,
  },
  addCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#008080',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCircleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#555',
  },
  recordSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  recordTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  recordCard: {
    borderBottomWidth: 1,  // ✅ 밑줄 추가
    borderBottomColor: '#ccc',  // ✅ 회색 줄 색상 설정
    borderRadius: 0,  // ✅ 둥근 모서리 제거 (불필요)
    padding: 5,
    marginBottom: 20,
    backgroundColor: 'transparent',  // ✅ 배경색 제거
},
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recordSquare: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#D0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordSquareText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#008080',
  },
  recordRightSection: {
    flexDirection: 'row', // 버튼과 시간/세트 수 나란히
    alignItems: 'center', // 세로 가운데 정렬
  },

  recordTimeWrapper: {
    flexDirection: 'row',
    alignItems: 'center', // 세로 가운데 정렬
    marginBottom: 5, // 시간과 세트 수 간격 조정
  },
  timeAndSetsWrapper: {
    flexDirection: 'column', // 세로 배치
    alignItems: 'flex-end', // 우측 정렬
    marginRight: 10, // 버튼과 간격 조정
    width: 'auto', // 우측 정렬을 위해 텍스트 폭 제한 제거
  },
  recordTime: {
    fontSize: 14,
    color: '#555',
    paddingLeft: 5, 
  },
  recordSets: {
    fontSize: 14,
    color: '#555', 
  },
  chevronButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  noRecordText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#008080',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  exerciseContainer: {
    marginBottom: 15,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  exerciseDetails: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  memoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#008080',
    marginTop: 15,
  },
  memoText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#008080',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default styles;
