import { StatusBar } from 'expo-status-bar';
import { ImageComponent, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const AfterLoginScreen=({navigation, route})=>{
    const param=route.params;
    console.log(param)
    return(
        <View style={{alignItems:'center', justifyContent:'center',flex:1}}>
            <View style={{alignItems:'center', justifyContent:'center',flex:1}}>
                <Text>로그인 후 화면</Text>
            </View>
            <View style={{alignItems:'center', justifyContent:'center',flex:1}}>
                <Text>{param}</Text>
            </View>
        </View>
        
    );
}

export default AfterLoginScreen