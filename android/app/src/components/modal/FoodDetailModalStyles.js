import { StyleSheet,  Dimensions } from 'react-native';
const screenHeight = Dimensions.get('window').height;
const MODAL_HEIGHT = screenHeight * 0.8;

const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
      backgroundColor: 'white',
      width: '100%',
      height: MODAL_HEIGHT,  // 모달 높이를 전체 화면의 85%로 설정
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingHorizontal: 30,
      paddingVertical: 15,
    },
    inputContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    inputBox: {
      width: '45%',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#00796B',
      backgroundColor: '#00796B',
    },
    boxTitle: {
      textAlign: 'center',
      color: 'white',
      marginBottom: 5,
      marginTop: 2,
      fontWeight: 'bold',
    },
    counter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 10,
      height: 40,
      backgroundColor: 'white',
    },
    counterButton: {
      fontSize: 20,
      color: 'gray',
    },
    counterValue: {
      fontSize: 18,
    },
    input: {
      borderWidth: 1,
      borderRadius: 8,
      padding: 5,
      textAlign: 'center',
      backgroundColor: 'white',
      fontSize: 18,
      height: 40,
    },
    dragHandleContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
    },
    dragHandle: {
      width: 60,
      height: 6,
      borderRadius: 3,
      backgroundColor: '#ccc',
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'black',
      textAlign: 'center',
    },
    titleRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 10,
    },
    inlineIcon: {
      marginLeft: 10, // 아이콘과 글씨를 살짝 붙이는 정도로 조정
      position: 'relative', // 정확한 위치 조정
      top: 5, // 텍스트 라인과 아이콘이 더 매끄럽게 보이도록 수직 조정
    },
    closeButton: {
      position: 'absolute',
      top: 15,
      right: 15,
    },
    closeCircle: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: '#eee',
      justifyContent: 'center',
      alignItems: 'center',
    },
    macroDistribution: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 10,
    },
    macroItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    macroBox: {
      width: 16,
      height: 16,
      marginRight: 6,
    },
    macroLabel: {
      fontSize: 14,
      color: '#333',
    },
    progressBar: {
      flexDirection: 'row',
      height: 10,
      borderRadius: 5,
      overflow: 'hidden',
      backgroundColor: '#ddd',
      width: '100%',
      marginBottom: 20,
    },
    progressSegment: {
      height: '100%',
    },
    foodDetails: {
      marginBottom: 20,
    },
    caloriesText: {
      fontSize: 16,
      marginBottom: 5,
      color: 'black'
    },
    caloriesSubText: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 5,
      color: '#333',
    },
    totalCaloriesValue: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    nutrientContainer: {
      borderWidth: 2,
      borderColor: '#008080',
      padding: 10,
      borderRadius: 10,
    },
    nutrientRowContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    divider: {
      height: 1,
      backgroundColor: '#ccc',
      marginVertical: 10,
    },
    nutrientColumn: {
      alignItems: 'center',
      flex: 1,
    },
    nutrientLabel: {
      fontSize: 16,
      color: '#333',
    },
    nutrientValue: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    addButton: {
      backgroundColor: '#008080',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 25,
      marginTop: 20,
      position: 'absolute',
      bottom: 20,
      alignSelf: 'center',
    },
    addButtonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
    },  
  });
  export default styles;
