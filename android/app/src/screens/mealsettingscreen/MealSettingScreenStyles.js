import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#008080',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 128, 128, 0.1)',
    borderRadius: 30,
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    marginRight: 5,
  },
  cancelText: {
    fontSize: 16,
    color: '#007AFF',
    marginLeft: 10,
  },
  header: {
    alignItems: 'center',
    marginTop: 10,
  },
  mealTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#008080',
    marginBottom: 10,
  },
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
