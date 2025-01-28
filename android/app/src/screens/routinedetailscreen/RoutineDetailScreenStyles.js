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
    color: 'black',
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
    backgroundColor: '#008080', // 삭제 버튼 배경색
    width: 80, // 삭제 버튼 너비
    borderRadius: 8, // 모서리 둥글게
    marginVertical: 5,
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    padding: 10,
    backgroundColor: '#008080',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  addButton: {
    backgroundColor: '#008080',
    position: 'absolute',
    bottom: 80,
    right: 40,
    paddingVertical: 10,
    paddingHorizontal: 20,
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
noText: {
  fontSize: 18, 
  textAlign: 'center', 
  marginTop: 20
}

});


export default styles;
