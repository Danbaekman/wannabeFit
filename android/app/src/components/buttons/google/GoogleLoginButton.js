import React from 'react';
import { TouchableOpacity, Image, } from 'react-native';
import styles from './GoogleLoginButtonStyles';

const GoogleLoginButton = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Image
        source={require('../../../../assets/images/google.png')} // 구글 로고 이미지 경로
        style={styles.icon}
      />
    </TouchableOpacity>
  );
};

export default GoogleLoginButton;
