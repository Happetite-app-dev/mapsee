import { useContext, useEffect, useState } from "react";
import { Pressable, SafeAreaView, Text, View, StyleSheet } from "react-native";
import { useFolderQuery, useUserQuery } from "../queries";
import AppContext from "./AppContext";
import TimeDisplay from "./NoticeScreen/TimeDisplay";

//오로지 display만을 위한 함수
const FolderInviteRequestCard = ({
  requesterUID,
  time,
  folderID,
  acceptRequest,
  denyRequest,
}) => {
  const myContext = useContext(AppContext);
  const myUID = myContext.myUID;

  const userQuery = useUserQuery(requesterUID);
  const requesterID = userQuery.data?.id
  const requesterFirstName = userQuery.data?.firstName
  const requesterLastName = userQuery.data?.lastName

  const folderQuery = useFolderQuery(folderID);
  const folderName = folderQuery.data?.folderName[myUID] ?
    folderQuery.data?.folderName[myUID]
    : folderQuery.data?.initFolderName;

  if (folderName == (null || undefined)) {
    return <></>;
  } else {
    return (
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={{ ...styles.text, fontSize: 14, fontWeight: "400" }}>
            <Text style={{ fontWeight: "700" }}>
              {requesterLastName}
              {requesterFirstName}(@{requesterID})
            </Text>
            님이
            <Text style={{ fontWeight: "700" }}> {folderName}</Text>에
            회원님을 초대했습니다.
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
        </View>
        <View style={styles.buttonContainer}>
          <Pressable
            onPress={denyRequest}
            style={{ ...styles.button, right: 22 }}
          >
            <Text style={styles.buttonText}>
              거절
            </Text>
          </Pressable>
          <View style={styles.buttonBorder} />
          <Pressable
            onPress={acceptRequest}
            style={{ ...styles.button, left: 22 }}
          >
            <Text style={styles.buttonText}>
              수락
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }
};

export default FolderInviteRequestCard;

const styles = StyleSheet.create({
  container: {
    width: 344,
    height: 112,
    borderRadius: 16,
    backgroundColor: "#F4F5F9",
    marginBottom: 40,
    alignSelf: "center"
  },
  textContainer: {
    top: 16,
    height: 24,
    marginHorizontal: 16,
    flexDirection: "row",
  },
  text: {
    alignSelf: "center",
    lineHeight: 16,
    letterSpacing: -0.5,
  },
  buttonContainer: {
    top: 36,
    height: 40,
    marginHorizontal: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 128,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontWeight: "700",
    fontSize: 14,
    letterSpacing: 1.2
  },
  buttonBorder: {
    height: 16,
    width: 0,
    borderColor: "#DDDFE9",
    borderWidth: 1,
  },
});