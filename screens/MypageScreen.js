import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from 'react-native';
import { useContext } from 'react';
import AppContext from '../components/AppContext';

const friendListImage = require('../assets/image/friendList.png');
const alarmImage = require('../assets/image/alarm.png');
const themeImage = require('../assets/image/theme.png');
const fontImage = require('../assets/image/font.png');

const gotoProfileScreen = ({navigation}) => {
  navigation.navigate("ProfileScreen")
}
const gotoFriendListSreen = ({navigation}) => {
  navigation.navigate("FriendListScreen")
}
const gotoBeforeLoginScreen = ({navigation}) => {
  navigation.navigate("BeforeLoginScreen")
}


const MypageScreen = ({navigation}) => {
  const myContext = useContext(AppContext);
  const myID = myContext.myID
  const myName = myContext.myLastName+myContext.myFirstName
  const tabBarHandler = myContext.tabBarHandler
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={{position: 'absolute', width: '100%', height: 60, top: 45, paddingTop: 20}}>
        <Text style={{left: 20, fontSize:16, fontWeight:'bold'}}>마이페이지</Text> 
      </View>

      <TouchableOpacity onPress={()=>gotoProfileScreen({navigation: navigation})} style={{position: 'absolute', width: '100%', height: 80, top: 105}}>
        <Text style={{top: 20, left: 20, fontSize:16, fontWeight:'bold'}}>{myName}</Text>
        <Text style={{top:30, left: 20, fontSize:14, fontWeight:'bold'}}>{myID}</Text>
      </TouchableOpacity>

      <View style={{position: 'absolute', top: 185, width:'100%', height:250, justifyContent:'space-between', flexDirection:'column', paddingHorizontal : 23, paddingVertical: 13 }}>
        <View style={{alignItems:'center', flexDirection:'row', justifyContent: 'space-between'}}>
          <TouchableOpacity activeOpacity={0.6} onPress={()=>gotoFriendListSreen({navigation: navigation})} style={{height: 104, width: 160,  borderWidth: 1, borderColor: 'gray', borderRadius: 8, flexDirection: 'row', paddingTop: 16, paddingLeft: 18}}>
            <Image source={friendListImage}/>
            <Text style={{fontSize: 14, fontWeight:'bold', left: 14, top: 3 }}>친구 목록</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{height: 104, width: 160, borderWidth: 1, borderColor: 'gray', borderRadius: 8, flexDirection: 'row', paddingTop: 16, paddingLeft: 18}}>
            <Image source={alarmImage}/>
            <Text style={{fontSize: 14, fontWeight:'bold', left: 14, top: 3 }}>알림</Text>
          </TouchableOpacity>
        </View>
        <View style={{alignItems:'center', flexDirection:'row', justifyContent: 'space-between'}}>
          <TouchableOpacity style={{height: 104, width: 160, borderWidth: 1, borderColor: 'gray', borderRadius: 8, flexDirection: 'row', paddingTop: 16, paddingLeft: 18}}>
            <Image source={themeImage}/>
            <Text style={{fontSize: 14, fontWeight:'bold', left: 14, top: 3 }}>테마</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{height: 104, width: 160, borderWidth: 1, borderColor: 'gray', borderRadius: 8, flexDirection: 'row', paddingTop: 16, paddingLeft: 18}}>
            <Image source={fontImage}/>
            <Text style={{fontSize: 14, fontWeight:'bold', left: 14, top: 3 }}>폰트</Text>
          </TouchableOpacity>
        </View> 
      </View>

      <TouchableOpacity onPress={()=>tabBarHandler(false)} style={{position: 'absolute', width: '100%', height: 35, top: 435, justifyContent: 'center', marginTop: 10}}>
        <Text style={{left: 20, fontSize:14, fontWeight: '400'}}>앱정보</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>tabBarHandler(true)} style={{position: 'absolute', width: '100%', height: 35, top: 485, justifyContent: 'center'}}>
        <Text style={{left: 20, fontSize:14, fontWeight: '400'}}>맵시 응원하기</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{position: 'absolute', width: '100%', height: 35, top: 525, justifyContent: 'center'}}>
        <Text style={{left: 20, fontSize:14, fontWeight: '400'}}>의견 보내기</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>gotoBeforeLoginScreen({navigation: navigation})} style={{position: 'absolute', width: '100%', height: 35, top: 565, justifyContent: 'center'}}>
        <Text style={{left: 20, fontSize:14, fontWeight: '400'}}>로그아웃</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
}

export default MypageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
