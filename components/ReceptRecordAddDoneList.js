import { onValue, ref } from "@firebase/database";
import { useEffect, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet
} from "react-native";
import TimeDisplay from "./NoticeScreen/TimeDisplay";

const gotoEditScreen = ({ navigation, recordID }) => {
  navigation.navigate("EditScreen", {
    recordID,
  });
};
const ReceptRecordAddDoneList = ({
  performerObject,
  folderObject,
  recordID,
  navigation,
  time
}) => {
  const [performerObj, setPerformerObj] = useState(
    performerObject || { id: "", firstName: "", lastName: "" }
  );
  useEffect(() => {
    if (performerObject != undefined) {
      setPerformerObj(performerObject);
    }
  }, [performerObject]);
  const performerID = JSON.stringify(performerObj.id).slice(1, -1);
  const performerFirstName = JSON.stringify(performerObj.firstName).slice(
    1,
    -1
  );
  const performerLastName = JSON.stringify(performerObj.lastName).slice(1, -1);
  const [folderObj, setFolderObj] = useState(
    folderObject || { folderName: "", folderColor: "", folderUserIDs: [] }
  );
  useEffect(() => {
    if (folderObject != undefined) {
      setFolderObj(folderObject);
    }
  }, [folderObject]);
  const folderName = JSON.stringify(folderObj.folderName).slice(1, -1);
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
        <Text style={{ fontWeight: "700" }}>폴더[{folderName}]</Text>에 기록을
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
