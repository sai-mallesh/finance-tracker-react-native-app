import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';

import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import SetupProfile from '../screens/SetupProfile';
import LaunchScreen from '../screens/LaunchScreen';
const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="Launch">
      <Stack.Screen name="Launch" component={LaunchScreen} />
      <Stack.Screen name="Sign Up" component={SignUpScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Setup Profile" component={SetupProfile} />
      <Stack.Screen name="PostAuthScreens" component={BottomTabNavigator} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
