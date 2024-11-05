// WorkoutEntryScreenStyles.js
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  scrollContentContainer: {
    padding: 16,
    backgroundColor: '#f0f0f0',
    flexGrow: 1,
    minHeight: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'center', // 날짜를 가운데 정렬
    alignItems: 'center',
    marginBottom: 10,
  },
  dateText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#008080',
    textAlign: 'center', // 가운데 정렬
  },
  completeButton: {
    position: 'absolute',
    right: 20,
    backgroundColor: '#008080',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  completeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  mainBox: {
    backgroundColor: '#ffffff', // 칸의 색을 흰색으로 설정
    padding: 20,
    borderRadius: 8,
    marginBottom: 15,
  },
  mainBoxTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 2,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  timeLabel: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  timeInput: {
    fontSize: 16,
    color: '#333',
    textAlign: 'right',
    flex: 1,
  },
  workoutContainer: {
    backgroundColor: '#ffffff', // 칸의 색을 흰색으로 설정
    padding: 20,
    marginBottom: 15,
    borderRadius: 8,
  },
  workoutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#008080',
    marginBottom: 10,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#008080',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  setNumber: {
    fontSize: 14,
    color: '#008080',
  },
  inputWithUnit: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 0.5, // Adjust flex to fit both input and unit
  },
  unitText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 4,
  },
  smallInput: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 5,
    textAlign: 'center',
  },
  largeInput: {
    flex: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginHorizontal: 5,
    padding: 5,
    textAlign: 'center',
  },
  memoInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 5,
    marginVertical: 8,
    fontSize: 16,
    color: '#333',
  },
  addSetText: {
    color: '#008080',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
  },
});

export default styles;
