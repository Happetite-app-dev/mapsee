import { getDatabase, ref, onValue, set, push } from "firebase/database";
import React, { useEffect, useRef, useState, useContext } from "react";
import { View } from "react-native";

import AppContext from "../components/AppContext";
import SendPushNotification from "../modules/SendPushNotification";
import DefaultFolderBottomSheet from "./defaultFolderBottomSheet";

const db = getDatabase();
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
  setFolderIDNameList((prev) => ({
    ...prev,
    [newFolderID]: { folderID: newFolderID, folderName },
  }));
  setFolderID(newFolderID);
  setFolderName(folderName);
};
const AddFolderBottomSheet = ({
  stackNavigation,
  setFolderName,
  setFolderID,
  setFolderIDNameList,
  setShow,
}) => {
  const myContext = useContext(AppContext);
  const myUID = myContext.myUID;
  const myID = myContext.myID;
  const myFirstName = myContext.myFirstName;
  const myLastName = myContext.myLastName;

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
  };

  return (
    <View style={{ width: "100%", height: "100%" }}>
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
