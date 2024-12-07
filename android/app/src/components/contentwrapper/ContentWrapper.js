import React from 'react';
import { View } from 'react-native';
import styles from './ContentWrapperStyles';

const ContentWrapper = ({ children }) => {
  return <View style={styles.contentWrapper}>{children}</View>;
};

export default ContentWrapper;