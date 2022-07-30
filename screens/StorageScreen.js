import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { AnimatedButton, FlatList, Image } from 'react-native';


const folderImage = require('../assets/image/folder.png');
const addFolderImage = require('../assets/image/addFolder.png');
const searchImage = require('../assets/image/search.png')

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

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    file: 'abcd',
    //fileColor: 'red'
    location: ['서울시 아몰랑', 10, 20],
    date: '2020.01.01',
    content: {
      contentDate: '2020.01.02',
      contentTitle: '개발조아1',
      contentLocation: '짧은주소',
      contentText: '기록내용',
      contentImage: '이미지 어떤식으로 넣어야 함? 용량이 커서 개인기록은 로컬에 저장하는 것도 방법'
    }
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    file: 'abcd',
    //fileColor: 'red'
    location: ['서울시 아몰랑', 10, 20],
    date: '2020.01.01',
    content: {
      contentDate: '2020.01.02',
      contentTitle: '개발조아2',
      contentLocation: '짧은주소',
      contentText: '기록내용',
      contentImage: '이미지 어떤식으로 넣어야 함? 용량이 커서 개인기록은 로컬에 저장하는 것도 방법'
    }
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    file: '기본',
    //fileColor: 'blue'
    location: ['서울시 아몰랑', 10, 20],
    date: '2020.01.01',
    content: {
      contentDate: '2020.01.02',
      contentTitle: '개발조아3',
      contentLocation: '짧은주소',
      contentText: '기록내용',
      contentImage: '이미지 어떤식으로 넣어야 함? 용량이 커서 개인기록은 로컬에 저장하는 것도 방법'
    }
  },
];

const StorageScreen = ({stackNavigation}) => {
  useEffect(()=>{                                           //uniquefile채워주기
    const db = getDatabase();
    onValue(ref(db, '/users/' + myID + '/folderIDs'), (snapshot) => {
      const folderIDList = Object.keys(snapshot.val());
      setUniqueFile([]);
      folderIDList.map((folderID)=>{
        return onValue(ref(db, '/folders/'+folderID+'/folderName'), (snapshot2)=>{
          setUniqueFile((prev)=>[...prev, {folderID: folderID, folderName: snapshot2.val()}])          
        })
      })
      }
    )
    onValue(ref(db, '/records'), (snapshot)=>{
      setMasterDataSource(Object.values(snapshot.val()));
    } )
    }, {
      onlyOnce: true
  },[]);

  const [userData, setUserData] = useState({});           
  const [uniqueFiles, setUniqueFile] = useState([]);      //{folderID: folderName}가 쌓여있음
  const [selectedFile, setSelectedFile] = useState([]);   
  
  const [filteredDataSource, setFilteredDataSource] = useState([]); 
  const [masterDataSource, setMasterDataSource] = useState([]);  //record가 쌓여있음 {recordID: record내용}

  const gotoAddFolderBottomSheetScreen = () => {
    stackNavigation.navigate("MakeFolderBottomSheetScreen")
  }
  //선택된 파일에 따라서 filter 변화 useEffect
  useEffect(() => {
    filterFunction(selectedFile)
  }, [selectedFile])

  const filterFunction = (fileName) => {
    // If fileName is "all", we don't filter anything
    if(fileName === 'all') {
      setFilteredDataSource(masterDataSource);
    }
    // If fileName is not "all", we apply filter based on file
    else {
      // Filter the masterDataSource and update FilteredDataSource
      const newData = masterDataSource.filter(function (item) {
        // Applying filter for the inserted text in search bar
        return item.folderName == fileName;
      });
      setFilteredDataSource(newData);
    }
  };

  const IndividualFolder = ({folderID, folderName}) => {
    return(
      <TouchableOpacity
          onPress={() => {
            setSelectedFile(folderName)
            //<naviagte folderID, folderName> 
          }}
          style={{height:65}}
      >
        <View style={{marginLeft:10, marginRight:10}}>
          <Image
            source={folderImage}
          />
            {/* Image source path changes depending on fileColor */}
            {/* <Image source={} style={{width: 50, height:50}}/> */}
            <Text style={{alignSelf:'center', top: 8}}>{folderName}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  const IndividualRecord = ({ title, placeName, date}) => (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.title}>{placeName}</Text>
      <Text style={styles.title}>{`${date.year}.${date.month}.${date.day}`}</Text>
    </View>
  );

  const renderFolder = ({ item }) => (
    <IndividualFolder folderID={item.folderID} folderName={item.folderName} />
  );  

  const renderItem = ({ item }) => (
    
    <IndividualRecord 
      title={item.title}
      placeName={item.placeName}
      date={item.date}
    />
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
          data={uniqueFiles}
          renderItem={renderFolder}
          keyExtractor={item => item.id}
          horizontal={true}
          style={{
            flex:1,
          }}
        />
      </View>
      <FlatList
        data={masterDataSource}
        renderItem={renderItem}
        keyExtractor={item => '_'+item.id}
        key={'_'}
        numColumns={2}
        style={{
          flex:1,
          left: 10
        }}
        
      />
      {/* <FolderMakerBottomSheet 
        isShow={showFolderMaker}
        showOnOff={setShowFolderMaker}
        fileName={newFileName}
        setFileName={setNewFileName}
        fileColor={newFileColor}
        setFileColor={setNewFileColor}
      /> */}
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
