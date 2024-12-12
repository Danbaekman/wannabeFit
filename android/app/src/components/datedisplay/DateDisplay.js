import React from 'react';
import { View, Text } from 'react-native';
import styles from './DateDisplayStyles';
import dayjs from 'dayjs';
import 'dayjs/locale/ko'; // 한글 로케일 추가
dayjs.locale('ko'); // 한글 로케일 설정

const DateDisplay = ({ date }) => {
  // 날짜를 월, 일, 요일 형식으로 변환 (한글 요일 포함)
  const formattedDate = dayjs(date).format('M.D (ddd)'); // 예: "12.12 (목)"

  return (
    <View style={styles.dateBar}>
      <Text style={styles.dateBarText}>{formattedDate}</Text>
    </View>
  );
};

export default DateDisplay;
