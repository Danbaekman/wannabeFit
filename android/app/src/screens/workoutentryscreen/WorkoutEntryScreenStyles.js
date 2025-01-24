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
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#008080',
    textAlign: 'center',
  },
  completeButton: {
    position: 'absolute',
    right: 2,
    backgroundColor: '#008080',
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 15,
  },
  completeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  mainBox: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 8,
    marginBottom: 15,
  },
  mainBoxTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  routineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  },
  workoutContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginBottom: 15,
    borderRadius: 8,
  },
  workoutTitle: {
    fontSize: 16,
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
    flex: 0.5,
  },
  unitText: {
    fontSize: 14,
    color: '#7D7D7D',
    marginLeft: 4,
  },
  smallInput: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 1,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  largeInput: {
    flex: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginHorizontal: 5,
    padding: 1,
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
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colonText: {
    fontSize: 16,
    color: '#333',
    marginHorizontal: 0, // 여백을 제거
  },
});

export default styles;
