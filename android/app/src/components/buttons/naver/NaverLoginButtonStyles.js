import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#03C75A',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#FF0000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
  successText: {
    color: 'green',
    marginTop: 10,
  },
    naverButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#03C75A',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      justifyContent: 'center',
    },
    naverIcon: {
      width: 20,
      height: 20,
      marginRight: 10,
    },
    naverText: {
      color: '#ffffff',
      fontWeight: 'bold',
      fontSize: 16,
    },
    icon: {
        width: 60, // 로고의 너비
        height: 60, // 로고의 높이
      },
  });
  
export default styles;