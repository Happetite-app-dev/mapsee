import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { AnimatedButton, FlatList, Image } from 'react-native';


const folderImage = require('../assets/image/folder.png');
const addFolderImage = require('../assets/image/addFolder.png');
const searchImage = require('../assets/image/search.png')

import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, push } from 'firebase/database';
import RecordFlatList from '../components/RecordFlatList';
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

const StorageScreen = ({stackNavigation}) => {
  useEffect(()=>{                                          
    const db = getDatabase();
    onValue(ref(db, '/users/' + myID + '/folderIDs'), (snapshot) => {
      if(snapshot.val()!=null){                             //한 user가 folder를 갖고 있지 않을 수 있어!!
        //let recordIDList_=[];
        const folderIDList = Object.keys(snapshot.val());           //folderIDList 만들기
        setFolderIDNameColorList([]);                                 //initializing folderIDNameList
        setMasterDataSource([]);                                  //initializing masterDataSource

        folderIDList.map((folderID)=>{                        //각 폴더에 대하여....
          onValue(ref(db, '/folders/'+folderID), (snapshot2)=>{        
            setFolderIDNameColorList((prev)=>[...prev, {folderID: folderID, folderName: snapshot2.child('folderName').val(), folderColor: snapshot2.child('folderColor').val()}])  //folderIDNameList채워주기
            if(snapshot2.child('placeRecords').val()!=null)      //폴더는 있지만 빈폴더라서 record가 안에 없을 수 있어!!        
            {
              //recordIDList_.push(...Object.keys(snapshot2.child('placeRecords').val()))  //해당 user가 소속된 각 폴더에 들어있는 recordIDList들을 합쳐서 하나로 만들어주기(버림)
              Object.values(snapshot2.child('placeRecords').val()).map((recordIDObject)=>{     //folders의 placeRecord 속에 있는 각 placeID에 대응되는 recordIDObject들에 대하여....
                Object.keys(recordIDObject).map((recordID)=>{                                   //각 recordObject에 있는 recordID에 대하여 
                  onValue(ref(db, '/records/'+recordID), (snapshot3)=>{                                            //masterDataSource 채워주기
                    setMasterDataSource((prev)=>[...prev, {recordID: recordID, recordData: snapshot3.val()}])      //{recordID: recordID, recordData:{title: ~~, date: ~~, lctn: ~~, text: ~~, placeName: ~~}}가 쌓여있음
                  })
                })
              })
            } 
          })
        })
      }
    }
    )
   }, {
     onlyOnce: true
  },[]);
  
  const [folderIDNameColorList, setFolderIDNameColorList] = useState([]);      //{folderID, folderName, folderColor}가 쌓여있음
  const [selectedFolderID, setSelectedFolderID] = useState(undefined);   
  
  const [masterDataSource, setMasterDataSource] = useState([]);     //shortened record가 쌓여있음 {recordID, title, folderID, placeName, date, text, photos}

  const gotoAddFolderBottomSheetScreen = () => {
    stackNavigation.navigate("MakeFolderBottomSheetScreen")
  }





  const gotoSingleFolderScreen = (recordDataSource) => {
    setSelectedFolderID(undefined)
    stackNavigation.navigate("SingleFolderScreen", {recordDataSource: recordDataSource})
  }

  //선택된 파일에 따라서 filter 변화 useEffect
  useEffect(() => {
    console.log(selectedFolderID)
    if(selectedFolderID!=undefined){
      filterFunction(selectedFolderID)
    }
  }, [selectedFolderID])

  const filterFunction = (folderID) => {
      // Filter the masterDataSource and update FilteredDataSource
      const filteredDataSource = masterDataSource.filter(function (item) {
        // Applying filter for the inserted text in search bar
        return item.recordData.folderID === folderID;
      });
      gotoSingleFolderScreen(filteredDataSource)
  };





  const IndividualFolder = ({folderID, folderName, folderColor}) => {
    return(
      <TouchableOpacity
          onPress={() => {
            setSelectedFolderID(folderID)
            //gotoSingleFolderScreen()
          }}
          style={{height:65}}
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
          onPress={gotoAddFolderBottomSheetScreen}
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
          keyExtractor={item => item.id}
          horizontal={true}
          style={{
            flex:1,
          }}
        />
      </View>
      <RecordFlatList recordDataSource={masterDataSource} stackNavigation={stackNavigation}/>
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
