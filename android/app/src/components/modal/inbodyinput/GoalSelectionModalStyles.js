import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: 'flex-end', // 아래에서 위로 올라오는 스타일
    margin: 0, 
  },
  modalContent: {
    width: '100%', // 가로 전체 확장
    backgroundColor: '#fff',
    borderTopLeftRadius: 20, // 모서리 둥글게
    borderTopRightRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 25,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    padding: 5,
  },
  closeButtonText: {
    fontSize: 22,
    color: '#333',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#008080',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  modalText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: 'black',
  },
  modalDescription: {
    fontSize: 14,
    color: '#666',
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  checkCircleSelected: {
    borderColor: '#008080',
    backgroundColor: '#008080',
  },
  completeButton: {
    backgroundColor: '#008080',
    width: '100%', // 완료 버튼 가로 길이 전체 확장
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 40,
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default styles;
