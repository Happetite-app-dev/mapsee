import { useIsFocused } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  remove,
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
import SearchData from "../assets/icons/searchData.svg";
import SingleFolder from "../assets/icons/singleFolder.svg";
import AppContext from "../components/AppContext";
import { PopUpType4 } from "../components/PopUp";
import RecordFlatList from "../components/RecordFlatList";

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
const IndividualFolder = ({
  folderID,
  folderName,
  folderColor,
  folderUserIDs,
  setSelectedFolderIDNameColorUserIDs,
  setLongPressedFolder,
  setModalVisible,
}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        setSelectedFolderIDNameColorUserIDs({
          folderID,
          folderName,
          folderColor,
          folderUserIDs,
        });
        //gotoSingleFolderScreen()
      }}
      onLongPress={() => {
        setLongPressedFolder({
          folderID,
          folderName,
          folderColor,
          folderUserIDs,
        });
        setModalVisible(true);
      }}
      style={{ height: 65 }}
      activeOpacity={0.2}
    >
      <View style={{ marginLeft: 10, marginRight: 10 }}>
        <SingleFolder color={folderColor} />
        {/* Image source path changes depending on fileColor */}
        {/* <Image source={} style={{width: 50, height:50}}/> */}
        <Text style={{ alignSelf: "center", top: 8 }}>{folderName}</Text>
      </View>
    </TouchableOpacity>
  );
};
const StorageScreen = ({ navigation, route }) => {
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

  const renderFolder = ({ item }) => (
    <IndividualFolder
      folderID={item.folderID}
      folderName={item.folderName}
      folderColor={item.folderColor}
      folderUserIDs={item.folderUserIDs}
      setSelectedFolderIDNameColorUserIDs={(tmp) =>
        setSelectedFolderIDNameColorUserIDs(tmp)
      }
      setLongPressedFolder={setLongPressedFolder}
      setModalVisible={setModalVisible}
    />
  );
  return (
    <SafeAreaView style={styles.container}>
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
            onPress={() =>
              gotoMakeFolderBottomSheetScreen({
                navigation,
                folderID: "",
                folderName: null,
                folderColor: null,
                recordDataSource: {},
                folderUserIDs: null,
              })
            }
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
          data={Object.values(folderIDNameColorUserIDsList)}
          renderItem={renderFolder}
          keyExtractor={(item) => item.folderID}
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
          console.log("Action1");
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
        actionValue1="좌측 폴더 고정"
        actionValue2="폴더 편집"
        actionValue3="나가기"
      />
    </SafeAreaView>
  );
};

export default StorageScreen;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "89.5%",
    marginTop: 0,
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
