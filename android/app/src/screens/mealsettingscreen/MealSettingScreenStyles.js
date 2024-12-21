import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#008080',
  },
  searchWrapper: {
    flexDirection: 'row', // 가로 배치
    alignItems: 'center',
    justifyContent: 'space-between', // 좌우로 분리
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 128, 128, 0.1)',
    borderRadius: 30,
    paddingHorizontal: 10,
    height: 40, // 검색창 세로 크기 축소
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    marginRight: 5,
  },
  cancelText: {
    fontSize: 16,
    color: 'rgba(0, 128, 128, 0.6)',
    marginLeft: 10,
  },
  header: {
    alignItems: 'flex-start',
    marginTop: 10,
  },
  mealTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#008080',
    marginBottom: 5,
    marginTop:10,
  },
  tabContainer: { 
    flexDirection: 'row',
    marginTop: 10,
  },
  registerButton: { marginTop: 10, alignSelf: 'flex-center', marginHorizontal: 10 },
  registerButtonText: { color: '#008080', fontSize: 16, fontWeight: 'bold' },
  tabButton: { flex: 1, alignItems: 'center' },
  tabText: { fontSize: 16, color: '#555' },
  activeTabText: { color: '#008080', fontWeight: 'bold' },
  activeTabLine: { width: '100%', height: 2, backgroundColor: '#008080', marginTop: 5 },

  whiteBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
    flex: 1, // 높이를 부모에 맞추도록 설정
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#555',
  },
  noResultsText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 14,
  },
  mealContainer: {
    marginBottom: 10,
  },
  mealType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
  },
  totalCalories: {
    fontSize: 16,
    color: '#999',
  },
  itemSeparator: {
    height: 1, // 선의 높이
    backgroundColor: '#CCCCCC', // 회색
    marginVertical: 5, // 위아래 간격
  },
  directInputButton: {
    backgroundColor: '#008080', // 회색 배경색
    paddingVertical: 10, // 세로 여백
    borderRadius: 10, // 둥근 모서리
    marginVertical: 5, // 위아래 여백
    alignSelf: 'stretch', // 버튼을 부모의 가로 크기에 맞춤
    borderWidth: 2, // 테두리 두께
    borderColor: 'rgba(0, 128, 128, 0.1)', // 검색창 배경색과 동일한 테두리 색상
  },
  directInputText: {
    color: '#fff', // 글자색
    fontSize: 16, // 글자 크기
    textAlign: 'center', // 중앙 정렬
    fontWeight: 'bold', // 글자 굵기
  },
  foodRow: {
    flexDirection: 'row', // 세로 방향으로 배치
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0', // 밑줄
  },
  foodInfo: {
    flex: 1,
    flexDirection: 'column', // 음식 이름과 칼로리를 세로로 배치
  },
  foodName: {
    fontSize: 16,
    color: '#000', // 검정색
  },
  foodCalories: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555', // 회색
  },
  editIcon: {
    marginLeft: 10,
  },

  editModeButton: {
    marginLeft: 'auto',
    padding: 5,
    borderRadius: 5,
    backgroundColor: '#008080',
  },
  editButtonText: {
    color: '#fff'
  },
  editControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  editButton: {
    marginRight: 10,
  },
  deleteButton: {
    marginLeft: 10,
  },
  titleWrapper: {
    flexDirection: 'row', // 가로 정렬
    alignItems: 'center', // 세로 중앙 정렬
    justifyContent: 'space-between', // 좌우로 분리
  },
  
});

export default styles;
