import React from 'react';
import { View } from 'react-native';
import styles from './ContentWrapperStyles';

//모든 스크린에서 쓰는 회색배경모양(좌우상단 둥근 모서리)
const ContentWrapper = ({ children }) => {
  return <View style={styles.contentWrapper}>{children}</View>;
};

export default ContentWrapper;