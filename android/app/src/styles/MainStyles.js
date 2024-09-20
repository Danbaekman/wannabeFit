import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },

  buttonContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  nutritionContainer: {
    padding: 10,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
  },
  nutritionTitle: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  gaugeContainer: {
    marginBottom: 10,
  },
  goalMessageContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  dateButton: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0',
    marginVertical: 10,
    borderRadius: 5,
    borderWidth: 1, // 테두리 추가
    borderColor: '#008080', // 테두리 색상
  },
  dateButtonText: {
    fontSize: 16,
    color: '#008080',
  },
});

export default styles;
