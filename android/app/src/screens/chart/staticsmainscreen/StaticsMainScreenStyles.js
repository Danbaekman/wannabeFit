import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5F5F5',
      alignItems: 'center',
      padding: 20,
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    buttonContainer: {
      width: '100%',
    },
    button: {
      backgroundColor: '#FFFFFF',
      padding: 15,
      marginVertical: 10,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 2,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#008080',
      textAlign: 'center',
    },
  });
  export default styles;