import { onValue, ref } from "@firebase/database";
import { database } from "../firebase";
import { useContext, useEffect, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet
} from "react-native";
import TimeDisplay from "./NoticeScreen/TimeDisplay";
import { useFolderQuery, useUserQuery } from "../queries";
import AppContext from "./AppContext";
const gotoSingleFolderScreen = ({
  navigation,
  folderID,
}) => {
  navigation.navigate("SingleFolderScreen", {
    folderID
  });
};
const DispatchFolderInviteRequestList = ({
  approverUID,
  folderID,
  navigation,
  time
}) => {
  const myContext = useContext(AppContext);
  const myUID = myContext.myUID;

  const userQuery = useUserQuery(approverUID);
  const approverID = userQuery.data?.id
  const approverFirstName = userQuery.data?.firstName
  const approverLastName = userQuery.data?.lastName

  const folderQuery = useFolderQuery(folderID);
  const folderName = folderQuery.data?.folderName[myUID]
  if (!userQuery.data || !folderQuery.data) {
    return <></>;
  } else {
    return (
      <TouchableOpacity
        onPress={() => {
          gotoSingleFolderScreen({
            navigation,
            folderID
          });
        }}
        style={styles.container}
      >
        <Text
          style={styles.text}
        >
          <Text style={{ fontWeight: "700" }}>
            {approverLastName}
            {approverFirstName}(@{approverID})
          </Text>
          님이
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

export default DispatchFolderInviteRequestList;

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

