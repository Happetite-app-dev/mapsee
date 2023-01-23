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
import GoBackHeader from "../components/GoBackHeader";
import RecordFlatList from "../components/RecordFlatList";

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
    <View style={{ height: "100%", width: "100%", backgroundColor: "white" }}>
      <GoBackHeader
        navigation={navigation}
        text={folderName}
        folderColor={folderColor}
        isShareFolder={folderUserIDs.length >= 2}
        rightButton="edit"
        rightButtonFunction={() =>
          gotoMakeFolderBottomSheetScreen({
            navigation,
            folderID,
            folderName,
            folderColor,
            folderUserIDs,
            recordDataSource,
          })
        }
        rightButtonFunction2={() =>
          exitFolderPopUp({ myUID, folderID, navigation })
        }
      />
      <RecordFlatList
        recordDataSource={recordDataSource}
        stackNavigation={navigation}
      />
    </View>
  );
};

export default SingleFolderScreen;
