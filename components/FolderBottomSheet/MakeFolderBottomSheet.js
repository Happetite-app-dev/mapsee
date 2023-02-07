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
} from "react-native";
import { ScrollView, Switch, TextInput } from "react-native-gesture-handler";
import { useQueryClient } from "react-query";
import AppContext from "../AppContext";
import SendPushNotification from "../../modules/SendPushNotification";
import { useUserQuery, useAllFolderQuery } from "../../queries";

import DefaultFolderBottomSheet from "./defaultFolderBottomSheet";
import { database } from "../../firebase";
const db = database;

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
const addNewFolder = async ({
  folderID,
  folderName,
  folderColor,
  folderUserIDs,
  originalFolderUserIDs,
  IsNewRecord,
  myUID,
  allFolderQuery,
  queryClient,
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
          title_: "새폴더초대타이틀",
          body_: "새폴더초대바디",
        });
      }
    });
    queryClient.invalidateQueries(["all-folders"]);
  } else {
    //새 폴더가 아니라면 개인화폴더이름, 폴더색상만 데이터베이스상에서 수정
    const folder = allFolderQuery.data[folderID];
    const reference1 = ref(db, `/folders/${folderID}/folderName/${myUID}`); //folderName 개인화
    set(reference1, folderName);
    const reference2 = ref(db, `/folders/${folderID}/folderColor/${myUID}`); //folderColor 개인화
    set(reference2, folderColor);

    const referenceDate = ref(db, `/folders/${folderID}/updateDate`);
    const now = new Date();
    set(referenceDate, now.toString());
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
    queryClient.invalidateQueries(["all-folders"]);
    queryClient.invalidateQueries(["folders", folderID]);
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
  const queryClient = useQueryClient();

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

  const allFolderQuery = useAllFolderQuery();

  //폴더에 속한 친구이름 목록을 바텀쉬트에 띄우는 함수
  const onPressFunction = async () => {
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
      allFolderQuery,
      queryClient,
    }).then(() => {
      queryClient.invalidateQueries(["users", myUID]);

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
