import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row', // 같은 행에 배치
    alignItems: 'center', // 세로 중앙 정렬
    justifyContent: 'center', // 양쪽 정렬
    paddingVertical: 10,
    paddingHorizontal: 20, // ✅ 좌우 여백을 전체 레이아웃과 동일하게 설정
  },
  backButton: {
    position: 'absolute',
    left: 0,
    zIndex: 10, // 다른 요소 위에 위치
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#008080',
    textAlign: 'center',
    flex: 1, // ✅ 제목을 중앙 정렬 (양쪽 버튼이 있을 경우 유연한 배치)
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  unitText: {
    fontSize: 16,
    color: '#555',
    marginLeft: 5,
  },
  foodNameInput: {
    height: 44,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 5,
    fontSize: 16,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40, // 높이 동일하게 유지
    width: 120,
    textAlign: 'right', 
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  submitButton: {
    marginTop: 60,
    backgroundColor: '#008080',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default styles;
