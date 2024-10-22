import { ref, onValue, set, push } from "firebase/database";
import { database } from "../../firebase";
import React, { useEffect, useRef, useState, useContext } from "react";
import { View, Alert } from "react-native";
import { useQueryClient } from "react-query";
import AppContext from "../AppContext";
import SendPushNotification from "../../modules/SendPushNotification";
import DefaultFolderBottomSheet from "./defaultFolderBottomSheet";

const db = database;

const addNewFolder = ({
  myUID,
  myID,
  myFirstName,
  myLastName,
  setFolderIDNameList,
  setFolderID,
  setFolderName,
  folderName,
  folderColor,
  folderUserIDs,
  queryClient,
  setFolderColor,
}) => {
  //친구초대한 사람한테 push알림 보내는 함수
  const reference1 = ref(db, "/folders"); //folders에 push
  const newFolderID = push(reference1, {
    initFolderName: folderName,
    initFolderColor: folderColor,
  }).key;
  folderUserIDs.map((folderUserID) => {
    if (folderUserID == myUID) {
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
      // 친구에게 초대할 때. 여기서 folder/userIDS/에 초대한 사람의 uid를 넣어주고, FALSE로 해두기!
      const reference3 = ref(
        db,
        `/folders/${newFolderID}/userIDs/${folderUserID}`
      ); //folders/newfolderID/userIDs에 userID:true를 넣기
      set(reference3, false);
      const reference4 = ref(
        db,
        `users/${folderUserID}/folderIDs/${newFolderID}`
      ); //user에 folderID를 넣고
      set(reference4, false);
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
        title_: "mapsee 맵시",
        body_: `${
          myLastName + myFirstName
        }(@${myID})님이 폴더[${folderName}]에 초대했습니다.`, // 닉네임(@아이디)님이 폴더[폴더이름]에 초대했습니다.
      });
    }
  });
  setFolderIDNameList((prev) => ({
    ...prev,
    [newFolderID]: {
      folderID: newFolderID,
      folderName,
      folderColor,
    },
  }));
  setFolderID(newFolderID);
  setFolderName(folderName);
  setFolderColor(folderColor);
  // invalidate queries
  queryClient.invalidateQueries(["folders"]);
};
const AddFolderBottomSheet = ({
  stackNavigation,
  setFolderName,
  setFolderID,
  setFolderIDNameList,
  setShow,
  setFolderColor,
  setIsSelectingFolder,
}) => {
  const myContext = useContext(AppContext);
  const myUID = myContext.myUID;
  const myID = myContext.myID;
  const myFirstName = myContext.myFirstName;
  const myLastName = myContext.myLastName;
  const queryClient = useQueryClient();

  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderColor, setNewFolderColor] = useState("#EB7A7C");
  const [newFolderUserIDs, setNewFolderUserIDs] = useState([myUID]);
  const [newFolderUserNameIDs, setNewFolderUserNameIDs] = useState([]);
  const onChangeNewFolderUserIDs = (newFolderUserIDs_) => {
    setNewFolderUserIDs(newFolderUserIDs_);
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
  }, [newFolderUserIDs]);
  const onPressFunction = () => {
    if (newFolderName.length > 5)
      Alert.alert("알림", "폴더 이름은 5자 이내여야 합니다.");
    else
      addNewFolder({
        myUID,
        myID,
        myFirstName,
        myLastName,
        setFolderIDNameList,
        setFolderID,
        setFolderName,
        folderName: newFolderName,
        folderColor: newFolderColor,
        folderUserIDs: newFolderUserIDs,
        queryClient: queryClient,
        setFolderColor: setFolderColor,
      });
    setShow(true);
    setIsSelectingFolder(true);
  };

  return (
    <View
      style={{
        width: "100%",
        height: 728,
        alignItems: "center",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        borderWidth: 1,
        borderColor: "#DDDFE9",
        bottom: -58,
        backgroundColor: "white",
      }}
    >
      <DefaultFolderBottomSheet
        IsNewRecord
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

export default AddFolderBottomSheet;

/*onpress*() => {
          addNewFolder({
            myUID,
            myID,
            myFirstName,
            myLastName,
            setFolderIDNameList,
            setFolderID,
            setFolderName,
            folderName: newFolderName,
            folderColor: newFolderColor,
            folderUserIDs: newFolderUserIDs,
          });
          setShow(false);
        } */
