import { onValue, ref } from "@firebase/database";
import { database } from "../firebase";
import { useEffect, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
const gotoSingleFolderScreen = ({
  navigation,
  folderID,
  myUID,
  recordDataSource,
  setRecordDataSource,
  folderName,
  folderColor,
  folderUserIDs,
}) => {
  const db = database;
  onValue(ref(db, "/folders/" + folderID), (snapshot) => {
    //폴더 삭제 시 삭제된 폴더가 display되는 오류 방지를 위한 체크용 코드
    if (
      snapshot.child("userIDs").val() &&
      myUID in snapshot.child("userIDs").val()
    ) {
      if (snapshot.child("placeRecords").val() != (null || undefined)) {
        //폴더는 있지만 빈폴더라서 record가 안에 없을 수 있어!!
        //recordIDList_.push(...Object.keys(snapshot2.child('placeRecords').val()))  //해당 user가 소속된 각 폴더에 들어있는 recordIDList들을 합쳐서 하나로 만들어주기(버림)
        Object.values(snapshot.child("placeRecords").val()).map(
          (recordIDObject) => {
            //folders의 placeRecord 속에 있는 각 placeID에 대응되는 recordIDObject들에 대하여....
            Object.keys(recordIDObject).map((recordID) => {
              //각 recordObject에 있는 recordID에 대하여
              onValue(ref(db, "/records/" + recordID), (snapshot2) => {
                if (snapshot2.val() != (null || undefined)) {
                  //masterDataSource 채워주기 --> 기존 record를 지웠을 때, 없는 recordID를 찾아서 null이 masterDataSource에 들어가는 경우를 방지하고자 함
                  setRecordDataSource((prev) => ({
                    ...prev,
                    [recordID]: {
                      recordID,
                      recordData: snapshot2.val(),
                    },
                  })); //{recordID: recordID, recordData:{title: ~~, date: ~~, lctn: ~~, text: ~~, placeName: ~~}}가 쌓여있음
                }
              });
            });
          }
        );
      }
    }
  });

  navigation.navigate("SingleFolderScreen", {
    recordDataSource,
    folderID,
    folderName,
    folderColor,
    folderUserIDs,
  });
};
const DispatchFolderInviteRequestList = ({
  approverObject,
  folderObject,
  folderID,
  navigation,
  myUID,
}) => {
  const [approverObj, setApproverObj] = useState(
    approverObject || { id: "", firstName: "", lastName: "" }
  );
  useEffect(() => {
    if (approverObject != undefined) {
      setApproverObj(approverObject);
    }
  }, [approverObject]);
  const approverID = JSON.stringify(approverObj.id).slice(1, -1);
  const approverFirstName = JSON.stringify(approverObj.firstName).slice(1, -1);
  const approverLastName = JSON.stringify(approverObj.lastName).slice(1, -1);
  const [folderObj, setFolderObj] = useState(
    folderObject || { folderName: "", folderColor: "", folderUserIDs: [] }
  );
  useEffect(() => {
    if (folderObject != undefined) {
      setFolderObj(folderObject);
    }
  }, [folderObject]);
  const folderName = JSON.stringify(folderObj.folderName).slice(1, -1);
  const folderColor = JSON.stringify(folderObj.folderColor).slice(1, -1);
  const folderUserIDs = folderObj.folderUserIDs;
  const [recordDataSource, setRecordDataSource] = useState({});
  if (folderObj == { folderName: "", folderColor: "", folderUserIDs: [] }) {
    return <></>;
  } else {
    return (
      <TouchableOpacity
        onPress={() => {
          gotoSingleFolderScreen({
            navigation,
            folderID,
            myUID,
            recordDataSource,
            setRecordDataSource,
            folderName,
            folderColor,
            folderUserIDs,
          });
        }}
        style={{ flex: 1, alignItems: "center", marginBottom: 40 }}
      >
        <View
          style={{
            width: 344,
            height: 24,
            borderRadius: 16,
            flexDirection: "row",
          }}
        >
          <Text
            style={{
              left: 16,
              top: 5,
              fontWeight: "400",
              fontSize: 14,
              lineHeight: 16,
              letterSpacing: -0.5,
            }}
          >
            <Text style={{ fontWeight: "700" }}>
              {approverLastName}
              {approverFirstName}(@{approverID})
            </Text>
            님이
            <Text style={{ fontWeight: "700" }}> {folderName} </Text>
            초대를 수락했습니다.
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
};

export default DispatchFolderInviteRequestList;
