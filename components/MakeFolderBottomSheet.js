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
const db = getDatabase();
const gotoStorageScreen = (stackNavigation) => {
  stackNavigation.navigate("Storage");
};
const gotoSingleFolderScreen = ({
  stackNavigation,
  recordDataSource,
  folderID,
  newFolderName,
  newFolderColor,
  newFolderUserIDs,
}) => {
  stackNavigation.navigate("SingleFolderScreen", {
    recordDataSource,
    folderID,
    folderName: newFolderName,
    folderColor: newFolderColor,
    folderUserIDs: newFolderUserIDs,
  });
};
const gotoInviteFriendScreen = ({
  stackNavigation,
  newFolderUserIDs,
  onChangeNewFolderUserIDs,
  folderUserIDs_,
}) => {
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
const addNewFolder = async ({
  folderID,
  folderName,
  folderColor,
  folderUserIDs,
  originalFolderUserIDs,
  IsNewRecord,
  myUID,
}) => {
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
          time: timeNow.getTime(),
          //여기서 부턴 "recept_folderInvite_request" type 알림만의 정보
          folderID: newFolderID,
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
      onValue(ref(db, `/folders/${folderID}/initFolderColor`), (snapshot2) => {
        folderUserIDs.map((folderUserID) => {
          //새로 추가된 친구에 대해 공통폴더이름, 색상 부여 필요
          //folderName 공통폴더이름 부여
          if (!originalFolderUserIDs.includes(folderUserID)) {
            const timeNow = new Date();
            const reference = ref(db, "/notices/" + folderUserID);
            push(reference, {
              type: "recept_folderInvite_request",
              requesterUID: myUID,
              time: timeNow.getTime(),
              //여기서 부턴 "recept_folderInvite_request" type 알림만의 정보
              folderID,
            });
            SendPushNotification({
              receiverUID: folderUserID,
              title_: "피어나 뭐해요?",
              body_: "뉴진스 덕질해요",
            });
          }
        });
      });
    });
  }
};
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
  const [newFolderName, setNewFolderName] = useState(folderName_ || "");
  const [newFolderColor, setNewFolderColor] = useState(
    folderColor_ || "#EB7A7C"
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
    return () => setNewFolderUserNameIDs([]);
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
              onPress={() => setNewFolderColor("#EB7A7C")}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: "#EB7A7C",
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
                    newFolderColor == "#EB7A7C" ? "#EB7A7C" : "white",
                  alignSelf: "center",
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setNewFolderColor("#EFB4AC")}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: "#EFB4AC",
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
                    newFolderColor == "#EFB4AC" ? "#EFB4AC" : "white",
                  alignSelf: "center",
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setNewFolderColor("#9BC97E")}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: "#9BC97E",
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
                    newFolderColor == "#9BC97E" ? "#9BC97E" : "white",
                  alignSelf: "center",
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setNewFolderColor("#F3D17A")}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: "#F3D17A",
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
                    newFolderColor == "#F3D17A" ? "#F3D17A" : "white",
                  alignSelf: "center",
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setNewFolderColor("#F09F83")}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: "#F09F83",
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
                    newFolderColor == "#F09F83" ? "#F09F83" : "white",
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
              onPress={() => setNewFolderColor("#8E86C4")}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: "#8E86C4",
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
                    newFolderColor == "#8E86C4" ? "#8E86C4" : "white",
                  alignSelf: "center",
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setNewFolderColor("#B8B0DA")}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: "#B8B0DA",
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
                    newFolderColor == "#B8B0DA" ? "#B8B0DA" : "white",
                  alignSelf: "center",
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setNewFolderColor("#6DB8B8")}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: "#6DB8B8",
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
                    newFolderColor == "#6DB8B8" ? "#6DB8B8" : "white",
                  alignSelf: "center",
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setNewFolderColor("#A0D3CB")}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: "#A0D3CB",
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
                    newFolderColor == "#A0D3CB" ? "#A0D3CB" : "white",
                  alignSelf: "center",
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setNewFolderColor("#4F92D9")}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: "#4F92D9",
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
                    newFolderColor == "#4F92D9" ? "#4F92D9" : "white",
                  alignSelf: "center",
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setNewFolderColor("#82B0DB")}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: "#82B0DB",
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
                    newFolderColor == "#82B0DB" ? "#82B0DB" : "white",
                  alignSelf: "center",
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
              gotoInviteFriendScreen({
                stackNavigation,
                newFolderUserIDs,
                onChangeNewFolderUserIDs,
                folderUserIDs_,
              });
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
          await addNewFolder({
            folderID,
            folderName: newFolderName,
            folderColor: newFolderColor,
            folderUserIDs: newFolderUserIDs,
            originalFolderUserIDs: folderUserIDs_,
            IsNewRecord,
            myUID,
            myID,
            myFirstName,
            myLastName,
          }).then(() => {
            IsNewRecord
              ? gotoStorageScreen(stackNavigation)
              : gotoSingleFolderScreen({
                  stackNavigation,
                  recordDataSource,
                  folderID,
                  newFolderName,
                  newFolderColor,
                  newFolderUserIDs,
                });
          });
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
