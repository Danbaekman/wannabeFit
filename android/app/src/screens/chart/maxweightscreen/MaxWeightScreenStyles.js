import { StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#008080', // 상단 배경 색상
  },
  headerContainer: {
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#008080',
    marginBottom: 10, // 제목과 차트 간격
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    elevation: 2,
    marginBottom: 20,
  },
  chart: {
    marginVertical: 10,
  },
  summaryBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  curvedButtonContainer: {
    width: '100%',
    height: 70,
    backgroundColor: '#008080',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    position: 'absolute',
    bottom: 60, // Footer와 약간의 간격
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  periodButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    borderRadius: 20,
  },
  periodButtonActive: {
    backgroundColor: '#006666',
  },
  periodButtonText: {
    fontSize: 14,
    color: '#555',
  },
  periodButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
