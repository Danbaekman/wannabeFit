import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#008080',
  },
  nextButtonText: {
    fontSize: 16,
    color: '#008080',
  },
  workoutList: {
    paddingVertical: 8,
  },
  workoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginVertical: 5,
  },
  selectedWorkoutItem: {
    borderColor: '#008080',
  },
  workoutName: {
    fontSize: 16,
    color: 'black',
  },
  trashText: {
    color: 'red',
    fontSize: 16,
  },
  deleteContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red', // 삭제 버튼 배경색
    width: 80, // 삭제 버튼 너비
    borderRadius: 8, // 모서리 둥글게
    marginVertical: 5,
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    padding: 10,
  },
});


export default styles;
