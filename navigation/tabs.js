import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
} from "react-native";

import MapOn from "../assets/icons/Location/Location.svg";
import MypageOn from "../assets/icons/My page/My page.svg";
import NoticeOn from "../assets/icons/Notice/Notice.svg";
import StorageOn from "../assets/icons/Folder/Folder.svg";

import MapOff from "../assets/icons/Location/Off.svg";
import MypageOff from "../assets/icons/My page/Off.svg";
import NoticeOff from "../assets/icons/Notice/Off.svg";
import StorageOff from "../assets/icons/Folder/Off.svg";
import MapScreen from "../screens/MapScreen";
import MypageScreen from "../screens/MypageScreen";
import NoticeScreen from "../screens/NoticeScreen";
import StorageScreen from "../screens/StorageScreen";

const Tab = createBottomTabNavigator();
const Tabs = ({ navigation }) => {
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
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          height: 88,
          opacity: 100,
          zIndex: 1,
          borderWidth: 1,
          borderColor: "#DDDFE9",
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
                top: 0,
              }}
            >
              {focused ? (
                <View style={{ alignItems: "center" }}>
                  <View
                    style={{
                      backgroundColor: "#5ED3CC",
                      height: 2,
                      width: 32,
                      top: -16,
                    }}
                  />
                  <MapOn width={24} height={24} style={{ top: -1 }} />
                </View>
              ) : (
                <MapOff width={24} height={24} />
              )}
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
                top: 0,
              }}
            >
              {focused ? (
                <View style={{ alignItems: "center" }}>
                  <View
                    style={{
                      backgroundColor: "#5ED3CC",
                      height: 2,
                      width: 32,
                      top: -16,
                    }}
                  />
                  <StorageOn width={24} height={24} style={{ top: -1 }} />
                </View>
              ) : (
                <StorageOff width={24} height={24} />
              )}
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
                top: 0,
              }}
            >
              {focused ? (
                <View style={{ alignItems: "center" }}>
                  <View
                    style={{
                      backgroundColor: "#5ED3CC",
                      height: 2,
                      width: 32,
                      top: -16,
                    }}
                  />
                  <NoticeOn width={24} height={24} style={{ top: -1 }} />
                </View>
              ) : (
                <NoticeOff width={24} height={24} />
              )}
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
                top: 0,
              }}
            >
              {focused ? (
                <View style={{ alignItems: "center" }}>
                  <View
                    style={{
                      backgroundColor: "#5ED3CC",
                      height: 2,
                      width: 32,
                      top: -16,
                    }}
                  />
                  <MypageOn width={24} height={24} style={{ top: -1 }} />
                </View>
              ) : (
                <MypageOff width={24} height={24} />
              )}
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Tabs;
