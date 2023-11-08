import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import LandingScreen from './src/screens/LandingScreen';
import {AuthProvider} from './src/providers/AuthProvider';
import SpeechToTextScreen from './src/screens/SpeechToTextScreen';
import FeedbackScreen from './src/screens/FeedbackScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{headerShown: false}}
          initialRouteName="Login">
          <Stack.Screen name="Sign Up" component={SignUpScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Landing" component={LandingScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="SpeechToText" component={SpeechToTextScreen} />
          <Stack.Screen name="Feedback" component={FeedbackScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
