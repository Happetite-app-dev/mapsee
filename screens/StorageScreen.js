import { ref, onValue, set, remove } from "firebase/database";
import { useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useQueryClient } from "react-query";
import AddFolder from "../assets/icons/addfolder.svg";
import { useIsFocused } from "@react-navigation/native";
import { useUserQuery, useAllRecordQuery } from "../queries";

import SearchData from "../assets/icons/searchData.svg";
import AppContext from "../components/AppContext";
import { CreateNote } from "../components/MapScreen/CreateNote";
import { PopUpType4 } from "../components/PopUp";
import RecordFlatList from "../components/StorageScreen/RecordFlatList";
import SnackBar from "../components/SnackBar";
import FolderList from "../components/StorageScreen/FolderList";
import { database } from "../firebase";
const db = database;

const exitFolder = async ({ myUID, folderID, navigation, queryClient }) => {
  await exitData(myUID, folderID, queryClient).then(
    () => navigation.navigate("Storage") //realtimeDataBase가 모두 업데이트 된후
  );
};

const exitData = async (myUID, folderID, queryClient) => {
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
    });

  queryClient.invalidateQueries(["folders", folderID]);
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
const gotoSingleFolderScreen = ({
  navigation,
  recordDataSource,
  folderID,
  folderName,
  folderColor,
  folderUserIDs,
  setSelectedFolderIDNameColorUserIDs,
}) => {
  setSelectedFolderIDNameColorUserIDs(undefined);
  navigation.navigate("SingleFolderScreen", {
    recordDataSource,
    folderID,
    folderName,
    folderColor,
    folderUserIDs,
  });
};
const filterFunction = ({
  navigation,
  setSelectedFolderIDNameColorUserIDs,
  selectedFolderIDNameColorUserIDs: {
    folderID,
    folderName,
    folderColor,
    folderUserIDs,
  },
}) => {
  gotoSingleFolderScreen({
    navigation,
    folderID,
    folderName,
    folderColor,
    folderUserIDs,
    setSelectedFolderIDNameColorUserIDs,
  });
};

const StorageScreen = ({ navigation, route }) => {
  const myContext = useContext(AppContext);
  const myUID = myContext.myUID;
  const userQuery = useUserQuery(myUID);
  const allRecordQuery = useAllRecordQuery();
  const queryClient = useQueryClient();

  const [visible, setVisible] = useState(false); // Snackbar
  const onToggleSnackBar = () => setVisible(!visible); // SnackbarButton -> 나중에는 없애기
  const onDismissSnackBar = () => setVisible(false); // Snackbar
  const isFocused = useIsFocused();

  const [
    selectedFolderIDNameColorUserIDs,
    setSelectedFolderIDNameColorUserIDs,
  ] = useState(undefined);

  const [modalVisible, setModalVisible] = useState(false);
  const [longPressedFolder, setLongPressedFolder] = useState({
    folderID: undefined,
    folderName: undefined,
    folderColor: undefined,
    folderUserIDs: [],
    folderFixedDate: undefined,
  });

  useEffect(() => {
    if (selectedFolderIDNameColorUserIDs !== undefined) {
      filterFunction({
        navigation,
        setSelectedFolderIDNameColorUserIDs,
        selectedFolderIDNameColorUserIDs,
      });
    }
  }, [selectedFolderIDNameColorUserIDs]);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.screenTitleView}>
        <Text style={styles.screenTitle}>보관함</Text>
        <View style={styles.twoRightButtons}>
          <TouchableOpacity
            style={styles.secondButton}
            onPress={() => {
              if (
                userQuery.data?.folderIDs &&
                userQuery.data?.folderIDs.length >= 16
              )
                onToggleSnackBar();
              else {
                gotoMakeFolderBottomSheetScreen({
                  navigation,
                  folderID: null,
                  folderName: null,
                  folderColor: null,
                  recordDataSource: {},
                  folderUserIDs: null,
                });
              }
            }}
          >
            <AddFolder />
          </TouchableOpacity>
        </View>
      </View>
      <RecordFlatList
        recordList={
          allRecordQuery.data && userQuery.data?.folderIDs
            ? Object.entries(allRecordQuery.data).filter(([key, values]) => {
                return values.folderID in userQuery.data?.folderIDs;
              })
            : []
        }
        stackNavigation={navigation}
        ListHeaderComponent={
          <View style={{ height: 80, marginBottom: 20 }}>
            <FolderList
              folderIDs={
                userQuery.data?.folderIDs
                  ? Object.keys(userQuery.data?.folderIDs)
                  : []
              }
              setSelectedFolderIDNameColorUserIDs={
                setSelectedFolderIDNameColorUserIDs
              }
              setLongPressedFolder={setLongPressedFolder}
              setModalVisible={setModalVisible}
            />
          </View>
        }
        style={{ height: "85%", marginTop: -20 }}
        onRefresh={() => {
          queryClient.invalidateQueries(["all-records"]);
          queryClient.invalidateQueries(["folders"]); // 임시로!!!! 고쳐야해!!!!!!!!!!!!!!!!!!!!!!!!!
        }} // fetch로 데이터 호출
        refreshing={allRecordQuery.isLoading} // state
      />
      <PopUpType4
        modalVisible={modalVisible}
        modalHandler={setModalVisible}
        action1={() => {
          if (longPressedFolder.folderFixedDate === undefined) {
            const referenceFix = ref(
              db,
              "/folders/" + longPressedFolder.folderID + "/fixedDate/" + myUID
            );

            const now = new Date();
            set(referenceFix, now.toString());
            queryClient.invalidateQueries([
              "folders",
              longPressedFolder.folderID,
            ]);
          } else {
            const referenceFix = ref(
              db,
              "/folders/" + longPressedFolder.folderID + "/fixedDate/" + myUID
            );
            remove(referenceFix);
          }

          queryClient.invalidateQueries([
            "folders",
            longPressedFolder.folderID,
          ]);
        }}
        action2={() => {
          gotoMakeFolderBottomSheetScreen({
            navigation,
            folderID: longPressedFolder.folderID,
            folderName: longPressedFolder.folderName,
            folderColor: longPressedFolder.folderColor,
            folderUserIDs: longPressedFolder.folderUserIDs,
            recordDataSource: {},
          });
        }}
        action3={() => {
          exitFolder({
            myUID,
            folderID: longPressedFolder.folderID,
            navigation,
            queryClient,
          });
        }}
        askValue={longPressedFolder.folderName}
        actionValue1={
          longPressedFolder.folderFixedDate === undefined
            ? "좌측 폴더 고정"
            : "좌측 폴더 해제"
        }
        actionValue2="폴더 편집"
        actionValue3="나가기"
      />
      <CreateNote
        navigation={navigation}
        isFocused={isFocused}
        style={styles.createNote}
      />

      <SnackBar
        visible={visible}
        onDismissSnackBar={onDismissSnackBar}
        text="최대 16개까지 폴더를 만들 수 있습니다."
      />
    </SafeAreaView>
  );
};

export default StorageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  screenTitle: {
    fontWeight: "bold",
    fontSize: 16,
    left: 23,
    fontFamily: "NotoSansKR-Bold",
  },
  screenTitleView: {
    flexDirection: "row",
    height: 48,
    marginBottom: 20,
    alignItems: "center",
    position: "relative",
    width: "100%",
  },
  item: {
    flex: 0.5,
    borderColor: "grey",
    borderRadius: 8,
    borderWidth: 1,
    padding: 0,
    height: 224,
    maxWidth: 160,
    marginVertical: 8,
    marginHorizontal: 12,
  },
  title: {
    fontSize: 16,
  },
  twoRightButtons: {
    position: "absolute",
    right: 0,
    width: 86,
    height: 30,
    flexDirection: "row",
    alignItems: "center",
  },
  firstButton: {
    width: 30,
    height: 30,
  },
  secondButton: {
    width: 30,
    height: 30,
    left: 10,
  },
  createNote: {
    position: "absolute",
    width: 48,
    height: 48,
    borderRadius: 24,
    left: 319,
    bottom: 112,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.5,
  },
});
