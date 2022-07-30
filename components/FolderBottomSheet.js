import { set } from 'firebase/database';
import React, {useEffect, useRef, useState} from 'react';
import { Animated, Text, View, TouchableOpacity, Button } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AddFolderBottomSheet from './AddFolderBottomSheet';

import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, push } from 'firebase/database';
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

const FolderBottomSheet = ({show, setShow, setFolderName, setFolderID}) => {

  useEffect(()=>{
    const db = getDatabase();
    return onValue(ref(db, '/users/' + myID + '/folderIDs'), (snapshot) => {
      const folderIDList = Object.keys(snapshot.val());
      folderIDList.map((folderID)=>{
        return onValue(ref(db, '/folders/'+folderID+'/folderName'), (snapshot2)=>{
            setFolderIDNameList((prev)=>[...prev, {folderID: folderID, folderName: snapshot2.val()}])          
        })
      })
      }
    )
    }, {
      onlyOnce: true
  },[]);

  const [folderIDNameList, setFolderIDNameList] = useState([]);
  const [isSelectingFolder, setIsSelectingFolder] = useState(true);    //folderlist 창과 폴더 추가창 중 무엇을 띄울지에 대한 bool

  const [animationValue, setAnimationValue] = useState(-1000);
  useEffect(()=>{toggleAnimation(); setIsSelectingFolder(true);},[show])

  const showAnimation = useRef(new Animated.Value(animationValue)).current
  const toggleAnimation = () => {
    const val = show ? 0 : -1000;
    Animated.timing(showAnimation, {
      useNativeDriver: false,
      toValue: val,
      duration: 350
    }).start()
    setAnimationValue(val);
  }
  
  return (
    <Animated.View style={{
        width: "100%",
        backgroundColor:"#fff",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 0,
        position: 'absolute',
        zIndex: 3,
        alignItems: 'center',
        justifyContent: 'center',
        height: 630,
        shadowOffset: {
          width: 0,
          height: 12,
        },
        alignSelf:'center',
        shadowOpacity: 0.58, 
        shadowRadius: 16.00,
        bottom: showAnimation,
        elevation: 24,
      }}>
      
      {isSelectingFolder? 
      <View style={{width:'100%', height: '100%'}}>
        <ScrollView showsHorizontalScrollIndicator={false} style={{width: "100%", top:20}}>
          {folderIDNameList.map(({folderID, folderName}) => {
            if(folderName!=null)
            return(
              <View style={{alignItems:'center', paddingBottom: 10}}>
              <TouchableOpacity onPress={()=>{
                setFolderName(folderName);
                setFolderID(folderID);
                setShow(false);
                }}
                style={{
                  width: 350,
                  borderWidth: 1,
                  borderRadius: 8,
                }}
                >
                  <View style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 40,
                  marginBottom: 0,
                  top: 0,
                }}>
                  <Text style={{fontSize: 16, fontWeight: "bold"}}>{folderName}</Text>
                </View>
              </TouchableOpacity>
              </View>
            )
          })
        }             
        </ScrollView>
        <TouchableOpacity onPress={()=>{
            setIsSelectingFolder(false);
          }}
          style={{
            bottom: 40,
            width: 350,
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
            <Text style={{fontSize: 16, fontWeight: "bold"}}>새 폴더 추가</Text>
          </View>
        </TouchableOpacity>
      </View>
      :
        <AddFolderBottomSheet setFolderName={(f)=>setFolderName(f)} setFolderID={f=>setFolderID(f)}  setFolderIDNameList={f=>setFolderIDNameList(f)} setShow={(s)=>setShow(s)}/>
      }
      </Animated.View>
  )
}

export default FolderBottomSheet;