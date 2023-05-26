import { onValue, ref } from "@firebase/database";
import { useContext, useEffect, useState } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";

import { database } from "../firebase";
import { useFolderQuery, useUserQuery } from "../queries";
import AppContext from "./AppContext";
import TimeDisplay from "./NoticeScreen/TimeDisplay";
const db = database;

const gotoSingleFolderScreen = ({ navigation, folderID }) => {
  navigation.navigate("SingleFolderScreen", {
    folderID,
  });
};
const ReceptFolderInviteRequestList = ({
  requesterUID,
  folderID,
  navigation,
  time,
}) => {
  const myContext = useContext(AppContext);
  const myUID = myContext.myUID;

  const myUserQuery = useUserQuery(myUID);

  const userQuery = useUserQuery(requesterUID);
  const requesterID = userQuery.data?.id;
  const requesterFirstName = userQuery.data?.firstName;
  const requesterLastName = userQuery.data?.lastName;

  const folderQuery = useFolderQuery(folderID);
  const folderName = folderQuery.data?.folderName[myUID];

  if (!userQuery.data || !folderQuery.data) {
    return <></>;
  } else if (!myUserQuery.data.folderIDs[folderID]) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          <Text style={{ fontFamily: "NotoSansKR-Bold", fontWeight: "700" }}>
            {requesterLastName}
            {requesterFirstName}(@{requesterID})
          </Text>
          님의
          <Text style={{ fontFamily: "NotoSansKR-Bold", fontWeight: "700" }}>
            {" "}
            {folderName}{" "}
          </Text>
          초대를 수락했습니다. {"  "}
          <Text style={styles.time}>
            <TimeDisplay time={time} />
          </Text>
        </Text>
      </View>
    );
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
        <Text style={styles.text}>
          <Text style={{ fontWeight: "700" }}>
            {requesterLastName}
            {requesterFirstName}(@{requesterID})
          </Text>
          님의
          <Text style={{ fontWeight: "700" }}> {folderName} </Text>
          초대를 수락했습니다.
        </Text>
        <Text style={styles.time}>
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
    fontFamily: "NotoSansKR-Regular",
  },
  time: {
    lineHeight: 16,
    letterSpacing: -0.5,
    fontFamily: "NotoSansKR-Bold",
    fontSize: 12,
    color: "#545766",
    left: 20,
    bottom: 0,
    height: 16,
    position: "absolute",
    fontWeight: "700",
  },
});
