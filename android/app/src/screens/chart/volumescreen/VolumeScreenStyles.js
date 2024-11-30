import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5F5F5',
      padding: 20,
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
    },
    filterContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 20,
    },
    filterButton: {
      padding: 10,
      borderRadius: 20,
      backgroundColor: '#E0E0E0',
    },
    activeFilter: {
      backgroundColor: '#008080',
    },
    filterText: {
      color: '#FFFFFF',
      fontWeight: 'bold',
    },
    chart: {
      borderRadius: 16,
      marginVertical: 10,
    },
    summaryContainer: {
      marginTop: 20,
      padding: 10,
      backgroundColor: '#FFFFFF',
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 2,
    },
    summaryText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 5,
    },
  });
export default styles;