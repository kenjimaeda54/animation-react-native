import React from 'react';
import 'react-native-gesture-handler';
import { SafeAreaProvider } from "react-native-safe-area-context"
import FlatlistCarousel3d from './src/screens/FlatlistCarrosel3d.animation';


export default function App() {


  return (
    <SafeAreaProvider>
      <FlatlistCarousel3d />
    </SafeAreaProvider>
  )
}
