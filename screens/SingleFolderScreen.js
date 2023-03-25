import { ref, onValue, remove } from "firebase/database";
import { useContext, useState } from "react";
import { View } from "react-native";

import AppContext from "../components/AppContext";
import GoBackHeader from "../components/GoBackHeader";
import { PopUpType1 } from "../components/PopUp";
import RecordFlatList from "../components/StorageScreen/RecordFlatList";
import { database } from "../firebase";
import { useAllRecordQuery, useFolderQuery } from "../queries";
import SmallFolder from "../assets/icons/SmallFolder.svg";

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
const exitFolder = async ({ myUID, folderID, navigation }) => {
  await exitData(myUID, folderID).then(
    () => navigation.navigate("Storage") //realtimeDataBase가 모두 업데이트 된후
  );
};
const exitData = async (myUID, folderID) => {
  const db = database;
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
  //사람이 없는 폴더에 나중에 사람이 추가될 가능성을 위해 일단 폴더를 남겨두자
  // .then(
  //   //지울 필요가 없음
  //   onValue(ref(db, "/folders/" + folderID + "/userIDs"), (snapshot) => {
  //     if (!snapshot.hasChildren()) {
  //       const reference3 = ref(db, "/folders/" + folderID);
  //       remove(reference3);
  //     }
  //   })
  // );
};

const SingleFolderScreen = ({ navigation, route }) => {
  const myContext = useContext(AppContext);
  const myUID = myContext.myUID;
  const { folderID } = route.params;
  const query = useFolderQuery(folderID);
  const allRecordQuery = useAllRecordQuery();

  const recordDataSource = Object.entries(allRecordQuery.data).filter(
    function ([key, values]) {
      // Applying filter for the inserted text in search bar
      return values.folderID === folderID;
    }
  );

  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View style={{ height: "100%", width: "100%", backgroundColor: "white" }}>
      <GoBackHeader
        navigation={navigation}
        text={query.data.folderName[myUID]}
        folderColor={query.data.folderColor[myUID]}
        isShareFolder={query.data.userIDs?.length >= 2}
        rightButton="edit"
        rightButtonFunction={() =>
          gotoMakeFolderBottomSheetScreen({
            navigation,
            folderID,
          })
        }
        rightButtonFunction2={() => setModalVisible(true)}
      />
      <RecordFlatList
        recordList={recordDataSource}
        stackNavigation={navigation}
      />
      <PopUpType1
        modalVisible={modalVisible}
        modalHandler={setModalVisible}
        action={() => exitFolder({ myUID, folderID, navigation })}
        askValue="정말 삭제하시겠어요?"
        actionValue="삭제"
      />
    </View>
  );
};

export default SingleFolderScreen;