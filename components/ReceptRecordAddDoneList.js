import { onValue, ref } from "@firebase/database";
import { useContext, useEffect, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Image
} from "react-native";
import { useFolderQuery, useRecordQuery, useUserQuery } from "../queries";
import AppContext from "./AppContext";
import TimeDisplay from "./NoticeScreen/TimeDisplay";
import DefaultImage from "../assets/image/default.svg"


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
  time,
}) => {
  const myContext = useContext(AppContext);
  const myUID = myContext.myUID;

  const myUserQuery = useUserQuery(myUID);

  const userQuery = useUserQuery(performerUID);
  const performerID = userQuery.data?.id;
  const performerFirstName = userQuery.data?.firstName;
  const performerLastName = userQuery.data?.lastName;

  const folderQuery = useFolderQuery(folderID);
  const folderName = folderQuery.data?.folderName[myUID];

  const { data } = useRecordQuery(recordID);

  const selectedPhotos =
    data?.photos !== undefined && data?.photos !== null
      ? Object.values(data?.photos)
      : []
  console.log(selectedPhotos[0])
  if (!userQuery.data || !folderQuery.data || !myUserQuery.data) {
    return <></>;
  } else if (
    !myUserQuery.data.folderIDs[folderID] ||
    !Object.values(
      folderQuery.data.placeRecords ? folderQuery.data.placeRecords : []
    ).some((item) => item[recordID])
  ) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          <Text style={{ fontFamily: "NotoSansKR-Bold" }}>
            {performerLastName}
            {performerFirstName}(@{performerID})
          </Text>
          님이
          <Text style={{ fontFamily: "NotoSansKR-Bold" }}>
            {" "}
            폴더[{folderName}]
          </Text>
          에 기록을 남겼습니다.
        </Text>
        <Text
          style={{
            ...styles.text,
            fontSize: 12,
            color: "#545766",
            fontFamily: "NotoSansKR-Bold",
          }}
        >
          <TimeDisplay time={time} />
        </Text>
      </View>

    )
  } else if (selectedPhotos[0] == undefined) {
    return (
      <TouchableOpacity
        onPress={() => {
          gotoEditScreen({ navigation, recordID });
        }}
        style={styles.container}
      >
        <View
          style={{ flexDirection: "column", width: 276 }}
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
        </View>
        <View>
          <View style={{ borderRadius: 28, borderWidth: 1, width: 56, height: 56, borderColor: "#DDDFE9", alignItems: "center", justifyContent: "center" }}>
            <View style={{ borderRadius: 24, width: 48, height: 48, backgroundColor: "#DDDFE9", alignItems: "center", justifyContent: "center" }}>
              <DefaultImage />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  } else {
    return (
      <TouchableOpacity
        onPress={() => {
          gotoEditScreen({ navigation, recordID });
        }}
        style={styles.container}
      >
        <View
          style={{ flexDirection: "column", width: 276 }}
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
        </View>
        <View>
          <View style={{ borderRadius: 28, borderWidth: 1, width: 56, height: 56, borderColor: "#DDDFE9", alignItems: "center", justifyContent: "center" }}>
            <Image style={{ width: 48, height: 48, borderRadius: 24 }} source={{ uri: selectedPhotos[0] }} />
          </View>
        </View>
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
    alignSelf: "flex-start",
    lineHeight: 16,
    letterSpacing: -0.5,
    fontFamily: "NotoSansKR-Regular",
  },
});
