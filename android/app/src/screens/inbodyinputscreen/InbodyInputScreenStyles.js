import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: "#008080",
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'black',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 2,
  },

  // 성별 선택 스타일
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  genderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ccc',
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  selectedGenderButton: {
    borderColor: '#008080',
    backgroundColor: '#e0f7f7',
  },
  genderButtonText: {
    fontSize: 16,
  },
  selectedGenderText: {
    color: '#008080',
    fontWeight: 'bold',
  },

  // 운동 빈도 선택 (Picker 스타일 추가)
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
    justifyContent: 'center',
    position: 'relative',
  },
  picker: {
    height: 50,
    color: '#000',
  },
  pickerPlaceholderText: {
    position: 'absolute',
    top: 15,
    left: 12,
    fontSize: 16,
    color: '#999',
  },

  // 다음 버튼 스타일
  nextButton: {
    backgroundColor: '#008080',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default styles;
