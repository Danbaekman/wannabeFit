import { StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#008080', // 상단 배경 색상
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: '#F5F5F5', // 메인 배경색
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingTop: 20,
    paddingHorizontal: 20,
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
  headerContainer: {
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#008080',
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
