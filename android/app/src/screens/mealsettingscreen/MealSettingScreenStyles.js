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
  });

  export default styles;
