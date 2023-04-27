import React, { useState } from 'react';
import 'react-native-gesture-handler';
import { SafeAreaProvider } from "react-native-safe-area-context"
import SwitchAnimation from './src/screens/Switch.animation';


export default function App() {
  const [isActive, setIsActive] = useState(false)

  const handlePressSwitch = () => setIsActive(prev => !prev)


  return (
    <SafeAreaProvider>
      <SwitchAnimation size={50} isActive={isActive} onPress={handlePressSwitch} />
    </SafeAreaProvider>
  )
}
