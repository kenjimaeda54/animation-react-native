import React from 'react';
import 'react-native-gesture-handler';
import { SafeAreaProvider } from "react-native-safe-area-context"
import TimerAnimation from './src/screens/TimerAnimation';

export default function App() {


  return (
    <SafeAreaProvider>
      <TimerAnimation />
    </SafeAreaProvider>
  )
}
