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
    width: 50, // 박스 너비
    alignItems: 'center', // 중앙 정렬
    justifyContent: 'center',
    paddingVertical: 10, // 위아래 여백
  },
  dateNumber: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  selectedDateBox: {
    borderWidth: 2,
    borderColor: '#FFFFFF', // 선택된 박스 테두리 강조
    borderRadius: 10, // 둥근 모서리
  },
  selectedDateNumber: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  selectedDay: {
    fontSize: 12,
    color: '#FFFFFF',
    marginTop: 2,
  },
  highlightedDay: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 2,
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
  sectionTitle: {
    fontSize: 20,
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
  calorieGoalText: {
    color: '#000', // 검정색
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
  gridItem: {
    width: '45%', // 가로 크기 키움 (줄당 2개 배치)
    aspectRatio: 1, // 정사각형 유지
    backgroundColor: '#FFFFFF',
    borderRadius: 15, // 둥근 모서리 강조
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0', // 아래쪽 여백 키움
    shadowColor: '#000', // 그림자 추가
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1, // 안드로이드 그림자
    position: 'relative', 
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20, // 줄 간 여백 키움
  },
  gridContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  gridItemText: {
    position: 'absolute', // 하단에 고정
    bottom: 10, // 하단 여백
    fontSize: 18,
    color: '#333',
    textAlign: 'center', // 텍스트 가운데 정렬
  },
  goalContainer: {
    flexDirection: 'row', // 텍스트와 아이콘을 나란히 배치
    alignItems: 'center', // 수직 정렬
    marginBottom: 10,
    backgroundColor: 'transparent', 
  },
  goalPrefix: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666', // '내 목표:'의 색상
  },
  goalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#008080', 
  },
  centerHighlightBox: {
    position: 'absolute',
    top: 40, // 달력 아래 위치 조정
    left: '50%',
    transform: [{ translateX: -40 }], // 박스의 중앙 정렬 (박스 크기의 절반)
    width: 80, // 박스 너비
    height: 50, // 박스 높이
    backgroundColor: '#FFFFFF', // 강조 박스 배경색
    borderRadius: 10, // 강조 박스 테두리 둥글게
    zIndex: 10, // 강조 박스가 위에 보이도록 설정
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000', // 그림자 추가
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // 안드로이드 그림자
  },
  highlightedDate: {
    fontSize: 18,
    color: '#008080', // 강조된 날짜 텍스트 색상
    fontWeight: 'bold',
    textAlign: 'center',
  },
  mealCalories: {
    position: 'absolute',
    top: 5,
    right: 5,
    fontSize: 16, // 기본 칼로리 숫자 크기
    color: '#808080',
  },
  kcalText: {
    fontSize: 12, // kcal 텍스트 크기 작게
    color: '#808080', // 색상 유지
  },
  plusIcon: {
    position: 'absolute', // 부모 박스의 정가운데 위치
    top: '50%', // 수직 중앙
    left: '50%', // 수평 중앙
    transform: [{ translateX: -25 }, { translateY: -25 }], // 아이콘 크기의 절반만큼 이동
  },
});

export default styles;
