import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white'
  },
  header: {
    alignItems: 'center',
    marginVertical: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
  },
  tabMenu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  tabText: {
    fontSize: 16,
    color: 'gray',
  },
  activeTab: {
    fontWeight: 'bold',
    color: 'black',
  },
  setRegisterContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  setTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  setDescription: {
    color: 'gray',
    marginBottom: 10,
  },
  registerButton: {
    backgroundColor: '#008080',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 배경 투명도
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  foodName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  foodDetail: {
    fontSize: 16,
    marginBottom: 5, // 각 항목 간의 간격을 추가
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#008080',
  },
  itemContainer: {
    borderWidth: 1,
    borderColor: '#00A896',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  foodCalories: {
    fontSize: 14,
    color: '#999',
  },
});

export default styles;
