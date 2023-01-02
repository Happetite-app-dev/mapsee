import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { initializeApp } from "firebase/app";
import { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
} from "react-native";

import AppContext from "../components/AppContext";
import MapScreen from "../screens/MapScreen";
import MypageScreen from "../screens/MypageScreen";
import NoticeScreen from "../screens/NoticeScreen";
import StorageScreen from "../screens/StorageScreen";

const Tab = createBottomTabNavigator();
const firebaseConfig = {
  apiKey: "AIzaSyDBq4tZ1QLm1R7iPH8O4dTvebVGWgkRPks",
  authDomain: "mapseedemo1.firebaseapp.com",
  projectId: "mapseedemo1",
  storageBucket: "mapseedemo1.appspot.com",
  messagingSenderId: "839335870793",
  appId: "1:839335870793:web:75004c5d43270610411a98",
  measurementId: "G-8L1MD1CGN2",
};
const app = initializeApp(firebaseConfig);
const Tabs = ({ navigation }) => {
  const myContext = useContext(AppContext);
  const tabBarVisible = myContext.tabBarVisible;
  const tabBarHandler = myContext.tabBarHandler;
  return (
    <Tab.Navigator
      initialRouteName="Map"
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
          backgroundColor: "#ffffff",
          borderRadius: 15,
          height: 90,
          opacity: 100,
          zIndex: 1,
        },
      }}
    >
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                top: 10,
              }}
            >
              <Image
                source={
                  focused
                    ? require("../assets/icons/map_on.png")
                    : require("../assets/icons/map_off.png")
                }
                resizeMode="contain"
                style={{
                  width: 24,
                  height: 24,
                  zIndex: 1,
                }}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Storage"
        component={StorageScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                top: 10,
              }}
            >
              <Image
                source={
                  focused
                    ? require("../assets/icons/storage_on.png")
                    : require("../assets/icons/storage_off.png")
                }
                resizeMode="contain"
                style={{
                  width: 24,
                  height: 24,
                  zIndex: 1,
                }}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Notice"
        component={NoticeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                top: 10,
              }}
            >
              <Image
                source={
                  focused
                    ? require("../assets/icons/notice_on.png")
                    : require("../assets/icons/notice_off.png")
                }
                resizeMode="contain"
                style={{
                  width: 24,
                  height: 24,
                  zIndex: 1,
                }}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Mypage"
        component={MypageScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                top: 10,
              }}
            >
              <Image
                source={
                  focused
                    ? require("../assets/icons/mypage_on.png")
                    : require("../assets/icons/mypage_off.png")
                }
                resizeMode="contain"
                style={{
                  width: 24,
                  height: 24,
                  zIndex: 1,
                }}
              />
            </View>
          ),
          // tabBarStyle: {display: tabBarVisible? "flex" : "none"}
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "7F5DF",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5, //only for ios
  },
});
export default Tabs;
