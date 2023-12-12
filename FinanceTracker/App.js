import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {AsyncStorageDataProvider} from './src/providers/AsyncStorageDataProvider';
import AppNavigator from './src/navigations/AppNavigator';

export default function App() {
  return (
    <AsyncStorageDataProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AsyncStorageDataProvider>
  );
}
