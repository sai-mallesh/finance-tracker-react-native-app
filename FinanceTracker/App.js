import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {AuthProvider} from './src/providers/AuthProvider';
import {AsyncStorageDataProvider} from './src/providers/AsyncStorageDataProvider';
import AppNavigator from './src/navigations/AuthNavigator';

export default function App() {
  return (
    <AuthProvider>
      <AsyncStorageDataProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AsyncStorageDataProvider>
    </AuthProvider>
  );
}
