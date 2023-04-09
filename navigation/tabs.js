import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
} from "react-native";

import MapOff from "../assets/icons/map_off.svg";
import MapOn from "../assets/icons/map_on.svg";
import MypageOff from "../assets/icons/mypage_off.svg";
import MypageOn from "../assets/icons/mypage_on.svg";
import NoticeOff from "../assets/icons/notice_off.svg";
import NoticeOn from "../assets/icons/notice_on.svg";
import StorageOff from "../assets/icons/storage_off.svg";
import StorageOn from "../assets/icons/storage_on.svg";
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
