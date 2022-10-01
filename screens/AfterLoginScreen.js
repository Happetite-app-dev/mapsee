import { Text, View } from 'react-native';
import { useContext, useEffect } from 'react';
import AppContext from '../components/AppContext';

const AfterLoginScreen=({navigation, route})=>{
    const myContext = useContext(AppContext);
    const param=route.params;
    useEffect(()=>{
        myContext.initMyID(param)
    }, [])
    
    const startTutorial = false  
    return(
        startTutorial ? 
        <View style={{alignItems:'center', justifyContent:'center',flex:1}}>
            <View style={{alignItems:'center', justifyContent:'center',flex:1}}>
                <Text>로그인 후 화면</Text>
            </View>
            <View style={{alignItems:'center', justifyContent:'center',flex:1}}>
                <Text>{param}</Text>
                <Text>{myContext.myID}</Text>
            </View>
        </View>
        :
        <View>
            <Text>튜토리얼 끝남</Text>
        </View>
        
    )
    
}

export default AfterLoginScreen