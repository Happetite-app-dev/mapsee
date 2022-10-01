import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Tabs from './navigation/tabs';
import EditScreen from './screens/EditScreen';
import PlaceInfoBottomSheetScreen from './screens/PlaceInfoBottomSheetScreen';
import MakeFolderBottomSheetScreen from './screens/MakeFolderBottomSheetScreen';
import SingleFolderScreen from './screens/SingleFolderScreen';
import ProfileScreen from './screens/ProfileScreen';
import FriendListScreen from './screens/FriendListScreen';

import BeforeLoginScreen from './screens/BeforeLoginScreen';
import RegisterScreen1 from './screens/RegisterScreen1';
import RegisterScreen2 from './screens/RegisterScreen2';
import RegisterScreen3 from './screens/RegisterScreen3';
import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';
import AfterLoginScreen from './screens/AfterLoginScreen';

import React, { useState } from 'react';
import AppContext from './components/AppContext';

const Stack= createNativeStackNavigator();

const App = () => {
  const [myUID, setMyUID] = useState(null);
  const [myID, setMyID] = useState(null);
  const [myFirstName, setMyFirstName] = useState(null);
  const [myLastName, setMyLastName] = useState(null)
  const [myEmail, setMyEmail] = useState(null);
  const [tabBarVisible, setTabBarVisible] = useState(true);

  const initMyUID = (myUID_) => {
    setMyUID(myUID_)
  };
  const initMyID = (myID_) => {
    setMyID(myID_)
  };
  const initMyFirstName = (myFirstName_) => {
    setMyFirstName(myFirstName_)
  };
  const initMyLastName = (myLastName_) => {
    setMyLastName(myLastName_)
  };
  const initMyEmail = (myEmail_) => {
    setMyEmail(myEmail_)
  }
  const tabBarHandler = (b) => {
    setTabBarVisible(b)
  } 

  const userSettings = {
    myUID: myUID,
    myID: myID,
    myFirstName: myFirstName,
    myLastName: myLastName,
    myEmail: myEmail,
    tabBarVisible: tabBarVisible,
    initMyUID,
    initMyID,
    initMyFirstName,
    initMyLastName,
    initMyEmail,
    tabBarHandler
  };
  return(
    <AppContext.Provider value={userSettings}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='BeforeLoginScreen'>
          <Stack.Screen options={{headerShown:false}} name="BeforeLoginScreen" component={BeforeLoginScreen} />
          <Stack.Screen options={{headerShown:false}} name="RegisterScreen1" component={RegisterScreen1} />
          <Stack.Screen options={{headerShown:false}} name="RegisterScreen2" component={RegisterScreen2} />
          <Stack.Screen options={{headerShown:false}} name="RegisterScreen3" component={RegisterScreen3} />
          <Stack.Screen options={{headerShown:false}} name="LoginScreen" component={LoginScreen} />
          <Stack.Screen options={{headerShown:false}} name="AfterLoginScreen" component={AfterLoginScreen} />
          <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false, gestureEnabled: false}}/>
          <Stack.Screen name="SingleFolderScreen" component={SingleFolderScreen} options={{headerShown: false, gestureEnabled:false}}/>
          <Stack.Screen name="MakeFolderBottomSheetScreen" component={MakeFolderBottomSheetScreen} options={{headerShown: false, presentation: 'containedTransparentModal',contentStyle:{backgroundColor:'transparent'}}}/>
          <Stack.Screen name="PlaceInfoBottomSheetScreen" component={PlaceInfoBottomSheetScreen} options={{headerShown: false, presentation: 'containedTransparentModal',contentStyle:{backgroundColor:'transparent'}}} />
          <Stack.Screen name="EditScreen" component={EditScreen} options={{headerShown: false, presentation: 'containedModal'}}/>
          <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{headerShown: false, gestureEnabled:false}}/>
          <Stack.Screen name="FriendListScreen" component={FriendListScreen} options={{headerShown: false, gestureEnabled: false}}/>
        </Stack.Navigator>
      </NavigationContainer>
    </AppContext.Provider>
  )
}

export default App;