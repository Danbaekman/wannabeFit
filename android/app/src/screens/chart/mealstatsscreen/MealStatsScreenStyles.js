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
        padding: 20,
        position: 'relative',
        flexDirection: 'column', // 상하 배치
        overflow: 'visible',
      },
      
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#333',
    },
    pieChartContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      flexWrap: 'nowrap',
      paddingVertical: 10,
    },
    pieChartWrapper: {
      flex: 1,
      maxWidth: 120,
      alignItems: 'center',
    },
    pieChartText: {
      fontSize: 12,
      color: '#333',
      textAlign: 'center',
      marginTop: 5,
      lineHeight: 16,
      maxWidth: 100,
      overflow: 'hidden',
    },
    pieChartTextHighlight: {
      color: '#1abc9c',
      fontWeight: 'bold',
    },
    filterContainer: {
        marginBottom: 10,
        zIndex: 2000, // 다른 요소보다 위로 표시
        elevation: 10, // Android에서 우선 적용
      },
      filterButton: {
        borderBottomWidth: 1, // 밑줄 추가
        borderBottomColor: '#008080', // 밑줄 색
        alignSelf: 'flex-end', // 오른쪽 정렬
      },
      filterButtonText: {
        color: '#008080', // 텍스트 색상 (검정)
        fontSize: 14,
        fontWeight: 'bold',
        textDecorationLine: 'none', // 텍스트 밑줄 제거
      },
    filterDropdown: {
        position: 'absolute',
        top: 30,
        right: 0,
        backgroundColor: '#fff',
        borderRadius: 4,
        
        elevation: 10,
        zIndex: 2000, // 항상 가장 앞쪽에 표시
      },
    filterOption: {
      paddingVertical: 8,
      paddingHorizontal: 10,
    },
    filterOptionText: {
      fontSize: 14,
      color: '#333',
    },
    dateRangeContainer: {
        flexDirection: 'row', // 이전/다음 버튼과 날짜 가로 배치
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10, // 제목과 간격 추가
      },
      arrowButton: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        marginHorizontal: 5,
      },
      arrowText: {
        fontSize: 18,
        fontWeight: 'bold',
      },
      dateRangeText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
      },
      comparisonRow: {
        flexDirection: 'row', // 좌우 배치
        justifyContent: 'space-between', // 좌우로 공간 분리
        alignItems: 'center', // 수직 가운데 정렬
        paddingVertical: 10, // 위아래 여백
        borderBottomWidth: 1, // 구분선
        borderBottomColor: '#ddd',
      },
      comparisonLabel: {
        fontSize: 16, // 라벨 글씨 크기
        color: '#333', // 글씨 색상
        fontWeight: 'bold',
      },
      comparisonValueContainer: {
        alignItems: 'flex-end', // 우측 정렬
      },
      comparisonValue: {
        fontSize: 16, // 퍼센트 글씨 크기
      },
      comparisonStatus: {
        fontSize: 14, // 상태 글씨 크기
        fontWeight: '500', // 적당히 굵게
        marginTop: 4, // 퍼센트와 상태 사이 간격
      },
      infoContainer: {
        marginBottom: 20,
      },
      infoText: {
        fontSize: 14,
        color: '#333', // 기본 텍스트 색상
      },
  });
  