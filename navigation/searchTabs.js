import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet } from "react-native";

import MapSearchScreen1 from "../screens/MapSearchScreen1";
import MapSearchScreen2 from "../screens/MapSearchScreen2";
import MapSearchScreen3 from "../screens/MapSearchScreen3";

const SearchTab = createBottomTabNavigator();

const SearchTabs = ({ navigation }) => {
  return (
    <SearchTab.Navigator
      initialRouteName="MapSearchScreen1"
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
          backgroundColor: "#red",
          borderRadius: 15,
          height: 90,
          opacity: 100,
          zIndex: 1,
        },
      }}
    >
      <SearchTab.Screen
        name="MapSearchScreen1"
        component={MapSearchScreen1}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <SearchTab.Screen
        name="MapSearchScreen2"
        component={MapSearchScreen2}
        options={{
          headerShown: false,
          gestureEnabled: true,
        }}
      />
      <SearchTab.Screen
        name="MapSearchScreen3"
        component={MapSearchScreen3}
        options={{ headerShown: false, gestureEnabled: false }}
      />
    </SearchTab.Navigator>
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
export default SearchTabs;
