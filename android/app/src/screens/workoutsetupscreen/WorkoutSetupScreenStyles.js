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
    borderStyle: 'dotted', // 점선 테두리
    borderRadius: 12, // 모서리 둥글게
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
    marginBottom: 15, // 버튼과 텍스트 사이 간격
  },
  addCircle: {
    width: 50,
    height: 50,
    borderRadius: 25, // 원형
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
  recordCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#008080',
    marginBottom: 10,
  },
  recordDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recordTime: {
    fontSize: 14,
    color: '#555',
  },
  recordSets: {
    fontSize: 14,
    color: '#555',
  },
  noRecordText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default styles;
