import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  remove,
  off,
} from "firebase/database";
import { useContext, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";

import AppContext from "../components/AppContext";
import RecordFlatList from "../components/RecordFlatList";

const editImage = require("../assets/image/edit.png");
const folder2Image = require("../assets/image/folder2.png");
const goBackImage = require("../assets/image/goBack.png");
const trashcanImage = require("../assets/image/trashcan.png");
const gotoStorageScreen = (navigation) => {
  navigation.pop();
};
const gotoMakeFolderBottomSheetScreen = ({
  navigation,
  folderID,
  folderName,
  folderColor,
  folderUserIDs,
  recordDataSource,
}) => {
  navigation.navigate("MakeFolderBottomSheetScreen", {
    folderID,
    folderName,
    folderColor,
    folderUserIDs,
    recordDataSource,
  });
};
const exitFolderPopUp = ({ myUID, folderID, navigation }) => {
  return Alert.alert(
    "정말 삭제하시겠습니까?",
    "",
    [
      { text: "취소" },
      {
        text: "삭제",
        onPress: () => exitFolder({ myUID, folderID, navigation }),
        style: "default",
      },
    ],
    {
      cancelable: false,
    }
  );
};
const exitFolder = async ({ myUID, folderID, navigation }) => {
  await exitData(myUID, folderID).then(
    () => navigation.navigate("Storage") //realtimeDataBase가 모두 업데이트 된후
  );
};
const exitData = async (myUID, folderID) => {
  const db = getDatabase();
  const reference1 = ref(db, "/users/" + myUID + "/folderIDs/" + folderID);
  await remove(reference1)
    .then(() => {
      const reference2 = ref(db, "/folders/" + folderID + "/userIDs/" + myUID);
      remove(reference2);
    })
    .then(() => {
      const reference3 = ref(
        db,
        "/folders/" + folderID + "/folderName/" + myUID
      );
      remove(reference3);
    })
    .then(() => {
      const reference4 = ref(
        db,
        "/folders/" + folderID + "/folderColor/" + myUID
      );
      remove(reference4);
    })
    .then(
      //지울 필요가 없음
      onValue(ref(db, "/folders/" + folderID + "/userIDs"), (snapshot) => {
        if (!snapshot.hasChildren()) {
          const reference3 = ref(db, "/folders/" + folderID);
          remove(reference3);
        }
      })
    );
};

const SingleFolderScreen = ({ navigation, route }) => {
  const myContext = useContext(AppContext);
  const myUID = myContext.myUID;

  const { recordDataSource, folderID, folderName, folderColor, folderUserIDs } =
    route.params;

  return (
    <SafeAreaView style={{ height: "100%", width: "100%" }}>
      <View
        style={{
          flexDirection: "row",
          height: 40,
          marginBottom: 20,
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={{
            position: "absolute",
            left: 29,
            width: 20,
            height: 30,
            justifyContent: "center",
          }}
          onPress={gotoStorageScreen}
        >
          <Image source={goBackImage} />
        </TouchableOpacity>
        <View style={{ position: "absolute", left: 65 }}>
          <Image source={folder2Image} style={{ tintColor: folderColor }} />
        </View>
        <Text
          style={{
            position: "absolute",
            fontWeight: "bold",
            fontSize: 16,
            left: 95,
          }}
        >
          {folderName}
        </Text>
        <TouchableOpacity
          style={{ position: "absolute", right: 64 }}
          onPress={() =>
            gotoMakeFolderBottomSheetScreen({
              navigation,
              folderID,
              folderName,
              folderColor,
              folderUserIDs,
              recordDataSource,
            })
          }
        >
          <Image source={editImage} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            position: "absolute",
            right: 26,
          }}
          onPress={() => exitFolderPopUp({ myUID, folderID, navigation })}
        >
          <Image source={trashcanImage} />
        </TouchableOpacity>
      </View>
      <RecordFlatList
        recordDataSource={recordDataSource}
        stackNavigation={navigation}
      />
    </SafeAreaView>
  );
};

export default SingleFolderScreen;
