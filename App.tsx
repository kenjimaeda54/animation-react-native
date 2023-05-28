import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import 'react-native-gesture-handler';
import { SafeAreaProvider } from "react-native-safe-area-context"
import RoutesTropical from './src/screens/shared-element/tropical-list/routes/RoutesTropical';

export default function App() {


  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RoutesTropical />
      </NavigationContainer>
    </SafeAreaProvider>
  )
}
