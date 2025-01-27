import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 반투명 배경
  },
  modalContainer: {
    backgroundColor: '#fff',
    width: '100%',
    height: '50%', // 모달 높이
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  dragHandleContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  dragHandle: {
    width: 50,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ccc',
  },
  closeButtonContainer: {
    position: 'absolute',
    top: 10,
    right: 15,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0', // 연한 회색 배경
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000', // 검정색 제목
    textAlign: 'left', // 좌측 정렬
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    width: '100%',
    marginBottom: 20,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#008080',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%', // 텍스트 입력 필드와 동일한 너비
    alignSelf: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default styles;
