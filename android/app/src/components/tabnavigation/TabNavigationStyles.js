import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#008080',
    paddingVertical: 10,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  tabButton: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  tabButtonActive: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  tabButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  tabButtonTextActive: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
