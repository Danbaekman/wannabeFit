import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5', // 전체 배경색 옅은 회색
  },
  calendarContainer: {
    backgroundColor: '#008080',
    paddingVertical: 10,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  arrowButton: {
    padding: 5,
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  dateNumber: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  selectedDate: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5', // "오늘의 총 섭취량"과 "식단" 부분의 배경은 흰색
    borderTopLeftRadius: 15, // 위쪽 둥근 모서리
    borderTopRightRadius: 15,
    marginTop: -10, // 달력과 자연스러운 연결
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  summaryBox: {
    backgroundColor: '#FFFFFF', // 각 섹션은 흰색 배경
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#008080',
    marginBottom: 10,
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
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '22%',
    aspectRatio: 1,
    backgroundColor: '#FFFFFF', // 정사각형 컨테이너는 흰색
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  gridItemText: {
    marginTop: 5,
    fontSize: 14,
    color: '#333',
  },
  goalText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
});

export default styles;
