import { onValue, ref } from "@firebase/database";
import { useContext, useEffect, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet
} from "react-native";
import { useFolderQuery, useUserQuery } from "../queries";
import AppContext from "./AppContext";
import TimeDisplay from "./NoticeScreen/TimeDisplay";

const gotoEditScreen = ({ navigation, recordID }) => {
  navigation.navigate("EditScreen", {
    recordID,
  });
};
const ReceptRecordAddDoneList = ({
  performerUID,
  folderID,
  recordID,
  navigation,
  time
}) => {
  const myContext = useContext(AppContext);
  const myUID = myContext.myUID;

  const userQuery = useUserQuery(performerUID);
  const performerID = userQuery.data?.id
  const performerFirstName = userQuery.data?.firstName
  const performerLastName = userQuery.data?.lastName

  const folderQuery = useFolderQuery(folderID);
  const folderName = folderQuery.data?.folderName[myUID]

  if (!userQuery.data || !folderQuery.data) {
    return <></>;
  } else {
    return (
      <TouchableOpacity
        onPress={() => {
          gotoEditScreen({ navigation, recordID });
        }}
        style={styles.container}
      >
        <Text
          style={styles.text}
        >
          <Text style={{ fontWeight: "700" }}>
            {performerLastName}
            {performerFirstName}(@{performerID})
          </Text>
          님이
          <Text style={{ fontWeight: "700" }}> 폴더[{folderName}]</Text>에 기록을
          남겼습니다.
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

export default ReceptRecordAddDoneList;

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
