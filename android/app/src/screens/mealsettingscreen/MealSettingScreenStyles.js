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
    marginVertical: 5,
    marginHorizontal: 10,
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
  },
  tabContainer: { 
    flexDirection: 'row',
    marginTop: 10
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
  
});

export default styles;
