import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  modalContainer: {
    justifyContent: 'flex-end', // ✅ 아래에서 위로 올라오게 설정
    margin: 0, // ✅ 전체 화면 사용
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'flex-start', 
    color: '#008080'
  },
  modalDescription: {
    fontSize: 16,
    color: '#333',
    textAlign: 'left', // ✅ 좌측 정렬
    width: '100%', // ✅ 전체 너비 사용
    marginBottom: 20,
  },
  modalDescription2: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center', // ✅ 좌측 정렬
    width: '100%', // ✅ 전체 너비 사용
    marginBottom: 20,
  },
  boldText: {
    fontWeight: 'bold', // ✅ 특정 텍스트 Bold
  },
  appIcon: {
    width: 60,
    height: 60,
    marginVertical: 10,
    borderRadius: 15, // ✅ 모서리를 둥글게 만듦
    overflow: 'hidden', // ✅ 둥근 테두리 적용 보장
  },
  modalLoginButton: {
    backgroundColor: '#008080',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 10,
  },
  modalLoginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
