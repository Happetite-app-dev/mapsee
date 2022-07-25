import {View, Text, StyleSheet, ScrollView, TextInput, Button, Image, SafeAreaView } from 'react-native';
import React,{createFactory, useState} from 'react';
import ImgPicker from '../components/ImgPicker';
import DatePicker from '../components/DatePicker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FolderBottomSheet from '../components/FolderBottomSheet';

import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, push } from 'firebase/database';

const RecordLocationImage = require('../assets/image/RecordLocation.png');
const RecordDateImage = require('../assets/image/RecordDate.png');
const RecordFolderImage = require('../assets/image/RecordFolder.png');
const RecordFolderNameImage = require('../assets/image/RecordFolderName.png');
const RecordTextImage = require('../assets/image/RecordText.png');
const RecordPhotoImage = require('../assets/image/RecordPhoto.png');
const goBackImage = require('../assets/image/goBack.png')

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
const saveData = (title, place, date, folderName, selectedPhoto, text) => {
    const db = getDatabase();
    const reference1 = ref(db, `users/${myID}/folderIDs/${folderName}`);
    set(reference1, 
        true
    );

    const reference2 = ref(db, '/records');
    push(reference2, {
        title: title,
        placeName: place,
        date: date,
        folderName: folderName,
        photos: selectedPhoto,
        text: text
        });
}

const EditScreen = ({navigation, route}) => {

    const {placeName} = route.params;              //기존 폴더에 대해 추가 작성하고 싶거나 열람하고 싶은 경우 route로 받아온 값으로 부터 initializing이 필요하다

    const [title, setTitle] = useState('');

    const [place,setPlace]=useState(placeName);

    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [folderName, setFolderName] = useState('폴더명');
    const [showFolderBottomSheet, setShowFolderBottomSheet] = useState(false);
    
    const [selectedPhoto, setSelectedPhoto]=useState(null);

    const [text, setText]=useState('');

    const storeRecord = () => {
        saveData(title, place, date, folderName, selectedPhoto, text);
    }

    return(
        <SafeAreaView style={{width: '100%', height: '100%', position:'absolute'}}>
        <View style={{height:'8%', width:'100%', flexDirection: 'row', alignItems:'center'}}>
            <TouchableOpacity style={{left: 7, width:20, height:30, justifyContent:'center'}} onPress={()=>navigation.pop()}>
                <Image source={goBackImage}/>
            </TouchableOpacity>
            <TextInput
                style={{fontSize:17, fontWeight:'bold', top:7, left:1,...styles.textInput}}
                onChangeText={tle=>setTitle(tle)}
                value={title}
                placeholder='제목'  
                placeholderTextColor='grey'
            />
        </View>
        <ScrollView style={{height: '90%', width: '100%'}} showsVerticalScrollIndicator={false}>
            <View onTouchEndCapture={()=>{showFolderBottomSheet && setShowFolderBottomSheet(false)}} style={{height:50,...styles.item}}>
                <Image source={RecordLocationImage}/>
                <TextInput
                    style={{fontSize:15 ,...styles.textInput}}
                    onChangeText={plc=>setPlace(plc)}
                    value={place}  
                />
            </View>
            <View onTouchEndCapture={()=>{showFolderBottomSheet && setShowFolderBottomSheet(false)}} style={{width: 350, height: showDatePicker? 266 : 50, ...styles.item}}>
                <Image source={RecordDateImage}/>
                <DatePicker date1={date} setDate1={date1=>setDate(date1)} show={showDatePicker} setShow={show1=>setShowDatePicker(show1)}/>
            </View>
            <View style={{height:50,...styles.item}}>
                <Image source={RecordFolderImage}/> 
                <TouchableOpacity onPress={()=>{setShowFolderBottomSheet(!showFolderBottomSheet)}} style={{width:76, height:32, borderRadius: 16, left: 10, bottom: 7, alignItems:'center', justifyContent: 'center', flexDirection:'row', backgroundColor: 'grey'}}>
                    <Image source={RecordFolderNameImage}/>
                    <Text> {folderName}</Text>
                </TouchableOpacity> 
                <View onTouchEndCapture={()=>{showFolderBottomSheet && setShowFolderBottomSheet(false)}} style={{flex:1}}/>        
            </View>
            <View style={{height:105, bottom: 5,...styles.item}}>
                <Image source={RecordPhotoImage}/>
                <ImgPicker onImageTaken={photo=>setSelectedPhoto(photo)}/>
            </View>
            <View style={{...styles.item}}>
                <Image source={RecordTextImage}/>  
                <TextInput
                    style={styles.record}
                    onChangeText={txt=>setText(txt)}
                    value={text}
                    multiline={true}
                    placeholder='내용을 입력해주세요'
                    placeholderTextColor='grey'
                />
            </View>
            <View style={{...styles.button}}>
                <TouchableOpacity onPress={()=>navigation.pop()} style={{width:160, padding:15, marginRight:7}}>
                    <Text style={{alignSelf:'center', fontWeight:'bold'}}>취소</Text>
                </TouchableOpacity>
                <Text>|</Text>
                <TouchableOpacity onPress={storeRecord} style={{width:160, padding:15, marginLeft: 7}}>
                    <Text style={{alignSelf:'center', fontWeight:'bold'}}>저장</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
        <FolderBottomSheet show={showFolderBottomSheet} setShow={s=>{setShowFolderBottomSheet(s)}} setFolderName={f=>setFolderName(f)}/>
        </SafeAreaView>
    )
}

export default EditScreen;


const styles=StyleSheet.create({
    item:{
        marginLeft:7,
        flex:1,
        flexDirection: 'row'
    },
    label:{
        fontSize: 17,
        marginTop:2,
        marginBottom:15,
        marginRight:15,
        paddingVertical:4,
        paddingHorizontal:2
    },
    textInput:{
        //borderBottomColor: '#B0E0E6',
        //borderBottomWidth:1,
        marginBottom: 15,
        paddingVertical:2,
        paddingHorizontal:2,
        width: '85%',
        bottom:6,
        paddingLeft:14,
    },
    record:{
        //borderColor: '#B0E0E6',
        width: '85%',
        height:360,
        //borderWidth:1,
        marginBottom: 7,
        paddingVertical:2,
        paddingHorizontal:2,
        left:10,
        bottom: 6,
    },
    button:{
        flex:1,
        justifyContent:'center',
        alignItems: 'center',
        width:'100%',
        height: 60,
        flexDirection: 'row'
    },
});