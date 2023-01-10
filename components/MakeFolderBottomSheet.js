import { getDatabase, ref, onValue, set, push } from "firebase/database";
import React, { useEffect, useRef, useState, useContext } from "react";
import {
  Animated,
  Text,
  View,
  TouchableOpacity,
  Button,
  SafeAreaView,
  FlatList,
} from "react-native";
import { ScrollView, Switch, TextInput } from "react-native-gesture-handler";

import AppContext from "../components/AppContext";
import SendPushNotification from "../modules/SendPushNotification";

const MakeFolderBottomSheet = ({
  stackNavigation,
  folderID,
  folderName_,
  folderColor_,
  folderUserIDs_,
  recordDataSource,
}) => {
  const myContext = useContext(AppContext);
  const myUID = myContext.myUID;
  const myID = myContext.myID;
  const myFirstName = myContext.myFirstName;
  const myLastName = myContext.myLastName;

  const IsNewRecord = folderName_ === null;
  const gotoStorageScreen = () => {
    stackNavigation.navigate("Storage");
  };
  const gotoSingleFolderScreen = () => {
    stackNavigation.navigate("SingleFolderScreen", {
      recordDataSource,
      folderID,
      folderName: newFolderName,
      folderColor: newFolderColor,
      folderUserIDs: newFolderUserIDs,
    });
  };
  const gotoInviteFriendScreen = () => {
    stackNavigation.navigate("InviteFriendScreen", {
      folderUserIDs: newFolderUserIDs,
      onChangeFolderUserIDs: onChangeNewFolderUserIDs,
      originalFolderUserIDs: folderUserIDs_,
    });
  };

  const renderFolderUser = ({ item }) => {
    return (
      <View
        style={{
          height: 32,
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 16,
          marginHorizontal: 8,
          marginVertical: 20,
          backgroundColor: "#F4F5F9",
        }}
      >
        <Text
          style={{
            //width: 58,
            height: 24,
            fontWeight: "500",
            fontSize: 16,
            letterSpacing: -0.5,
            color: "black",
          }}
        >
          {item.name}
        </Text>
      </View>
    );
  };
  const addNewFolder = async (
    folderID,
    folderName,
    folderColor,
    folderUserIDs,
    originalFolderUserIDs
  ) => {
    const db = getDatabase();
    if (IsNewRecord) {
      //새 기록이면 친구초대한 모든 사람 대상으로 데이터베이스 수정(-->이건 나 말고 다른 사람에게는 해당X) 및 알림 보내기
      //친구초대한 사람한테 push알림 보내는 함수
      const reference1 = ref(db, "/folders"); //folders에 push
      const newFolderID = push(reference1, {
        initFolderName: folderName,
        initFolderColor: folderColor,
      }).key;
      folderUserIDs.map((folderUserID) => {
        if (folderUserID == myUID) {
          //나는 폴더에 넣기
          const reference2 = ref(
            db,
            `/folders/${newFolderID}/folderName/${folderUserID}`
          ); //folderName 개인화
          set(reference2, folderName);
          const reference3 = ref(
            db,
            `/folders/${newFolderID}/folderColor/${folderUserID}`
          ); //folderColor 개인화
          set(reference3, folderColor);
          const reference4 = ref(
            db,
            `/folders/${newFolderID}/userIDs/${folderUserID}`
          ); //folders/newfolderID/userIDs에 userID:true를 넣기
          set(reference4, true);
          const reference5 = ref(
            db,
            `users/${folderUserID}/folderIDs/${newFolderID}`
          ); //user에 folderID를 넣고
          set(reference5, true);
        } else {
          const timeNow = new Date();
          const reference = ref(db, "/notices/" + folderUserID);
          push(reference, {
            type: "recept_folderInvite_request",
            requesterUID: myUID,
            requesterID: myID,
            requesterFirstName: myFirstName,
            requesterLastName: myLastName,
            time: timeNow.getTime(),
            //여기서 부턴 "recept_folderInvite_request" type 알림만의 정보
            folderID: newFolderID,
            folderName,
            folderColor,
          });
          SendPushNotification({
            receiverUID: folderUserID,
            title_: "새폴더초대타이틀",
            body_: "새폴더초대바디",
          });
        }
      });
    } else {
      //새 폴더가 아니라면 개인화폴더이름, 폴더색상만 데이터베이스상에서 수정
      const reference1 = ref(db, `/folders/${folderID}/folderName/${myUID}`); //folderName 개인화
      set(reference1, folderName);
      const reference2 = ref(db, `/folders/${folderID}/folderColor/${myUID}`); //folderColor 개인화
      set(reference2, folderColor);
      //공통폴더이름, 색상 가져오기
      onValue(ref(db, `/folders/${folderID}/initFolderName`), (snapshot) => {
        const initFolderName = snapshot.val();
        onValue(
          ref(db, `/folders/${folderID}/initFolderColor`),
          (snapshot2) => {
            const initFolderColor = snapshot2.val();
            folderUserIDs.map((folderUserID) => {
              //새로 추가된 친구에 대해 공통폴더이름, 색상 부여 필요
              //folderName 공통폴더이름 부여
              if (!originalFolderUserIDs.includes(folderUserID)) {
                const timeNow = new Date();
                const reference = ref(db, "/notices/" + folderUserID);
                push(reference, {
                  type: "recept_folderInvite_request",
                  requesterUID: myUID,
                  requesterID: myID,
                  requesterFirstName: myFirstName,
                  requesterLastName: myLastName,
                  time: timeNow.getTime(),
                  //여기서 부턴 "recept_folderInvite_request" type 알림만의 정보
                  folderID,
                  folderName: initFolderName,
                  folderColor: initFolderColor,
                });
                SendPushNotification({
                  receiverUID: folderUserID,
                  title_: "피어나 뭐해요?",
                  body_: "뉴진스 덕질해요",
                });
              }
            });
          }
        );
      });
    }
  };

  const [newFolderName, setNewFolderName] = useState(folderName_ || "");
  const [newFolderColor, setNewFolderColor] = useState(
    folderColor_ || "#FF6363"
  );
  const [newFolderUserIDs, setNewFolderUserIDs] = useState(
    folderUserIDs_ || [myUID]
  );
  const [newFolderUserNameIDs, setNewFolderUserNameIDs] = useState([]);
  const onChangeNewFolderUserIDs = (newFolderUserIDs_) => {
    setNewFolderUserIDs(newFolderUserIDs_);
  };
  //폴더에 속한 친구이름 목록을 바텀쉬트에 띄우는 함수

  useEffect(() => {
    const db = getDatabase();
    setNewFolderUserNameIDs([]);
    newFolderUserIDs.map((userID) => {
      onValue(ref(db, "/users/" + userID), (snapshot) => {
        setNewFolderUserNameIDs((prev) => [
          ...prev,
          {
            userID,
            name:
              snapshot.child("lastName").val() +
              snapshot.child("firstName").val(),
          },
        ]);
      });
    });
  }, [newFolderUserIDs]);

  return (
    <View style={{ width: "100%", height: "100%" }}>
      <View
        style={{ top: 24, width: 61, height: 24, left: 23, marginBottom: 24 }}
      >
        {IsNewRecord ? (
          <Text style={{ fontSize: 16, fontWeight: "700" }}>폴더 추가</Text>
        ) : (
          <Text style={{ fontSize: 16, fontWeight: "700" }}>폴더 수정</Text>
        )}
      </View>
      <View
        style={{
          top: 26,
          width: 344,
          height: 48,
          left: 23,
          marginBottom: 24,
          borderBottomColor: "black",
          borderBottomWidth: 1,
          justifyContent: "center",
        }}
      >
        <TextInput
          style={{ fontSize: 14, fontWeight: "400", lineHeight: 0 }}
          value={newFolderName}
          onChangeText={(fdr) => setNewFolderName(fdr)}
          placeholder="폴더"
          placeholderTextColor="grey"
        />
      </View>
      <View
        style={{ top: 24, width: 390, height: 128, left: 23, marginBottom: 24 }}
      >
        <Text style={{ fontSize: 14, fontWeight: "700" }}>폴더 색상</Text>
        <View style={{ top: 24, flexDirection: "column" }}>
          <View style={{ top: 0, flexDirection: "row", paddingBottom: 16 }}>
            <TouchableOpacity
              onPress={() => setNewFolderColor("#FF6363")}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: "#FF6363",
                justifyContent: "center",
                marginRight: 31,
              }}
            >
              <View
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor:
                    newFolderColor == "#FF6363" ? "#FF6363" : "white",
                  alignSelf: "center",
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setNewFolderColor("#FD7CA9")}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: "#FD7CA9",
                justifyContent: "center",
                marginRight: 31,
              }}
            >
              <View
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor:
                    newFolderColor == "#FD7CA9" ? "#FD7CA9" : "white",
                  alignSelf: "center",
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setNewFolderColor("#FFA8A3")}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: "#FFA8A3",
                justifyContent: "center",
                marginRight: 31,
              }}
            >
              <View
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor:
                    newFolderColor == "#FFA8A3" ? "#FFA8A3" : "white",
                  alignSelf: "center",
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setNewFolderColor("#FFC700")}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: "#FFC700",
                justifyContent: "center",
                marginRight: 31,
              }}
            >
              <View
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor:
                    newFolderColor == "#FFC700" ? "#FFC700" : "white",
                  alignSelf: "center",
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setNewFolderColor("#FF9D66")}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: "#FF9D66",
                justifyContent: "center",
                marginRight: 31,
              }}
            >
              <View
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor:
                    newFolderColor == "#FF9D66" ? "#FF9D66" : "white",
                  alignSelf: "center",
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setNewFolderColor("#545766")}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: "#545766",
                justifyContent: "center",
                marginRight: 31,
              }}
            >
              <View
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor:
                    newFolderColor == "#545766" ? "#545766" : "white",
                  alignSelf: "center",
                }}
              />
            </TouchableOpacity>
          </View>
          <View style={{ top: 0, flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() => setNewFolderColor("#AB69ED")}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: "#AB69ED",
                justifyContent: "center",
                marginRight: 31,
              }}
            >
              <View
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor:
                    newFolderColor == "#AB69ED" ? "#AB69ED" : "white",
                  alignSelf: "center",
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setNewFolderColor("#C4B6FF")}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: "#C4B6FF",
                justifyContent: "center",
                marginRight: 31,
              }}
            >
              <View
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor:
                    newFolderColor == "#C4B6FF" ? "#C4B6FF" : "white",
                  alignSelf: "center",
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setNewFolderColor("#69C2F4")}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: "#69C2F4",
                justifyContent: "center",
                marginRight: 31,
              }}
            >
              <View
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor:
                    newFolderColor == "#69C2F4" ? "#69C2F4" : "white",
                  alignSelf: "center",
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setNewFolderColor("#4D74FD")}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: "#4D74FD",
                justifyContent: "center",
                marginRight: 31,
              }}
            >
              <View
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor:
                    newFolderColor == "#4D74FD" ? "#4D74FD" : "white",
                  alignSelf: "center",
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setNewFolderColor("#0DBA09")}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: "#0DBA09",
                justifyContent: "center",
                marginRight: 31,
              }}
            >
              <View
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor:
                    newFolderColor == "#0DBA09" ? "#0DBA09" : "white",
                  alignSelf: "center",
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setNewFolderColor("#42E83F")}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: "#42E83F",
                justifyContent: "center",
                marginRight: 31,
              }}
            >
              <View
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor:
                    newFolderColor == "#42E83F" ? "#42E83F" : "white",
                  alignSelf: "center",
                }}
              />
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
      <View
        style={{
          top: 30,
          width: 344,
          height: 24,
          left: 23,
          marginBottom: 24,
          flexDirection: "row",
        }}
      >
        <Text style={{ fontSize: 14, fontWeight: "400" }}>친구초대</Text>
        <View>
          <TouchableOpacity
            onPress={() => {
              gotoInviteFriendScreen();
            }}
            style={{
              marginLeft: 20,
              backgroundColor: "red",
            }}
          >
            <Text>친구초대 버튼</Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={newFolderUserNameIDs}
        renderItem={renderFolderUser}
        keyExtractor={(item) => item.userID}
        horizontal={false}
        numColumns={3}
        style={{
          flex: 1,
        }}
      />

      <TouchableOpacity
        onPress={async () => {
          await addNewFolder(
            folderID,
            newFolderName,
            newFolderColor,
            newFolderUserIDs,
            folderUserIDs_
          ).then(() => {
            IsNewRecord ? gotoStorageScreen() : gotoSingleFolderScreen();
          });
          // if(IsNewRecord){gotoStorageScreen()}
          // else{gotoSingleFolderScreen()} //gotoSingleFolderScreen()
        }}
        style={{
          position: "absolute",
          bottom: 40,
          width: 350,
          height: 48,
          borderColor: "black",
          borderWidth: 1,
          borderRadius: 8,
          alignSelf: "center",
        }}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            height: 40,
          }}
        >
          {IsNewRecord ? (
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>추가</Text>
          ) : (
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>수정</Text>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default MakeFolderBottomSheet;
