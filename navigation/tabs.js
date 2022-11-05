import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import StorageScreen from "../screens/StorageScreen";
import MypageScreen from '../screens/MypageScreen';
import MapScreen from '../screens/MapScreen';
import AlarmScreen from "../screens/AlarmScreen";
import { StyleSheet, Text, View, Image, TouchableHighlight } from "react-native";
import { useState } from "react";
import { useContext } from 'react';
import AppContext from '../components/AppContext';
const Tab = createBottomTabNavigator();

const Tabs = ({navigation}) => {
    const myContext = useContext(AppContext);
    const tabBarVisible = myContext.tabBarVisible
    const tabBarHandler = myContext.tabBarHandler
    return(
        <Tab.Navigator
            initialRouteName="Map"
            screenOptions={{
                tabBarShowLabel: false,
                headerShown: false,
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    elevation: 0,
                    backgroundColor: '#ffffff',
                    borderRadius: 15,
                    height: 90,
                    opacity: 100,
                    zIndex:1,
                }  
            }}
        >   
            <Tab.Screen name="Storage" component={StorageScreen} options={{
                tabBarIcon: ({focused}) => (
                    <View style={{alignItems: 'center', justifyContent: 'center', top: 10}}>
                        <Image                    
                            source={focused? require('../assets/icons/storage_on.png') : require('../assets/icons/storage_off.png')}
                            resizeMode='contain'
                            style={{
                                width: 24,
                                height: 24,
                                zIndex:1,
                            }}
                        />

                    </View>
                )
            }}/>
            <Tab.Screen name="Map" component={MapScreen} 
                options={{
                    tabBarIcon: ({focused}) => (
                        <View style={{alignItems: 'center', justifyContent: 'center', top: 10}}>
                            <Image
                                source={focused? require('../assets/icons/map_on.png') : require('../assets/icons/map_off.png')}
                                resizeMode='contain'
                                style={{
                                    width: 24,
                                    height: 24,
                                    zIndex:1,
                                }}
                            />
                        </View>
                    ),
                }}
            />
            <Tab.Screen name="Alarm" component={AlarmScreen} options={{
                tabBarIcon: ({focused}) => (
                    <View style={{alignItems: 'center', justifyContent: 'center', top: 10}}>
                        <Image                    
                            source={focused ? require('../assets/icons/alarm_on.png') : require('../assets/icons/alarm_off.png')}
                            resizeMode='contain'
                            style={{
                                width: 24,
                                height: 24,
                                zIndex:1,
                            }}
                        />

                    </View>
                )
            }}/>
            <Tab.Screen name="Mypage" component={MypageScreen} options={{
                tabBarIcon: ({focused}) => (
                    <View style={{alignItems: 'center', justifyContent: 'center', top: 10}}>
                        <Image
                            source={focused ? require('../assets/icons/mypage_on.png') : require('../assets/icons/mypage_off.png')}
                            resizeMode='contain'
                            style={{
                                width:24,
                                height: 24,
                                zIndex:1,
                            }}
                        />
                    </View>
                ),
                // tabBarStyle: {display: tabBarVisible? "flex" : "none"}
            }}/>
        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({
    shadow: {
        shadowColor: "7F5DF",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5 ,
        elevation: 5,           //only for ios
    },
})
export default Tabs;