import { SafeAreaView, Text, StyleSheet, View, Image, TouchableOpacity, FlatList, Alert } from "react-native";

import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, push, remove, off } from 'firebase/database';
import { useEffect, useState } from "react";
import { useIsFocused } from '@react-navigation/native';

const firebaseConfig = {
  apiKey: "AIzaSyDBq4tZ1QLm1R7iPH8O4dTvebVGWgkRPks",
  authDomain: "mapseedemo1.firebaseapp.com",
  projectId: "mapseedemo1",
  storageBucket: "mapseedemo1.appspot.com",
  messagingSenderId: "839335870793",
  appId: "1:839335870793:web:75004c5d43270610411a98",
  measurementId: "G-8L1MD1CGN2"
};
const app = initializeApp(firebaseConfig);

const goBackImage = require('../assets/image/goBack.png');
const addFriendImage = require('../assets/image/addFriend.png');

const myNickname = '고등어'
const myID = 'kho2011'
const myEmail = 'kho2011@snu.ac.kr'
const db = getDatabase();

const gotoMypageScreen = ({navigation}) => {
    navigation.pop()
}
const deleteFriendPopUp = (friendID) => {
    return(
        Alert.alert(
            '정말 차단하시겠습니까?', '',
            [
              {text: '취소'},
              {text: '삭제', onPress: () => deleteFriend(friendID), style: 'default'}
            ],
            { 
              cancelable: false, 
            }
          )
    )
}
const deleteFriend = async (friendID) =>{
    const reference1 = ref(db, '/users/' + myID +'/friendIDs/' + friendID);
    await remove(reference1)
    .then(()=>{
        const reference2 = ref(db, '/users/' + friendID + '/friendIDs/' + myID)
        remove(reference2)
        
    })
}


const FriendListScreen = ({navigation}) => {
    const [friendIDNameList, setFriendIDNameList] = useState([])
    const isFocused = useIsFocused();
    useEffect(()=>{
        if(isFocused){
            setFriendIDNameList([])
            onValue(ref(db, '/users/' + myID + '/friendIDs'), (snapshot) => {
                if(snapshot.val()!=null){                             //한 user가 folder를 갖고 있지 않을 수 있어!!
                    Object.keys(snapshot.val()).map((friendID)=>{
                        onValue(ref(db, '/users/' + friendID + '/nickname'), (snapshot2) => {
                            if(!friendIDNameList.includes({userID: friendID, nickName: snapshot2.val()}))
                                {setFriendIDNameList((prev)=>[...prev, {userID: friendID, nickname: snapshot2.val()}])}
                        })
                    })
                }
            })        
        }}
    ,[])
    
    const IndividualFriend = ({userID, nickname})=> {
        return(
          <View style={{alignSelf: 'center', width: '100%', height: 75, paddingVertical: 12, paddingHorizontal: 24, flexDirection: 'row'}}>
            <View style={{flex: 0.5, flexDirection: 'column', justifyContent: 'space-between'}}>
                <Text style={{fontSize: 14, fontWeight: 'bold', top: 5}}>{nickname}</Text>
                <Text style={{fontSize: 14, fontWeight: '400', color: 'gray', bottom: 5}}>{userID}</Text>
            </View>
            <View style={{flex: 0.5, justifyContent:'center'}}>
                <TouchableOpacity onPress={()=>deleteFriendPopUp(userID)} style={{position: 'absolute', right: 0, width: 40, height: 30, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 14, fontWeight: '500', color: '#5ED3CC'}}>차단</Text>
                </TouchableOpacity>
            </View>
          </View>
        )
      }
    
      const renderFriendList = ({ item }) => (
        <IndividualFriend userID={item.userID} nickname={item.nickname}/>
      );  

    return(
        <SafeAreaView style={styles.container}> 
            <View style={{position: 'absolute', width: '100%', height: 60, top: 45, flexDirection:'row', paddingTop: 20}}>
                <TouchableOpacity onPress={()=>gotoMypageScreen({navigation: navigation})} style={{left: 21, width: 20, alignItems:'center', height: 20, justifyContent: 'center'}}>
                    <Image source={goBackImage} style={{tintColor: 'black'}}/>
                </TouchableOpacity>
                <View style={{left: 50, width: 260, height: 24}}>
                    <Text style={{fontSize:16, fontWeight:'bold'}}>친구목록</Text> 
                </View>
                <TouchableOpacity style={{left: 65, width: 20, alignItems:'center', height: 20, justifyContent: 'center'}}>
                    <Image source={addFriendImage}/>
                </TouchableOpacity>
            </View>
            
            <View style={{position: 'absolute', width: '100%', height: 740, top: 105}}>
                <FlatList
                    data={friendIDNameList}
                    renderItem={renderFriendList}
                    keyExtractor={item => item.userID}
                    horizontal={false}
                    style={{
                        flex:1,
                    }}
                />
            </View>
        </SafeAreaView>
    )
}

export default FriendListScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });