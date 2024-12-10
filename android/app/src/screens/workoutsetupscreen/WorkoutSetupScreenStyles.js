import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  mytraining: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#008080',
    marginBottom: 10,
    marginTop: 30,
    alignSelf: 'flex-start',
    width: '100%',
  },
  dateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#008080',
    textAlign: 'center',
    marginBottom: 10,
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
    backgroundColor: '#E8F5F5',
    borderRadius: 8,
    padding: 15,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recordRightSection: {
    flexDirection: 'row', // 버튼과 시간/세트 수 나란히
    alignItems: 'center', // 세로 가운데 정렬
  },
  timeAndSetsWrapper: {
    flexDirection: 'column', // 세로 배치
    alignItems: 'flex-end', // 우측 정렬
    marginRight: 10, // 버튼과 간격 조정
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
  recordTimeWrapper: {
    flexDirection: 'row',
    alignItems: 'center', // 세로 가운데 정렬
    marginRight: 10, // 세트 수와 간격 조정
  },
  
  recordInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordDetails: {
    flexDirection: 'row', // 가로 정렬
    justifyContent: 'flex-end', // 오른쪽 정렬
    alignItems: 'center', // 수직 가운데 정렬
    gap: 10, // 시계와 버튼 간격
  },
  
  recordTime: {
    fontSize: 14,
    color: '#555',
    marginLeft: 5, // 아이콘과 간격
  },
  
  recordSets: {
    fontSize: 14,
    color: '#555',
    marginRight: 10, // 버튼과 간격 조정
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
