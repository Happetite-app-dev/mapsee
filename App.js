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
import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';
import AfterLoginScreen from './screens/AfterLoginScreen';

const Stack= createNativeStackNavigator();

const App = () => {
  return(
    <NavigationContainer>
      <Stack.Navigator initialRouteName='BeforeLoginScreen'>
        <Stack.Screen options={{headerShown:false}} name="BeforeLoginScreen" component={BeforeLoginScreen} />
        <Stack.Screen options={{headerShown:false}} name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen options={{headerShown:false}} name="LoginScreen" component={LoginScreen} />
        <Stack.Screen options={{headerShown:false}} name="AfterLoginScreen" component={AfterLoginScreen} />
        <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false}}/>
        <Stack.Screen name="SingleFolderScreen" component={SingleFolderScreen} options={{headerShown: false, gestureEnabled:false}}/>
        <Stack.Screen name="MakeFolderBottomSheetScreen" component={MakeFolderBottomSheetScreen} options={{headerShown: false, presentation: 'containedTransparentModal',contentStyle:{backgroundColor:'transparent'}}}/>
        <Stack.Screen name="PlaceInfoBottomSheetScreen" component={PlaceInfoBottomSheetScreen} options={{headerShown: false, presentation: 'containedTransparentModal',contentStyle:{backgroundColor:'transparent'}}} />
        <Stack.Screen name="EditScreen" component={EditScreen} options={{headerShown: false, presentation: 'containedModal'}}/>
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{headerShown: false, gestureEnabled:false}}/>
        <Stack.Screen name="FriendListScreen" component={FriendListScreen} options={{headerShown: false, gestureEnabled: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App;