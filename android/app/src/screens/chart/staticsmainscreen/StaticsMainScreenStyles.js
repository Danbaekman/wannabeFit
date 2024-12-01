import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#008080', // 상단 여백 배경색
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 15, // MainScreen과 동일한 둥근 모서리
    borderTopRightRadius: 15, // MainScreen과 동일한 둥근 모서리
    paddingTop: 10, // 컨텐츠 상단 여백
    paddingHorizontal: 20, // 좌우 여백
  },
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
  summaryContainer: {
    marginBottom: 20, // 아래 컨텐츠와 간격 추가
  },
  totalWorkoutTime: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  daysTracked: {
    fontSize: 16,
    color: '#555',
  },
  buttonContainer: {
    paddingVertical: 10,
  },
  statButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
    elevation: 2,
  },
  statButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
});
