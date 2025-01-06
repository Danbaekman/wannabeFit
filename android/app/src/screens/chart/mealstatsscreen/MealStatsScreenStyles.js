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
  pieChartContainer: {
    flexDirection: 'row', // 가로 정렬
    justifyContent: 'space-evenly', // 균등 간격 배치
    alignItems: 'center', // 세로 가운데 정렬
    flexWrap: 'nowrap', // 줄바꿈 방지
    paddingVertical: 10,
    width: '100%', // 부모 컨테이너가 화면의 전체를 차지하도록 설정
  },
  pieChartWrapper: {
    flex: 1, // 요소가 균등한 크기를 가지도록 설정
    maxWidth: 120, // 그래프와 텍스트의 최대 너비 설정
    alignItems: 'center', // 가운데 정렬
    marginBottom: 20, // 하단 여백
  },
  pieChartText: {
    fontSize: 12, // 텍스트 크기 축소
    color: '#333',
    textAlign: 'center',
    marginTop: 5, // 그래프와 텍스트 간격
    lineHeight: 16, // 텍스트 줄 간격 조정
    maxWidth: 100, // 텍스트 최대 너비 설정
    overflow: 'hidden', // 넘치는 텍스트 숨김
  },
  pieChartTextHighlight: {
    color: '#1abc9c', // 강조 색상
    fontWeight: 'bold',
  },
});
