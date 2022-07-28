import React, {useEffect, useRef, useState} from 'react';
import { Animated, Text, View, TouchableOpacity, Button, SafeAreaView } from 'react-native';
import { ScrollView, Switch, TextInput } from 'react-native-gesture-handler';

import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, push } from 'firebase/database';
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
const myID = "kho2011";

const AddFolderBottomSheet = ({setFolderName, setFolderID, setFolderIDNameList, setShow}) => {
  const addNewFolder = (folderName, folderColor, userID) => {
    const db = getDatabase();
  
    const reference1 = ref(db, '/folders');
    let newFolderID = push(reference1, {
        folderName: folderName,
        folderColor: folderColor,
        userIDs: userID
        }).key;
    console.log(newFolderID);
    const reference2 = ref(db, `users/${myID}/folderIDs/${newFolderID}`);
    set(reference2, 
        true
    );
    setFolderIDNameList((prev)=>[...prev, {folderID: newFolderID, folderName: newFolderName}]);
    setFolderID(newFolderID);
    setFolderName(newFolderName);
  }

    const [newFolderName, setNewFolderName] = useState('')
    const [newFolderColor, setNewFolderColor] = useState('red')
    const [newFolderUserID, setNewFolderUserID] = useState('kho2011')
    return(
      <View style={{width:'100%', height: '100%'}}>
        <View style={{top: 24, width: 61, height: 24, left: 23, marginBottom: 24}}>
          <Text style={{fontSize: 16, fontWeight: "700"}}>폴더 추가</Text> 
        </View>
        <View style={{top: 26, width: 344, height: 48, left: 23, marginBottom: 24, borderBottomColor: 'black', borderBottomWidth: 1, justifyContent:'center'}}>
          <TextInput
            style={{fontSize: 14, fontWeight: '400', lineHeight:0}}
            value={newFolderName}
            onChangeText={fdr=>setNewFolderName(fdr)}
            placeholder="폴더"
            placeholderTextColor='grey'
          />
        </View>
        <View style={{top: 24, width: 390, height: 128, left: 23, marginBottom: 24, }}>
          <Text style={{fontSize: 14, fontWeight: "700"}}>폴더 색상</Text> 
          <View style={{top:24, flexDirection:'column'}}>
            <View style={{top:0, flexDirection:'row', paddingBottom: 16}}>
              <TouchableOpacity style={{width:32, height: 32, borderRadius:16, backgroundColor: 'red', justifyContent:'center', marginRight: 31}}>
                <View style={{width:16, height:16, borderRadius:8, backgroundColor: 'white', alignSelf:'center'}} />
              </TouchableOpacity>
              <TouchableOpacity style={{width:32, height: 32, borderRadius:16, backgroundColor: 'red', justifyContent:'center', marginRight: 31}}>
                <View style={{width:16, height:16, borderRadius:8, backgroundColor: 'white', alignSelf:'center'}} />
              </TouchableOpacity>
              <TouchableOpacity style={{width:32, height: 32, borderRadius:16, backgroundColor: 'red', justifyContent:'center', marginRight: 31}}>
                <View style={{width:16, height:16, borderRadius:8, backgroundColor: 'white', alignSelf:'center'}} />
              </TouchableOpacity>
              <TouchableOpacity style={{width:32, height: 32, borderRadius:16, backgroundColor: 'red', justifyContent:'center', marginRight: 31}}>
                <View style={{width:16, height:16, borderRadius:8, backgroundColor: 'white', alignSelf:'center'}} />
              </TouchableOpacity>
              <TouchableOpacity style={{width:32, height: 32, borderRadius:16, backgroundColor: 'red', justifyContent:'center', marginRight: 31}}>
                <View style={{width:16, height:16, borderRadius:8, backgroundColor: 'white', alignSelf:'center'}} />
              </TouchableOpacity>
              <TouchableOpacity style={{width:32, height: 32, borderRadius:16, backgroundColor: 'red', justifyContent:'center', marginRight: 31}}>
                <View style={{width:16, height:16, borderRadius:8, backgroundColor: 'white', alignSelf:'center'}} />
              </TouchableOpacity>
            </View>
            <View style={{top:0, flexDirection:'row'}}>
              <TouchableOpacity style={{width:32, height: 32, borderRadius:16, backgroundColor: 'red', justifyContent:'center', marginRight: 31}}>
                <View style={{width:16, height:16, borderRadius:8, backgroundColor: 'white', alignSelf:'center'}} />
              </TouchableOpacity>
              <TouchableOpacity style={{width:32, height: 32, borderRadius:16, backgroundColor: 'red', justifyContent:'center', marginRight: 31}}>
                <View style={{width:16, height:16, borderRadius:8, backgroundColor: 'white', alignSelf:'center'}} />
              </TouchableOpacity>
              <TouchableOpacity style={{width:32, height: 32, borderRadius:16, backgroundColor: 'red', justifyContent:'center', marginRight: 31}}>
                <View style={{width:16, height:16, borderRadius:8, backgroundColor: 'white', alignSelf:'center'}} />
              </TouchableOpacity>
              <TouchableOpacity style={{width:32, height: 32, borderRadius:16, backgroundColor: 'red', justifyContent:'center', marginRight: 31}}>
                <View style={{width:16, height:16, borderRadius:8, backgroundColor: 'white', alignSelf:'center'}} />
              </TouchableOpacity>
              <TouchableOpacity style={{width:32, height: 32, borderRadius:16, backgroundColor: 'red', justifyContent:'center', marginRight: 31}}>
                <View style={{width:16, height:16, borderRadius:8, backgroundColor: 'white', alignSelf:'center'}} />
              </TouchableOpacity>
              <TouchableOpacity style={{width:32, height: 32, borderRadius:16, backgroundColor: 'red', justifyContent:'center', marginRight: 31}}>
                <View style={{width:16, height:16, borderRadius:8, backgroundColor: 'white', alignSelf:'center'}} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={{top: 30, width: 344, height: 24, left: 23, marginBottom: 24, flexDirection: 'row', justifyContent:'space-between'}}>
          <Text style={{fontSize: 14, fontWeight: "700"}}>공유 폴더</Text> 
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={"#f5dd4b"}
            ios_backgroundColor="#3e3e3e"
          />
        </View>
        <View style={{top: 30, width: 344, height: 48, left: 23, marginBottom: 24, flexDirection:'column'}}>
          <Text style={{fontSize: 14, fontWeight: "700"}}>친구 추가</Text> 
          <TouchableOpacity
            style={{
              top:20,
              width:24,
              height:24,
              borderRadius:12,
              borderWidth:1,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Text>+</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={()=>{
            addNewFolder(newFolderName, newFolderColor, newFolderUserID);
            setShow(false);
          }}
          style={{
            position:'absolute',
            bottom: 40,
            width: 350,
            height: 48,
            borderColor : 'black',
            borderWidth: 1,
            borderRadius: 8,
            alignSelf: 'center'
          }}
          >
          <View style={{
            alignItems: 'center',
            justifyContent: 'center',
            height: 40,
          }}>
            <Text style={{fontSize: 16, fontWeight: "bold"}}>추가</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
}

export default AddFolderBottomSheet;