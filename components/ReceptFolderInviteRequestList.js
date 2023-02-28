import { onValue, ref } from "@firebase/database";
import { useEffect, useState } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";

import { database } from "../firebase";
import TimeDisplay from "./NoticeScreen/TimeDisplay";
const db = database;

const gotoSingleFolderScreen = ({
  navigation,
  folderID,
}) => {
  navigation.navigate("SingleFolderScreen", {
    folderID
  });
};
const ReceptFolderInviteRequestList = ({
  requesterObject,
  folderObject,
  folderID,
  navigation,
  myUID,
  time
}) => {
  const [requesterObj, setRequesterObj] = useState(
    requesterObject || { id: "", firstName: "", lastName: "" }
  );
  useEffect(() => {
    if (requesterObject != undefined) {
      setRequesterObj(requesterObject);
    }
  }, [requesterObject]);
  const requesterID = JSON.stringify(requesterObj.id).slice(1, -1);
  const requesterFirstName = JSON.stringify(requesterObj.firstName).slice(
    1,
    -1
  );
  const requesterLastName = JSON.stringify(requesterObj.lastName).slice(1, -1);
  const [folderObj, setFolderObj] = useState(
    folderObject || { folderName: "", folderColor: "", folderUserIDs: [] }
  );
  useEffect(() => {
    if (folderObject != undefined) {
      setFolderObj(folderObject);
    }
  }, [folderObject]);
  const folderName = JSON.stringify(folderObj.folderName).slice(1, -1);
  if (folderObj == { folderName: "", folderColor: "", folderUserIDs: [] }) {
    return <></>;
  } else {
    return (
      <TouchableOpacity
        onPress={() => {
          gotoSingleFolderScreen({
            navigation,
            folderID,
          });
        }}
        style={styles.container}
      >
        <Text
          style={styles.text}
        >
          <Text style={{ fontWeight: "700" }}>
            {requesterLastName}
            {requesterFirstName}(@{requesterID})
          </Text>
          님의
          <Text style={{ fontWeight: "700" }}> {folderName} </Text>
          초대를 수락했습니다.
        </Text>
        <Text
          style={{
            ...styles.text,
            fontWeight: "700",
            fontSize: 12,
            color: "#545766",
          }}
        >
          <TimeDisplay time={time} />
        </Text>
      </TouchableOpacity>
    );
  }
};

export default ReceptFolderInviteRequestList;

const styles = StyleSheet.create({
  container: {
    width: 344,
    alignSelf: "center",
    flexDirection: "row",
    marginBottom: 40,
  },
  text: {
    alignSelf: "center",
    lineHeight: 16,
    letterSpacing: -0.5,
  },
});
