import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

import AppContext from "./components/AppContext";
import Tabs from "./navigation/tabs";
import AfterLoginScreen from "./screens/AfterLoginScreen";
import BeforeLoginScreen from "./screens/BeforeLoginScreen";
import EditScreen from "./screens/EditScreen";
import FriendListScreen from "./screens/FriendListScreen";
import InviteFriendScreen from "./screens/InviteFriendScreen";
import LoginScreen from "./screens/LoginScreen";
import MakeFolderBottomSheetScreen from "./screens/MakeFolderBottomSheetScreen";
import MapSearchScreen1 from "./screens/MapSearchScreen1";
import MapSearchScreen2 from "./screens/MapSearchScreen2";
import MapSearchScreen3 from "./screens/MapSearchScreen3";
import MapSearchScreen4 from "./screens/MapSearchScreen4";
import PlaceInfoBottomSheetScreen from "./screens/PlaceInfoBottomSheetScreen";
import ProfileScreen from "./screens/ProfileScreen";
import RegisterScreen1 from "./screens/RegisterScreen1";
import RegisterScreen2 from "./screens/RegisterScreen2";
import RegisterScreen3 from "./screens/RegisterScreen3";
import SingleFolderScreen from "./screens/SingleFolderScreen";
import SubSearchScreen1 from "./screens/SubSearchScreen1";
import SubSearchScreen2 from "./screens/SubSearchScreen2";
import SuggestScreen from "./screens/SuggestScreen";
import TutorialScreen from "./screens/TutorialScreen";
import ImageView from "./screens/ImageView";
const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();
const App = () => {
  const [myUID, setMyUID] = useState(null);
  const [myID, setMyID] = useState(null);
  const [myFirstName, setMyFirstName] = useState(null);
  const [myLastName, setMyLastName] = useState(null);
  const [myEmail, setMyEmail] = useState(null);

  const initMyUID = (myUID_) => {
    setMyUID(myUID_);
  };
  const initMyID = (myID_) => {
    setMyID(myID_);
  };
  const initMyFirstName = (myFirstName_) => {
    setMyFirstName(myFirstName_);
  };
  const initMyLastName = (myLastName_) => {
    setMyLastName(myLastName_);
  };
  const initMyEmail = (myEmail_) => {
    setMyEmail(myEmail_);
  };

  const userSettings = {
    myUID,
    myID,
    myFirstName,
    myLastName,
    myEmail,
    initMyUID,
    initMyID,
    initMyFirstName,
    initMyLastName,
    initMyEmail,
  };
  return (
    <AppContext.Provider value={userSettings}>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="BeforeLoginScreen">
            <Stack.Screen
              options={{ headerShown: false }}
              name="BeforeLoginScreen"
              component={BeforeLoginScreen}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              name="RegisterScreen1"
              component={RegisterScreen1}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              name="RegisterScreen2"
              component={RegisterScreen2}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              name="RegisterScreen3"
              component={RegisterScreen3}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              name="LoginScreen"
              component={LoginScreen}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              name="AfterLoginScreen"
              component={AfterLoginScreen}
            />
            <Stack.Screen
              options={{ headerShown: false, presentation: "transparentModal" }}
              name="TutorialScreen"
              component={TutorialScreen}
            />
            <Stack.Screen
              name="Tabs"
              component={Tabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="MapSearchScreen1"
              component={MapSearchScreen1}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="MapSearchScreen2"
              component={MapSearchScreen2}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="MapSearchScreen3"
              component={MapSearchScreen3}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="MapSearchScreen4"
              component={MapSearchScreen4}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SingleFolderScreen"
              component={SingleFolderScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="MakeFolderBottomSheetScreen"
              component={MakeFolderBottomSheetScreen}
              options={{
                headerShown: false,
                presentation: "transparentModal",
                gestureDirection: "vertical",
                contentStyle: { backgroundColor: "transparent" },
              }}
            />
            <Stack.Screen
              name="PlaceInfoBottomSheetScreen"
              component={PlaceInfoBottomSheetScreen}
              options={{
                headerShown: false,
                presentation: "transparentModal",
                gestureDirection: "vertical",
                contentStyle: { backgroundColor: "transparent" },
              }}
            />

            <Stack.Screen
              name="SubSearchScreen1"
              component={SubSearchScreen1}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SubSearchScreen2"
              component={SubSearchScreen2}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="EditScreen"
              component={EditScreen}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="ImageView"
              component={ImageView}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ProfileScreen"
              component={ProfileScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="FriendListScreen"
              component={FriendListScreen}
              options={{
                headerShown: false,
                presentation: "containedModal",
              }}
            />
            <Stack.Screen
              name="InviteFriendScreen"
              component={InviteFriendScreen}
              options={{
                headerShown: false,
                presentation: "fullScreenModal",
              }}
            />
            <Stack.Screen
              name="SuggestScreen"
              component={SuggestScreen}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </QueryClientProvider>
    </AppContext.Provider>
  );
};

export default App;
