import { useIsFocused } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  remove,
  get,
} from "firebase/database";
import { useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  AnimatedButton,
  FlatList,
  Image,
} from "react-native";

import AddFolder from "../assets/icons/addfolder.svg";
import IndividualFolder from "../components/IndividualFolder";
import { useUserQuery } from "../queries";

import PinFolder from "../assets/icons/pinFolder.svg";
import SearchData from "../assets/icons/searchData.svg";
import ShareFolder from "../assets/icons/shareFolder2.svg";
import SingleFolder from "../assets/icons/singleFolder.svg";
import AppContext from "../components/AppContext";
import { PopUpType4 } from "../components/PopUp";
import RecordFlatList from "../components/RecordFlatList";
import SnackBar from "../components/SnackBar";

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
  masterDataSource,
  setSelectedFolderIDNameColorUserIDs,
  selectedFolderIDNameColorUserIDs: {
    folderID,
    folderName,
    folderColor,
    folderUserIDs,
  },
}) => {
  // Filter the masterDataSource and update FilteredDataSource
  const filteredDataSource = Object.values(masterDataSource).filter(function (
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
  const [visible, setVisible] = useState(false); // Snackbar
  const onToggleSnackBar = () => setVisible(!visible); // SnackbarButton -> 나중에는 없애기
  const onDismissSnackBar = () => setVisible(false); // Snackbar
  const myContext = useContext(AppContext);
  const myUID = myContext.myUID;
  const isFocused = useIsFocused();
  const [folderIDNameColorUserIDsList, setFolderIDNameColorUserIDsList] =
    useState({}); //{folderID, folderName, folderColor, folderUserIDs}가 쌓여있음
  const [
    selectedFolderIDNameColorUserIDs,
    setSelectedFolderIDNameColorUserIDs,
  ] = useState(undefined);

  const [masterDataSource, setMasterDataSource] = useState({}); //shortened record가 쌓여있음 {recordID, title, folderID, placeName, date, text, photos}
  const [modalVisible, setModalVisible] = useState(false);
  const [longPressedFolder, setLongPressedFolder] = useState({
    folderID: undefined,
    folderName: undefined,
    folderColor: undefined,
    folderUserIDs: [],
  });
  const userQuery = useUserQuery(myUID);
  //const {folderID, folderName, folderColor, folderUserID, recordDataSource}
  useEffect(() => {
    if (isFocused & userQuery.data) {
      const db = getDatabase();
      setMasterDataSource({}); //initializing masterDataSource
      console.log(userQuery.data);
      // userQuery.data.folderIDs?.forEach((folderID) => {
      // //각 폴더에 대하여....
      // onValue(ref(db, "/folders/" + folderID), (snapshot2) => {
      //   //폴더 삭제 시 삭제된 폴더가 display되는 오류 방지를 위한 체크용 코드
      //   if (
      //     snapshot2.child("userIDs").val() &&
      //     myUID in snapshot2.child("userIDs").val()
      //   ) {
      //     setFolderIDNameColorUserIDsList((prev) => ({
      //       ...prev,
      //       [folderID]: {
      //         folderID,
      //         folderName: snapshot2.child("folderName").child(myUID).val(),
      //         folderColor: snapshot2.child("folderColor").child(myUID).val(),
      //         folderUserIDs: Object.keys(snapshot2.child("userIDs").val()),
      //       },
      //     }));
      //     if (snapshot2.child("placeRecords").val() != (null || undefined)) {
      //       //폴더는 있지만 빈폴더라서 record가 안에 없을 수 있어!!
      //       //recordIDList_.push(...Object.keys(snapshot2.child('placeRecords').val()))  //해당 user가 소속된 각 폴더에 들어있는 recordIDList들을 합쳐서 하나로 만들어주기(버림)
      //       Object.values(snapshot2.child("placeRecords").val()).map(
      //         (recordIDObject) => {
      //           //folders의 placeRecord 속에 있는 각 placeID에 대응되는 recordIDObject들에 대하여....
      //           Object.keys(recordIDObject).map((recordID) => {
      //             //각 recordObject에 있는 recordID에 대하여
      //             onValue(ref(db, "/records/" + recordID), (snapshot3) => {
      //               if (snapshot3.val() != (null || undefined)) {
      //                 //masterDataSource 채워주기 --> 기존 record를 지웠을 때, 없는 recordID를 찾아서 null이 masterDataSource에 들어가는 경우를 방지하고자 함
      //                 setMasterDataSource((prev) => ({
      //                   ...prev,
      //                   [recordID]: {
      //                     recordID,
      //                     recordData: snapshot3.val(),
      //                   },
      //                 })); //{recordID: recordID, recordData:{title: ~~, date: ~~, lctn: ~~, text: ~~, placeName: ~~}}가 쌓여있음
      //               }
      //             });
      //           });
      //         }
      //       );
      //     }
      //   }
      // });
      // });
    }
  }, [isFocused, userQuery.data]);

  //const {folderID, folderName, folderColor, folderUserID, recordDataSource}
  useEffect(() => {
    if (isFocused) {
      const db = getDatabase();
      onValue(ref(db, "/users/" + myUID + "/folderIDs"), (snapshot) => {
        if (snapshot.val() != null) {
          //한 user가 folder를 갖고 있지 않을 수 있어!!
          const folderIDList = Object.keys(snapshot.val()); //folderIDList 만들기
          setFolderIDNameColorUserIDsList({}); //initializing folderIDNameList
          setMasterDataSource({}); //initializing masterDataSource
          folderIDList.map((folderID) => {
            //각 폴더에 대하여....
            onValue(ref(db, "/folders/" + folderID), (snapshot2) => {
              //폴더 삭제 시 삭제된 폴더가 display되는 오류 방지를 위한 체크용 코드
              if (
                snapshot2.child("userIDs").val() &&
                myUID in snapshot2.child("userIDs").val()
              ) {
                setFolderIDNameColorUserIDsList((prev) => ({
                  ...prev,
                  [folderID]: {
                    folderID,
                    folderName: snapshot2
                      .child("folderName")
                      .child(myUID)
                      .val(),
                    folderColor: snapshot2
                      .child("folderColor")
                      .child(myUID)
                      .val(),
                    folderUserIDs: Object.keys(
                      snapshot2.child("userIDs").val()
                    ),
                    folderFixedDate: snapshot2
                      .child("fixedDate")
                      .child(myUID)
                      .val(),
                    folderUpdateDate: snapshot2.child("updateDate").val(),
                  },
                }));
                if (
                  snapshot2.child("placeRecords").val() != (null || undefined)
                ) {
                  //폴더는 있지만 빈폴더라서 record가 안에 없을 수 있어!!
                  //recordIDList_.push(...Object.keys(snapshot2.child('placeRecords').val()))  //해당 user가 소속된 각 폴더에 들어있는 recordIDList들을 합쳐서 하나로 만들어주기(버림)
                  Object.values(snapshot2.child("placeRecords").val()).map(
                    (recordIDObject) => {
                      //folders의 placeRecord 속에 있는 각 placeID에 대응되는 recordIDObject들에 대하여....
                      Object.keys(recordIDObject).map((recordID) => {
                        //각 recordObject에 있는 recordID에 대하여
                        onValue(
                          ref(db, "/records/" + recordID),
                          (snapshot3) => {
                            if (snapshot3.val() != (null || undefined)) {
                              //masterDataSource 채워주기 --> 기존 record를 지웠을 때, 없는 recordID를 찾아서 null이 masterDataSource에 들어가는 경우를 방지하고자 함
                              setMasterDataSource((prev) => ({
                                ...prev,
                                [recordID]: {
                                  recordID,
                                  recordData: snapshot3.val(),
                                },
                              })); //{recordID: recordID, recordData:{title: ~~, date: ~~, lctn: ~~, text: ~~, placeName: ~~}}가 쌓여있음
                            }
                          }
                        );
                      });
                    }
                  );
                }
              }
            });
          });
        }
      });
    }
  }, [isFocused]);
  //선택된 파일에 따라서 filter 변화 useEffect
  useEffect(() => {
    if (selectedFolderIDNameColorUserIDs != undefined) {
      filterFunction({
        navigation,
        masterDataSource,
        setSelectedFolderIDNameColorUserIDs,
        selectedFolderIDNameColorUserIDs,
      });
    }
  }, [selectedFolderIDNameColorUserIDs]);

  const renderFolder = ({ item: folderID }) => (
    <IndividualFolder
      folderID={folderID}
      setSelectedFolderIDNameColorUserIDs={(tmp) =>
        setSelectedFolderIDNameColorUserIDs(tmp)
      }
      setLongPressedFolder={setLongPressedFolder}
      setModalVisible={setModalVisible}
    />
  );
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
              if (
                folderIDNameColorUserIDsList != null &&
                Object.values(folderIDNameColorUserIDsList).length >= 16
              )
                onToggleSnackBar();
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
        <FlatList
          data={
            userQuery.data?.folderIDs
              ? Object.keys(userQuery.data?.folderIDs)
              : []
          }
          renderItem={renderFolder}
          keyExtractor={(item) => item}
/*          data={Object.values(folderIDNameColorUserIDsList).sort(function (
            a,
            b
          ) {
            if (a.folderFixedDate !== null && b.folderFixedDate !== null)
              return new Date(b.folderFixedDate) - new Date(a.folderFixedDate);
            else if (a.folderFixedDate !== null) return -1;
            else if (b.folderFixedDate !== null) return 1;
            else
              return (
                new Date(b.folderUpdateDate) - new Date(a.folderUpdateDate)
              );
          })}
          renderItem={renderFolder}
          keyExtractor={(item) => item.folderID}*/
          horizontal
          style={{
            flex: 1,
          }}
        />
      </View>

      <RecordFlatList
        recordDataSource={masterDataSource}
        stackNavigation={navigation}
      />
      <PopUpType4
        modalVisible={modalVisible}
        modalHandler={setModalVisible}
        action1={() => {
          if (longPressedFolder.folderFixedDate == null) {
            const referenceFix = ref(
              getDatabase(),
              "/folders/" + longPressedFolder.folderID + "/fixedDate/" + myUID
            );

            const now = new Date();
            set(referenceFix, now.toString());
          } else {
            const referenceFix = ref(
              getDatabase(),
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
