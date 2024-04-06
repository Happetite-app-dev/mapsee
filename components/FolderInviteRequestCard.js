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
  const requesterID = userQuery.data?.id;
  const requesterFirstName = userQuery.data?.firstName;
  const requesterLastName = userQuery.data?.lastName;

  const folderQuery = useFolderQuery(folderID);
  // const folderName = folderQuery.data?.folderName[myUID] ?
  //   folderQuery.data?.folderName[myUID]
  //   : folderQuery.data?.initFolderName;
  const folderName = folderQuery.data?.initFolderName;

  if (!userQuery.data || !folderQuery.data) {
    return <></>;
  } else {
    return (
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={{ ...styles.text, fontSize: 14, fontWeight: "400" }}>
            <Text style={{ fontFamily: "NotoSansKR-Bold", fontWeight: "700" }}>
              {requesterLastName}
              {requesterFirstName}(@{requesterID})
            </Text>
            님이
            <Text style={{ fontFamily: "NotoSansKR-Bold", fontWeight: "700" }}>
              {" "}
              {folderName}
            </Text>
            에 회원님을 초대했습니다. {"  "}
            <Text style={styles.time}>
              <TimeDisplay time={time} />
            </Text>
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <Pressable
            onPress={denyRequest}
            style={{ ...styles.button, right: 22 }}
          >
            <Text style={styles.buttonText}>거절</Text>
          </Pressable>
          <View style={styles.buttonBorder} />
          <Pressable
            onPress={() => {
              acceptRequest();
            }}
            style={{ ...styles.button, left: 22 }}
          >
            <Text style={styles.buttonText}>수락</Text>
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
    borderRadius: 16,
    backgroundColor: "#F4F5F9",
    alignSelf: "center",
    flex: 1,
    marginBottom: 40,
  },
  textContainer: {
    top: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "flex-start", // 컨테이너 상단에 정렬
    width: 312,
    marginHorizontal: 16,
  },
  text: {
    alignSelf: "center",
    lineHeight: 20,
    letterSpacing: -0.5,
    fontFamily: "NotoSansKR-Regular",
  },
  time: {
    lineHeight: 16,
    letterSpacing: -0.5,
    fontFamily: "NotoSansKR-Bold",
    fontSize: 12,
    color: "#545766",
    left: 5,
    bottom: 0,
    height: 16,
    position: "absolute",
    fontWeight: "700",
  },
  buttonContainer: {
    height: 24,
    marginTop: 16,
    marginBottom: 16,
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
    fontFamily: "NotoSansKR-Bold",
    fontSize: 14,
    letterSpacing: 1.2,
  },
  buttonBorder: {
    height: 16,
    width: 0,
    borderColor: "#DDDFE9",
    borderWidth: 1,
  },
});
