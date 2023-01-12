import { getDatabase, onValue, ref } from "@firebase/database";
import {
  Pressable,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const gotoEditScreen = ({ navigation, recordID }) => {
  const db = getDatabase();
  let recordData;
  onValue(ref(db, `/records/${recordID}`), (snapshot) => {
    recordData = snapshot.val();
  });
  navigation.navigate("EditScreen", {
    recordID,
    ...recordData,
  });
};
const ReceptRecordAddDoneList = ({
  performerID,
  performerFirstName,
  performerLastName,
  folderName,
  recordID,
  navigation,
}) => {
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
