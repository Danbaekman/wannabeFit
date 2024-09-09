import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  navbar: {
    alignItems: 'center',
    marginBottom: 20,
  },
  navbarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoBox: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 75,
    marginBottom: 20,
  },
  logoText: {
    textAlign: 'center',
    fontSize: 16,
  },
  buttonContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  nutritionContainer: {
    padding: 10,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
  },
  nutritionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  gaugeContainer: {
    marginBottom: 10,
  },
  goalMessageContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
});

export default styles;
