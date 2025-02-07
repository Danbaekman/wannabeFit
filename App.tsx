import * as React from 'react';
import { Provider } from 'react-redux';
import 'react-native-reanimated';
import store from './android/app/src/store';
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
import StaticsMainScreen from './android/app/src/screens/chart/staticsmainscreen/StaticsMainScreen';
import VolumeScreen from './android/app/src/screens/chart/volumescreen/VolumeScreen';
import TotalSetsScreen from './android/app/src/screens/chart/totalsetsscreen/TotalSetsScreen';
import TotalRepsScreen from './android/app/src/screens/chart/toprepsscreen/TopRepsScreen';
import MealStatsScreen from './android/app/src/screens/chart/mealstatsscreen/MealStatsScreen';
import ProfileScreen from './android/app/src/screens/profilescreen/ProfileScreen';
import WeightStatsScreen from './android/app/src/screens/chart/weightstatsscreen/WeightStatsScreen';
import './reanimatedConfig';
import MealDirectInputScreen from './android/app/src/screens/mealdirectinputscreen/MealDirectInputScreen';
import WelcomeScreen from './android/app/src/screens/welcomescreen/WelcomeScreen';


const Stack = createNativeStackNavigator();

const App = () => {
  
  return (
    <Provider store={store}>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Launch">
        {/* <Stack.Navigator initialRouteName="Launch" screenOptions={{ headerShown: false }} >  */}
          <Stack.Screen name="Launch" component={LaunchScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="InbodyInput" component={InbodyInputScreen} />
          <Stack.Screen name="FitnessGoal" component={FitnessGoalScreen} />
          <Stack.Screen name="Welcome" component = {WelcomeScreen} />
          <Stack.Screen name="Main" component={MainScreen} />
          <Stack.Screen name="MealSetting" component={MealSettingScreen} />
          <Stack.Screen name="WorkoutSetup" component={WorkoutSetupScreen} />
          <Stack.Screen name="RoutineSetup" component={RoutineSetupScreen} />
          <Stack.Screen name="RoutineDetail" component={RoutineDetailScreen} />
          <Stack.Screen name="WorkoutEntry" component={WorkoutEntryScreen} />
          <Stack.Screen name="StaticsMain" component={StaticsMainScreen} />
          <Stack.Screen name="Volume" component={VolumeScreen} />
          <Stack.Screen name="TotalSets" component={TotalSetsScreen} />
          <Stack.Screen name="TopReps" component={TotalRepsScreen} />
          <Stack.Screen name="MealStats" component={MealStatsScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="WeightStats" component={WeightStatsScreen} />
          <Stack.Screen name="MealDirectInput" component={MealDirectInputScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
    </Provider>
  );
}

export default App;
