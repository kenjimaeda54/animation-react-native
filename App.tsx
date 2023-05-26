import React from 'react';
import 'react-native-gesture-handler';
import { SafeAreaProvider } from "react-native-safe-area-context"
import ParalaxCarousel from './src/screens/ParalaxCarousel';

export default function App() {


  return (
    <SafeAreaProvider>
      <ParalaxCarousel />
    </SafeAreaProvider>
  )
}
