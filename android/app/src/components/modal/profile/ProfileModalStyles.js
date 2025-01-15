import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  modalContainer: {
    margin: 0,
    justifyContent: 'flex-end', // 하단에 위치
  },
  modalContent: {
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#008080',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#008080',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalCloseButton: {
    marginTop: 10,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2, // 테두리 추가
    borderColor: '#008080', // 테두리 색상
    borderRadius: 8, // 둥근 테두리
    backgroundColor: 'white', // 배경색 흰색
  },
  modalCloseButtonText: {
    color: '#008080',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default styles;
