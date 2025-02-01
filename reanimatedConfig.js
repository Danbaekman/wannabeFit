import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn, // 로그 수준을 경고(warn)로 설정
  strict: false, // strict 모드 비활성화
});
