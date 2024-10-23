import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
  },
  dateToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButton: {
    padding: 10,
  },
  navButtonText: {
    fontSize: 24,
    color: '#008080',
  },
  dateButtonFullWidth: {
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    padding: 5,
    borderWidth: 1,
    borderColor: '#008080',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#008080',
  },
  nutritionTitle: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
  },
  nutritionContainer: {
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: '#008080',
  },
  gaugeContainer: {
    marginBottom: 20,
  },
  subTitle: {
    color: 'black',
    fontWeight: 'bold',
    paddingBottom: 10,
  },
  nutrientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  nutrientColumn: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '30%',
  },
  nutrientText: {
    fontSize: 16,
    color: 'black',
    paddingBottom: 5,
  },
  progressBar: {
    width: '100%',
  },
  goalMessageContainer: {},
  mealPlanRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  mealBox: {
    width: '30%',
    alignItems: 'center',
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#008080',
    borderRadius: 10,
  },
  mealText: {
    fontSize: 16,
    marginTop: 10,
    color: 'black',
  },
  snackBox: {
    width: '30%',
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#008080',
    borderRadius: 10,
    marginBottom: 20,
  },
  snackText: {
    fontSize: 16,
    textAlign: 'center',
    color: 'black',
  },
});

export default styles;
