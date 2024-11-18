import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    width: '100%',
    alignSelf: 'center',
    flex:1,
  },
  mytraining: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#008080',
    marginBottom: 10,
    marginTop: 30,
    alignSelf: 'flex-start',
    width: '100%',
  },
  buttonContainer: {
    width: '100%',
    marginVertical: 10,
  },
  routineButton: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  routineButtonText: {
    fontSize: 18,
    color: '#333',
  },
  addButton: {
    backgroundColor: '#008080',
    position: 'absolute',
    bottom: 20,
    right: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  newRoutineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  newRoutineInput: {
    flex: 1,
    fontSize: 18,
    color: '#333',
  },
  completeButton: {
    marginLeft: 10,
    backgroundColor: '#008080',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  navbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default styles;
