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
  
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  goalSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 5,
  },
  goalStatus: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#008080',
  },

  // 새 스타일 추가
  pieChartContainer: {
    flexDirection: 'row', // 가로 방향으로 정렬
    justifyContent: 'space-between', // 아이템 간격 균등 배치
    alignItems: 'center', // 세로 방향 가운데 정렬
    flexWrap: 'wrap', // 줄 바꿈 허용
    paddingVertical: 10, // 상하 여백
  },
  pieChartWrapper: {
    width: '30%', // 한 줄에 3개씩 배치
    alignItems: 'center', // 가운데 정렬
    marginBottom: 20, // 하단 여백
  },
  pieChartText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginTop: 5, // 원형 그래프와 텍스트 간격
  },
  pieChartTextHighlight: {
    color: '#1abc9c', // 강조 색상
    fontWeight: 'bold',
  },
});
