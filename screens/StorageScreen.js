import { ref, onValue, set, remove } from "firebase/database";
import { useEffect, useState, useContext } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

import AddFolder from "../assets/icons/addfolder.svg";
import { useUserQuery, useAllRecordQuery } from "../queries";

import SearchData from "../assets/icons/searchData.svg";
import AppContext from "../components/AppContext";
import { PopUpType4 } from "../components/PopUp";
import RecordFlatList from "../components/RecordFlatList";
import SnackBar from "../components/SnackBar";
import FolderList from "../components/FolderList";
import { database } from "../firebase";
const db = database;

const exitFolder = async ({ myUID, folderID, navigation }) => {
  await exitData(myUID, folderID).then(
    () => navigation.navigate("Storage") //realtimeDataBase가 모두 업데이트 된후
  );
};

const exitData = async (myUID, folderID) => {
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
  allRecordQuery,
  setSelectedFolderIDNameColorUserIDs,
  selectedFolderIDNameColorUserIDs: {
    folderID,
    folderName,
    folderColor,
    folderUserIDs,
  },
}) => {
  // Filter the masterDataSource and update FilteredDataSource
  const filteredDataSource = Object.values(allRecordQuery).filter(function (
    item
  ) {
    // Applying filter for the inserted text in search bar
    return item.recordData.folderID === folderID;
  });
  gotoSingleFolderScreen({
    navigation,
    recordDataSource: filteredDataSource,
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

  const [visible, setVisible] = useState(false); // Snackbar
  const onToggleSnackBar = () => setVisible(!visible); // SnackbarButton -> 나중에는 없애기
  const onDismissSnackBar = () => setVisible(false); // Snackbar

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
  });

  useEffect(() => {
    if (selectedFolderIDNameColorUserIDs !== undefined) {
      filterFunction({
        navigation,
        allRecordQuery,
        setSelectedFolderIDNameColorUserIDs,
        selectedFolderIDNameColorUserIDs,
      });
    }
  }, [selectedFolderIDNameColorUserIDs]);

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          height: 56,
          marginBottom: 20,
          alignItems: "center",
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 16, left: 23 }}>
          보관함
        </Text>
        <View style={styles.twoRightButtons}>
          <TouchableOpacity
            style={styles.firstButton}
            onPress={() => {
              if (userQuery.data?.folderIDs.length >= 16) onToggleSnackBar();
              else {
                gotoMakeFolderBottomSheetScreen({
                  navigation,
                  folderID: "",
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
          <TouchableOpacity style={styles.secondButton}>
            <SearchData />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ height: 85 }}>
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

      <RecordFlatList
        recordList={
          allRecordQuery.data
            ? Object.values(allRecordQuery.data).filter((record) => {
                return record.folderID in userQuery.data?.folderIDs;
              })
            : []
        }
        stackNavigation={navigation}
      />
      <PopUpType4
        modalVisible={modalVisible}
        modalHandler={setModalVisible}
        action1={() => {
          if (longPressedFolder.folderFixedDate == null) {
            const referenceFix = ref(
              db,
              "/folders/" + longPressedFolder.folderID + "/fixedDate/" + myUID
            );

            const now = new Date();
            set(referenceFix, now.toString());
          } else {
            const referenceFix = ref(
              db,
              "/folders/" + longPressedFolder.folderID + "/fixedDate/" + myUID
            );
            remove(referenceFix);
          }
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
          });
        }}
        askValue={longPressedFolder.folderName}
        actionValue1={
          longPressedFolder.folderFixedDate == null
            ? "좌측 폴더 고정"
            : "좌측 폴더 해제"
        }
        actionValue2="폴더 편집"
        actionValue3="나가기"
      />

      <SnackBar
        visible={visible}
        onDismissSnackBar={onDismissSnackBar}
        text="최대 16개까지 폴더를 만들 수 있습니다."
      />
    </View>
  );
};

export default StorageScreen;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "89.5%",
    marginTop: 32,
    backgroundColor: "white",
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
});
