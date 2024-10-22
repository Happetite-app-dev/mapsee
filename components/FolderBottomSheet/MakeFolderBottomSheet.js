import { ref, onValue, set, push } from "firebase/database";
import React, { useEffect, useRef, useState, useContext } from "react";
import {
  Animated,
  Text,
  View,
  TouchableOpacity,
  Button,
  SafeAreaView,
  FlatList,
  Alert,
} from "react-native";
import { ScrollView, Switch, TextInput } from "react-native-gesture-handler";
import { useQueryClient } from "react-query";
import AppContext from "../AppContext";
import SendPushNotification from "../../modules/SendPushNotification";

import { useUserQuery, useFolderQuery } from "../../queries";

import DefaultFolderBottomSheet from "./defaultFolderBottomSheet";
import { database } from "../../firebase";
const db = database;

const addNewFolder = async ({
  folderID,
  folderName,
  folderColor,
  folderUserIDs,
  originalFolderUserIDs,
  IsNewRecord,
  myUID,
  queryClient,
  myLastName,
  myFirstName,
  myID,
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

        const referenceDate = ref(db, `/folders/${newFolderID}/updateDate`);
        const now = new Date();
        set(referenceDate, now.toString());
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
          title_: "mapsee 맵시", //새 폴더 초대 알림
          body_: `${
            myLastName + myFirstName
          }(@${myID})님이 폴더[${folderName}]에 초대했습니다.`, // ~~님이 ~~폴더에 초대하였습니다.
        });
      }
    });
    queryClient.invalidateQueries(["folders"]);
  } else {
    //새 폴더가 아니라면 개인화폴더이름, 폴더색상만 데이터베이스상에서 수정
    const reference1 = ref(db, `/folders/${folderID}/folderName/${myUID}`); //folderName 개인화
    set(reference1, folderName);
    const reference2 = ref(db, `/folders/${folderID}/folderColor/${myUID}`); //folderColor 개인화
    set(reference2, folderColor);

    const referenceDate = ref(db, `/folders/${folderID}/updateDate`);
    const now = new Date();
    set(referenceDate, now.toString());
    //공통폴더이름, 색상 가져오기\
    folderUserIDs.map((folderUserID) => {
      //새로 추가된 친구에 대해 공통폴더이름, 색상 부여 필요
      //folderName 공통폴더이름 부여
      if (!originalFolderUserIDs.includes(folderUserID)) {
        // 친구에게 초대할 때. 여기서 folder/userIDS/에 초대한 사람의 uid를 넣어주고, FALSE로 해두기! user/folderIDS/에 ㄴ
        const reference3 = ref(
          db,
          `/folders/${folderID}/userIDs/${folderUserID}`
        ); //folders/newfolderID/userIDs에 userID:true를 넣기
        set(reference3, false);
        const reference4 = ref(
          db,
          `users/${folderUserID}/folderIDs/${folderID}`
        ); //user에 folderID를 넣고
        set(reference4, false);
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
          title_: "mapsee 맵시",
          body_: `${
            myLastName + myFirstName
          }(@${myID})님이 폴더[${folderName}]에 초대했습니다.`,
        });
      }
    });
    queryClient.invalidateQueries(["folders", folderID]);
  }
};

const MakeFolderBottomSheet = ({ stackNavigation, folderID }) => {
  const myContext = useContext(AppContext);
  const myUID = myContext.myUID;
  const queryClient = useQueryClient();
  const query = useFolderQuery(folderID);
  const folderName_ =
    query.data?.folderName !== undefined
      ? query.data?.folderName[myUID]
      : undefined;
  const folderColor_ =
    query.data?.folderColor !== undefined
      ? query.data?.folderColor[myUID]
      : undefined;
  const folderUserIDs_ =
    query.data?.userIDs !== undefined ? Object.keys(query.data?.userIDs) : null;
  const myID = myContext.myID;
  const myFirstName = myContext.myFirstName;
  const myLastName = myContext.myLastName;
  const IsNewRecord = folderID === null;
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
  const onPressFunction = async () => {
    console.log("newFolderName.length", newFolderName.length);
    if (newFolderName.length > 5)
      Alert.alert("알림", "폴더 이름은 5자 이하로 해주세요.");
    else {
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
        queryClient,
      }).then(() => {
        queryClient.invalidateQueries(["users", myUID]);
        stackNavigation.goBack();
      });
    }
  };

  useEffect(() => {
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
      <DefaultFolderBottomSheet
        IsNewRecord={IsNewRecord}
        newFolderName={newFolderName}
        setNewFolderName={(name) => {
          setNewFolderName(name);
        }}
        newFolderColor={newFolderColor}
        setNewFolderColor={(color) => setNewFolderColor(() => color)}
        onPressFunction={onPressFunction}
        stackNavigation={stackNavigation}
        newFolderUserIDs={newFolderUserIDs}
        onChangeNewFolderUserIDs={onChangeNewFolderUserIDs}
        newFolderUserNameIDs={newFolderUserNameIDs}
        folderUserIDs={undefined}
      />
    </View>
  );
};

export default MakeFolderBottomSheet;
