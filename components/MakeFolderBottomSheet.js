import React, {useEffect, useRef, useState} from 'react';
import { Animated, Text, View, TouchableOpacity, Button, SafeAreaView } from 'react-native';
import { ScrollView, Switch, TextInput } from 'react-native-gesture-handler';
import { useContext } from 'react';
import AppContext from '../components/AppContext';
import { getDatabase, ref, onValue, set, push } from 'firebase/database';

const MakeFolderBottomSheet = ({stackNavigation, folderID, folderName_, folderColor_, folderUserIDs_, recordDataSource}) => {
  const myContext = useContext(AppContext);
  const myUID = myContext.myUID
  
  const IsNewRecord = folderName_=== '' ? true : false;
  const gotoStorageScreen = () => {
    stackNavigation.navigate('Storage')
  }
  const gotoSingleFolderScreen = () => {
    stackNavigation.navigate('SingleFolderScreen', {recordDataSource: recordDataSource, folderID: folderID, folderName: newFolderName, folderColor: newFolderColor, folderUserIDs: newFolderUserIDs})
  }
  const gotoInviteFriendScreen = () => {
    stackNavigation.navigate('InviteFriendScreen', {folderUserIDs: newFolderUserIDs, onChangeFolderUserIDs: onChangeNewFolderUserIDs})
  }
  const addNewFolder = async (folderID, folderName, folderColor, folderUserIDs) => {
    const db = getDatabase();
    if(IsNewRecord)         //새 기록이면
    //친구초대한 사람한테 push알림 보내는 함수
    {
      const reference1 = ref(db, '/folders');                      //folders에 push
      let newFolderID = push(reference1, {
          folderName: folderName,
          folderColor: folderColor,
          }).key;
      const reference2 = ref(db, `/folders/${newFolderID}/folderName/${myUID}`)    //folderName 개인화
      set (reference2,
        folderName
      );
      const reference3 = ref(db, `/folders/${newFolderID}/folderColor/${myUID}`)    //folderColor 개인화
      set (reference3,
        folderColor
      );
      const reference4 = ref(db, `/folders/${newFolderID}/userIDs/${myUID}`)     //folders/newfolderID/userIDs에 userID:true를 넣기
      set (reference4,
        true
      );
      const reference5 = ref(db, `users/${myUID}/folderIDs/${newFolderID}`);      //user에 folderID를 넣고
      set(reference5, 
          true
      );
    }
    else                    //새 기록이 아니라면
    {
      const reference1 = ref(db, '/folders/'+folderID+'/folderName/'+myUID);                      //folders에 push
      set(reference1, 
          folderName
      )
      const reference2 = ref(db, '/folders/'+folderID+'/folderColor/'+myUID);                      //folders에 push
      set(reference2, 
          folderColor
      )
    }
    
  }

    const [newFolderName, setNewFolderName] = useState(folderName_ || '')
    const [newFolderColor, setNewFolderColor] = useState(folderColor_ || '#FF6363')
    const [newFolderUserIDs, setNewFolderUserIDs] = useState(folderUserIDs_ || [myUID])
    const [newFolderUserNameIDs, setNewFolderUserNameIDs] = useState({})
    const onChangeNewFolderUserIDs = (newFolderUserIDs_) => {
      setNewFolderUserIDs(newFolderUserIDs_)
    }
    //폴더에 속한 친구이름 목록을 바텀쉬트에 띄우는 함수
    /** 
    useEffect(()=>{
      const db = getDatabase()
      newFolderUserIDs.map((userID)=>{
        onValue(ref(db, '/users/' + userID), (snapshot) => {
          if(snapshot.val()!=null){                             //한 user가 folder를 갖고 있지 않을 수 있어!!
            const reference
                onValue(ref(db, '/users/' + friendUID), (snapshot2) => {
                    if(!friendIDNameList.includes({userID: friendUID, id: snapshot2.child("id").val(), name: snapshot2.child("lastName").val()+snapshot2.child("firstName").val()}))
                        {setFriendIDNameList((prev)=>[...prev, {userID: friendUID, id: snapshot2.child("id").val(), name: snapshot2.child("lastName").val()+snapshot2.child("firstName").val()}])}
                })
          }
        })
        setNewFolderUserNameIDs((prev)=>[...prev, ])

      })
    }, [])
    **/
    return(
      <View style={{width:'100%', height: '100%'}}>
        <View style={{top: 24, width: 61, height: 24, left: 23, marginBottom: 24}}>
          {
            IsNewRecord?
            <Text style={{fontSize: 16, fontWeight: "700"}}>폴더 추가</Text> 
            :
            <Text style={{fontSize: 16, fontWeight: "700"}}>폴더 수정</Text> 
          }
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
              <TouchableOpacity onPress={()=>setNewFolderColor('#FF6363')} style={{width:32, height: 32, borderRadius:16, backgroundColor: '#FF6363', justifyContent:'center', marginRight: 31}}>
                <View style={{width:16, height:16, borderRadius:8, backgroundColor: (newFolderColor=='#FF6363') ? '#FF6363' : 'white', alignSelf:'center'}} />
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>setNewFolderColor('#FD7CA9')} style={{width:32, height: 32, borderRadius:16, backgroundColor: '#FD7CA9', justifyContent:'center', marginRight: 31}}>
                <View style={{width:16, height:16, borderRadius:8, backgroundColor: (newFolderColor=='#FD7CA9') ? '#FD7CA9' : 'white', alignSelf:'center'}} />
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>setNewFolderColor('#FFA8A3')} style={{width:32, height: 32, borderRadius:16, backgroundColor: '#FFA8A3', justifyContent:'center', marginRight: 31}}>
                <View style={{width:16, height:16, borderRadius:8, backgroundColor: (newFolderColor=='#FFA8A3') ? '#FFA8A3' : 'white', alignSelf:'center'}} />
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>setNewFolderColor('#FFC700')} style={{width:32, height: 32, borderRadius:16, backgroundColor: '#FFC700', justifyContent:'center', marginRight: 31}}>
                <View style={{width:16, height:16, borderRadius:8, backgroundColor: (newFolderColor=='#FFC700') ? '#FFC700' : 'white', alignSelf:'center'}} />
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>setNewFolderColor('#FF9D66')} style={{width:32, height: 32, borderRadius:16, backgroundColor: '#FF9D66', justifyContent:'center', marginRight: 31}}>
                <View style={{width:16, height:16, borderRadius:8, backgroundColor: (newFolderColor=='#FF9D66') ? '#FF9D66' : 'white', alignSelf:'center'}} />
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>setNewFolderColor('#545766')} style={{width:32, height: 32, borderRadius:16, backgroundColor: '#545766', justifyContent:'center', marginRight: 31}}>
                <View style={{width:16, height:16, borderRadius:8, backgroundColor: (newFolderColor=='#545766') ? '#545766' : 'white', alignSelf:'center'}} />
              </TouchableOpacity>
            </View>
            <View style={{top:0, flexDirection:'row'}}>
              <TouchableOpacity onPress={()=>setNewFolderColor('#AB69ED')} style={{width:32, height: 32, borderRadius:16, backgroundColor: '#AB69ED', justifyContent:'center', marginRight: 31}}>
                <View style={{width:16, height:16, borderRadius:8, backgroundColor: (newFolderColor=='#AB69ED') ? '#AB69ED' : 'white', alignSelf:'center'}} />
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>setNewFolderColor('#C4B6FF')} style={{width:32, height: 32, borderRadius:16, backgroundColor: '#C4B6FF', justifyContent:'center', marginRight: 31}}>
                <View style={{width:16, height:16, borderRadius:8, backgroundColor: (newFolderColor=='#C4B6FF') ? '#C4B6FF' : 'white', alignSelf:'center'}} />
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>setNewFolderColor('#69C2F4')} style={{width:32, height: 32, borderRadius:16, backgroundColor: '#69C2F4', justifyContent:'center', marginRight: 31}}>
                <View style={{width:16, height:16, borderRadius:8, backgroundColor: (newFolderColor=='#69C2F4') ? '#69C2F4' : 'white', alignSelf:'center'}} />
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>setNewFolderColor('#4D74FD')} style={{width:32, height: 32, borderRadius:16, backgroundColor: '#4D74FD', justifyContent:'center', marginRight: 31}}>
                <View style={{width:16, height:16, borderRadius:8, backgroundColor: (newFolderColor=='#4D74FD') ? '#4D74FD' : 'white', alignSelf:'center'}} />
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>setNewFolderColor('#0DBA09')} style={{width:32, height: 32, borderRadius:16, backgroundColor: '#0DBA09', justifyContent:'center', marginRight: 31}}>
                <View style={{width:16, height:16, borderRadius:8, backgroundColor: (newFolderColor=='#0DBA09') ? '#0DBA09' : 'white', alignSelf:'center'}} />
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>setNewFolderColor('#42E83F')} style={{width:32, height: 32, borderRadius:16, backgroundColor: '#42E83F', justifyContent:'center', marginRight: 31}}>
                <View style={{width:16, height:16, borderRadius:8, backgroundColor: (newFolderColor=='#42E83F') ? '#42E83F' : 'white', alignSelf:'center'}} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* <View style={{top: 30, width: 344, height: 24, left: 23, marginBottom: 24, flexDirection: 'row', justifyContent:'space-between'}}>
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
        </View> */}
        <View style={{top: 30, width: 344, height: 24, left: 23, marginBottom: 24, flexDirection: 'row'}}>
          <Text style={{fontSize: 14, fontWeight: "400"}}>친구초대</Text> 
          <View>
            <TouchableOpacity
              onPress={()=>{
                gotoInviteFriendScreen()
              }}
              style={{
                marginLeft: 20,
                backgroundColor: 'red'
              }}
            >
              <Text>친구초대 버튼</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity onPress={async ()=>
          {
            await addNewFolder(folderID, newFolderName, newFolderColor, newFolderUserIDs)
            .then(()=>{
              IsNewRecord?
              gotoStorageScreen() : gotoSingleFolderScreen()
            }
            )
            // if(IsNewRecord){gotoStorageScreen()}
            // else{gotoSingleFolderScreen()} //gotoSingleFolderScreen() 
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
            {
              IsNewRecord ? 
              <Text style={{fontSize: 16, fontWeight: "bold"}}>추가</Text>
              :
              <Text style={{fontSize: 16, fontWeight: "bold"}}>수정</Text>
            }
          </View>
        </TouchableOpacity>
      </View>
    )
}

export default MakeFolderBottomSheet;