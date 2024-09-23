import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LaunchScreen from './android/app/src/screens/LaunchScreen';
import LoginScreen from './android/app/src/screens/LoginScreen';
import MainScreen from './android/app/src/screens/MainScreen';
import InbodyInputScreen from './android/app/src/screens/inbodyinputscreen/InbodyInputScreen';
import FitnessGoalScreen from './android/app/src/screens/fitnessgoalscreen/FitnessGoalScreen';
import MealSettingScreen from './android/app/src/screens/mealsettingscreen/MealSettingScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      {/* <Stack.Navigator initialRouteName="Launch">*/}
      <Stack.Navigator initialRouteName="Main"> 
        <Stack.Screen name="Launch" component={LaunchScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="InbodyInput" component={InbodyInputScreen} />
        <Stack.Screen name="FitnessGoal" component={FitnessGoalScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="MealSetting" component={MealSettingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
