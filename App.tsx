import React from 'react';
import 'react-native-gesture-handler';
import { SafeAreaProvider } from "react-native-safe-area-context"
import FlatlistHorizontal from './src/screens/FlatlistHorizontal.animation';


export default function App() {


  return (
    <SafeAreaProvider>
      {/* <SwitchAnimation size={50} isActive={isActive} onPress={handlePressSwitch} />*/}
      <FlatlistHorizontal />
    </SafeAreaProvider>
  )
}
