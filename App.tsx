import { NavigationContainer } from '@react-navigation/native';
import React, { useState } from 'react';
import 'react-native-gesture-handler';
import { SafeAreaProvider } from "react-native-safe-area-context"
import FlatlistHorizontalAnimation from "./src/screens/shared-element/travel-list-animatable/routes/RoutesTravelAnimatable"

export default function App() {



  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <FlatlistHorizontalAnimation />
      </NavigationContainer>
    </SafeAreaProvider>
  )
}
