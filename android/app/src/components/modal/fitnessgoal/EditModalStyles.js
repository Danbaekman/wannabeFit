import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#f2f2f2',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#008080',
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 40,
  },
  inputLabel: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  // 목표 칼로리 스타일
  caloriesInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // 입력값과 Kcal 중앙 정렬
  },
  caloriesInput: {
    borderWidth: 0, 
    fontSize: 34, 
    fontWeight: 'bold',
    color: '#000', 
    textAlign: 'center', 
  },
  caloriesUnit: {
    fontSize: 30,
    color: '#000'
  },
  macroInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // 좌우 배치
  },
  macroLabel: {
    fontSize: 16,
    color: '#555',
    flex: 1,
  },
  macroInput: {
    fontSize: 18,
    color: '#000',
    textAlign: 'right',
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 8,
  },
  submitButton: {
    backgroundColor: '#008080',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default styles;
