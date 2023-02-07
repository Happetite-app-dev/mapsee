import { onValue, ref } from "@firebase/database";
import { useEffect, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
            {performerLastName}
            {performerFirstName}(@{performerID})
          </Text>
          님이
          <Text style={{ fontWeight: "700" }}>폴더[{folderName}]</Text>에 기록을
          남겼습니다.
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ReceptRecordAddDoneList;
