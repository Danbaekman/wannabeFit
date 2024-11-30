import * as React from 'react';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LaunchScreen from './android/app/src/screens/LaunchScreen';
import LoginScreen from './android/app/src/screens/LoginScreen';
import MainScreen from './android/app/src/screens/MainScreen';
import InbodyInputScreen from './android/app/src/screens/inbodyinputscreen/InbodyInputScreen';
import FitnessGoalScreen from './android/app/src/screens/fitnessgoalscreen/FitnessGoalScreen';
import MealSettingScreen from './android/app/src/screens/mealsettingscreen/MealSettingScreen';
import WorkoutSetupScreen from './android/app/src/screens/workoutsetupscreen/WorkoutSetupScreen';
import RoutineSetupScreen from './android/app/src/screens/routinesetupscreen/RoutineSetupScreen';
import RoutineDetailScreen from './android/app/src/screens/routinedetailscreen/RoutineDetailScreen';
import WorkoutEntryScreen from './android/app/src/screens/workoutentryscreen/WorkoutEntryScreen';
import WorkoutSummaryScreen from './android/app/src/screens/workoutsummaryscreen/WorkoutSummaryScreen';
import StaticsMainScreen from './android/app/src/screens/chart/staticsmainscreen/StaticsMainScreen';
import VolumeScreen from './android/app/src/screens/chart/volumescreen/VolumeScreen';



const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        {/* <Stack.Navigator initialRouteName="Launch">*/}
        <Stack.Navigator initialRouteName="Main"> 
          <Stack.Screen name="Launch" component={LaunchScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="InbodyInput" component={InbodyInputScreen} />
          <Stack.Screen name="FitnessGoal" component={FitnessGoalScreen} />
          <Stack.Screen name="Main" component={MainScreen} />
          <Stack.Screen name="MealSetting" component={MealSettingScreen} />
          <Stack.Screen name="WorkoutSetup" component={WorkoutSetupScreen} />
          <Stack.Screen name="RoutineSetup" component={RoutineSetupScreen} />
          <Stack.Screen name="RoutineDetail" component={RoutineDetailScreen} />
          <Stack.Screen name="WorkoutEntry" component={WorkoutEntryScreen} />
          <Stack.Screen name="WorkoutSummary" component={WorkoutSummaryScreen} />
          <Stack.Screen name="StaticsMain" component={StaticsMainScreen} />
          <Stack.Screen name="Volume" component={VolumeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default App;
