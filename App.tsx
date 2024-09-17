import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LaunchScreen from './android/app/src/screens/LaunchScreen';
import LoginScreen from './android/app/src/screens/LoginScreen'
import MainScreen from './android/app/src/screens/MainScreen';
import InbodyInputScreen from './android/app/src/screens/inbodyinputscreen/InbodyInputScreen';
import { enableScreens } from 'react-native-screens';

enableScreens();

const Stack = createNativeStackNavigator();
// Stack object를 반환함. { Screen, Navigator }로 구성됨.

function App() {
  return (
		// NavigationContainer로 감싸야 함.
		<NavigationContainer>
      <Stack.Navigator initialRouteName="Launch">
        <Stack.Screen name="Launch" component={LaunchScreen} />
        <Stack.Screen name='Login' component={LoginScreen} />
        <Stack.Screen name="InbodyInput" component={InbodyInputScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
