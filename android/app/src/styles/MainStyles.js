import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    padding: 20,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#008080',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  dateText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  arrowButton: {
    padding: 5,
  },
  summaryBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#008080',
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  calorieRow: {
    marginBottom: 15,
  },
  calorieText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  macroItem: {
    width: '30%',
  },
  macroTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  macroText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  goalMessage: {
    textAlign: 'center',
    color: '#FF6347',
    fontWeight: 'bold',
    marginTop: 10,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  gridItem: {
    width: '45%',
    aspectRatio: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 20,
  },
  gridItemText: {
    marginTop: 5,
    fontSize: 14,
    color: '#333',
  },
  exerciseContainer: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  exerciseText: {
    fontSize: 14,
    color: '#333',
  },
  bold: {
    fontWeight: 'bold',
    color: '#008080',
  },
  statsBox: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  statsText: {
    fontSize: 16,
    color: '#008080',
    marginTop: 5,
  },
});

export default styles;
