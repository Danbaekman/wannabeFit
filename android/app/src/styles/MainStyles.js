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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  dateBox: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    paddingVertical: 5,
  },
  dateNumber: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  selectedDateBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
  },
  selectedDateNumber: {
    color: '#008080',
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 15, // 위쪽 둥근 모서리
    borderTopRightRadius: 15,
    marginTop: -10, // 달력과 자연스러운 연결
    paddingTop: 20,
    paddingHorizontal: 20,
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
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 10, // 아이템 간 여백 추가
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
  
  centerHighlightBox: {
    position: 'absolute',
    top: 40, // 달력 아래 위치 조정
    left: '50%',
    transform: [{ translateX: -30 }], // 중앙 정렬 (박스 크기의 절반)
    width: 60,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    zIndex: 10,
  },
  
  
});

export default styles;
