import { SafeAreaView, Text, View, TouchableOpacity, Image, Alert } from "react-native"
import RecordFlatList from "../components/RecordFlatList";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, push, remove, off } from 'firebase/database';
import { useContext } from 'react';
import AppContext from '../components/AppContext';
const goBackImage = require('../assets/image/goBack.png')
const folder2Image = require('../assets/image/folder2.png')
const editImage = require('../assets/image/edit.png')
const trashcanImage = require('../assets/image/trashcan.png')

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


const exitData = async (myUID, folderID) => {
    const db = getDatabase();
    const reference1 = ref(db, '/users/'+myUID+'/folderIDs/'+folderID);
    await remove(reference1)
    .then(()=>{
        const reference2 = ref(db, '/folders/'+folderID+'/userIDs/'+myUID)
        remove(reference2)
    })
    .then(
        onValue(ref(db, '/folders/'+folderID+'/userIDs'), (snapshot)=>{
            if(!snapshot.hasChildren())
            {
                const reference3 = ref(db, '/folders/'+folderID)
                remove(reference3)
            }
        })
    )
}

const SingleFolderScreen = ({navigation, route}) => {
    const myContext = useContext(AppContext);
    const myUID = myContext.myUID

    const {recordDataSource, folderID, folderName, folderColor} = route.params
    const gotoStorageScreen = () => {
        navigation.pop()
    }
    const gotoMakeFolderBottomSheetScreen = () => {
        navigation.navigate('MakeFolderBottomSheetScreen', {folderID: folderID, folderName: folderName, folderColor: folderColor, recordDataSource: recordDataSource})
    }
    const exitFolder = async () => {
        await exitData(myUID, folderID)
        .then(
            ()=>navigation.navigate('Storage')               //realtimeDataBase가 모두 업데이트 된후 
        )
    }
    const exitFolderPopUp = () => {
        return(
            Alert.alert(
                '정말 삭제하시겠습니까?', '',
                [
                  {text: '취소'},
                  {text: '삭제', onPress: () => exitFolder(), style: 'default'}
                ],
                { 
                  cancelable: false, 
                }
              )
        )
    }
    return(
        <SafeAreaView style={{height:'100%', width:'100%'}}>
            <View style={{flexDirection:'row', height: 40, marginBottom:20, alignItems:'center'}}>
                <TouchableOpacity style={{position: 'absolute', left: 29, width:20, height:30, justifyContent:'center'}} onPress={gotoStorageScreen}>
                    <Image source={goBackImage}/>
                </TouchableOpacity>
                <View style={{position: 'absolute',left: 65}}>
                    <Image source={folder2Image} style={{tintColor: folderColor}}/>
                </View>
                <Text style={{position: 'absolute', fontWeight: 'bold', fontSize: 16, left: 95}}>{folderName}</Text>
                <TouchableOpacity 
                    style={{position:'absolute', right: 64}}
                    onPress={gotoMakeFolderBottomSheetScreen}
                >
                    <Image
                        source={editImage}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={{position:'absolute', right: 26}} onPress={()=>exitFolderPopUp()}>
                <Image
                    source={trashcanImage}
                />
                </TouchableOpacity>
            </View>
            <RecordFlatList recordDataSource={recordDataSource} stackNavigation={navigation}/>
        </SafeAreaView>
    )
}

export default SingleFolderScreen;