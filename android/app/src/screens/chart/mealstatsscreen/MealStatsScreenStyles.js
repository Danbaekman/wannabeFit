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
        position: 'relative',
        flexDirection: 'column', // 상하 배치
      },
      
    sectionTitle: {
      fontSize: 18,
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
        marginBottom: 10
    },
    filterButton: {
        backgroundColor: '#1abc9c',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 4,
        elevation: 2,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-end', // 오른쪽 정렬
      },
    filterButtonText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: 'bold',
    },
    filterDropdown: {
      position: 'absolute',
      top: 40,
      right: 0, // 버튼과 정렬
      backgroundColor: '#fff',
      borderRadius: 4,
      padding: 10,
      elevation: 5,
      zIndex: 1000,
    },
    filterOption: {
      paddingVertical: 8,
      paddingHorizontal: 10,
    },
    filterOptionText: {
      fontSize: 14,
      color: '#333',
    },
  });
  