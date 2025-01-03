import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#008080',
  },
  statsSection: {
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    elevation: 2,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  goalSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 5,
  },
  goalStatus: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#008080',
  },
});
