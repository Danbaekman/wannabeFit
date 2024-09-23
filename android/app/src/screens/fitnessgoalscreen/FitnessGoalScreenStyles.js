import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  goalContainer: {
    marginBottom: 30,
  },
  goalHeader: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-end'
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'black',
  },
  subtitle: {
    fontSize: 14,
    color: '#555', // 부드러운 회색으로 변경 (필요시)
  },
  caloriesContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#008080',    // 테두리 색상
    borderRadius: 10,
    padding: 10,
  },
  caloriesText: {
    fontSize: 16,
    textAlign: "center"
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',  // 회색 줄 색상
    marginVertical: 10, // 위 아래 간격
  },
  targetCaloriesText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: "center",
    color: 'black',
    paddingTop: 12,
  },
  macroContainer: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 20,
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  macroLabel: {
    fontSize: 16,
    flex: 1,
  },
  macroValue: {
    fontSize: 16,
    flex: 1,
    textAlign: 'center',
  },
  macroKcal: {
    fontSize: 16,
    flex: 1,
    textAlign: 'right',
  },
});

export default styles;
