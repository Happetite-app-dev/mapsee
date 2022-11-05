import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { AnimatedButton, FlatList, Image } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useContext } from 'react';
import AppContext from '../components/AppContext';
const folderImage = require('../assets/image/folder.png');
const addFolderImage = require('../assets/image/addFolder.png');
const searchImage = require('../assets/image/search.png')

import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, push } from 'firebase/database';
import RecordFlatList from '../components/RecordFlatList'
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

const StorageScreen = ({navigation}) => {
  
  const myContext = useContext(AppContext);
  const myUID = myContext.myUID
  const isFocused = useIsFocused();
  useEffect(()=>{    
    if(isFocused)
    {                                 
    const db = getDatabase();
    onValue(ref(db, '/users/' + myUID + '/folderIDs'), (snapshot) => {
      if(snapshot.val()!=null){                             //한 user가 folder를 갖고 있지 않을 수 있어!!
        const folderIDList = Object.keys(snapshot.val());           //folderIDList 만들기 
        setFolderIDNameColorList((prev)=>[]);                                 //initializing folderIDNameList
        setMasterDataSource((prev)=>[])                            //initializing masterDataSource
        folderIDList.map((folderID)=>{                        //각 폴더에 대하여....
          onValue(ref(db, '/folders/'+folderID), (snapshot2)=>{
            if(!folderIDNameColorList.includes({folderID: folderID, folderName: snapshot2.child('folderName').child(myUID).val() , folderColor: snapshot2.child('folderColor').child(myUID).val()}) )
            {
            setFolderIDNameColorList((prev)=>[...prev, {folderID: folderID, folderName: snapshot2.child('folderName').child(myUID).val() , folderColor: snapshot2.child('folderColor').child(myUID).val()}])  //folderIDNameList채워주기
            //console.log('folder',folderIDNameColorList.length)
            if(snapshot2.child('placeRecords').val()!=(null||undefined))      //폴더는 있지만 빈폴더라서 record가 안에 없을 수 있어!!        
            {
              //recordIDList_.push(...Object.keys(snapshot2.child('placeRecords').val()))  //해당 user가 소속된 각 폴더에 들어있는 recordIDList들을 합쳐서 하나로 만들어주기(버림)
              Object.values(snapshot2.child('placeRecords').val()).map((recordIDObject)=>{     //folders의 placeRecord 속에 있는 각 placeID에 대응되는 recordIDObject들에 대하여....
                Object.keys(recordIDObject).map((recordID)=>{                                   //각 recordObject에 있는 recordID에 대하여 
                  onValue(ref(db, '/records/'+recordID), (snapshot3)=>{   
                    if(snapshot3.val()!=(null||undefined)){            //masterDataSource 채워주기 --> 기존 record를 지웠을 때, 없는 recordID를 찾아서 null이 masterDataSource에 들어가는 경우를 방지하고자 함
                      setMasterDataSource((prev)=>[...prev, {recordID: recordID, recordData: snapshot3.val()}])      //{recordID: recordID, recordData:{title: ~~, date: ~~, lctn: ~~, text: ~~, placeName: ~~}}가 쌓여있음
                    }                                      
                  })
                });
              })
            } 

          }

          })
        })
      }
    }
    )
    }
   }, 
   {  
    
   },
  [isFocused]);

  const [folderIDNameColorList, setFolderIDNameColorList] = useState([]);      //{folderID, folderName, folderColor}가 쌓여있음
  const [selectedFolderIDNameColor, setSelectedFolderIDNameColor] = useState(undefined);   
  
  const [masterDataSource, setMasterDataSource] = useState([]);     //shortened record가 쌓여있음 {recordID, title, folderID, placeName, date, text, photos}

  const gotoMakeFolderBottomSheetScreen = () => {
    navigation.navigate("MakeFolderBottomSheetScreen", {folderName: null, folderColor: null})
  }

  const gotoSingleFolderScreen = (recordDataSource, folderID, folderName, folderColor) => {
    setSelectedFolderIDNameColor(undefined)
    navigation.navigate("SingleFolderScreen", {recordDataSource: recordDataSource, folderID: folderID, folderName: folderName, folderColor: folderColor})
  }

  //선택된 파일에 따라서 filter 변화 useEffect
  useEffect(() => {
    if(selectedFolderIDNameColor!=undefined){
      filterFunction(selectedFolderIDNameColor)
    }
  }, [selectedFolderIDNameColor])

  const filterFunction = ({folderID, folderName, folderColor}) => {
      // Filter the masterDataSource and update FilteredDataSource
      const filteredDataSource = masterDataSource.filter(function (item) {
        // Applying filter for the inserted text in search bar
        return item.recordData.folderID === folderID;
      });
      gotoSingleFolderScreen(filteredDataSource, folderID, folderName, folderColor)
  };


  const IndividualFolder = ({folderID, folderName, folderColor}) => {
    return(
      <TouchableOpacity
          onPress={() => {
            setSelectedFolderIDNameColor({folderID: folderID, folderName: folderName, folderColor: folderColor})
            //gotoSingleFolderScreen()
          }}
          style={{height:65, }}
          activeOpacity={0.2}
      >
        <View style={{marginLeft:10, marginRight:10}}>
          <Image
            source={folderImage}
            style={{tintColor: folderColor}}
          />
            {/* Image source path changes depending on fileColor */}
            {/* <Image source={} style={{width: 50, height:50}}/> */}
            <Text style={{alignSelf:'center', top: 8}}>{folderName}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  const renderFolder = ({ item }) => (
    <IndividualFolder folderID={item.folderID} folderName={item.folderName} folderColor={item.folderColor}/>
  );  

  return (
    <SafeAreaView style={styles.container}>
      <View style={{flexDirection:'row', height: 40, marginBottom:20, alignItems:'center'}}>
        <Text style={{fontWeight: 'bold', fontSize: 16, left: 20}}>보관함</Text>
        <TouchableOpacity 
          style={{position:'absolute', right: 64}}
          onPress={gotoMakeFolderBottomSheetScreen}
        >
          <Image
            source={addFolderImage}
          />
        </TouchableOpacity>
        <TouchableOpacity style={{position:'absolute', right: 26}}>
          <Image
            source={searchImage}
          />
        </TouchableOpacity>
      </View>
      <View style={{height: 85}}>
        <FlatList
          data={folderIDNameColorList}
          renderItem={renderFolder}
          keyExtractor={item => item.folderID}
          horizontal={true}
          style={{
            flex:1,
          }}
        />
      </View>
      <RecordFlatList recordDataSource={masterDataSource} stackNavigation={navigation}/>
    </SafeAreaView>
  );
}

export default StorageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    flex: 0.5,
    borderColor: 'grey',
    borderRadius: 8,
    borderWidth: 1,
    padding: 0,
    height: 224,
    maxWidth: 160,
    marginVertical: 8,  
    marginHorizontal: 12,
  
  },
  title: {
    fontSize: 16,
  },
});
