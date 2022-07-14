import { NavigationContainer } from '@react-navigation/native';
import PlaceInfoBottomSheet from './components/PlaceInfoBottomSheet';
import Tabs from './navigation/tabs';
import { View } from 'react-native';
import { useState } from 'react';
const App = () => {
  return(
    <NavigationContainer>
      <Tabs />
    </NavigationContainer>
  )
}

export default App;