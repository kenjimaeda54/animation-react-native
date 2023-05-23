import React from 'react';
import 'react-native-gesture-handler';
import { SafeAreaProvider } from "react-native-safe-area-context"
import ButtonSheetWithPagination from './src/screens/BootomSheetWithPagination';

export default function App() {


  return (
    <SafeAreaProvider>
      <ButtonSheetWithPagination />
    </SafeAreaProvider>
  )
}
