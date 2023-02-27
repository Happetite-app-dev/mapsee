import { set, ref, onValue, push } from "firebase/database";
import React, { useEffect, useRef, useState, useContext } from "react";
import { Animated, Text, View, TouchableOpacity, Button } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { database } from "../../firebase";
const db = database;

import AppContext from "../AppContext";
import AddFolderBottomSheet from "./AddFolderBottomSheet";
import BottomButton from "../BottomButton";
import BottomSheetScroll from "../../assets/icons/BottomSheetScroll.svg";
import ListEcllipse from "../../assets/icons/ListEcllipse.svg";
import ControlEmpty from "../../assets/icons/ControlEmpty.svg";
import ControlFull from "../../assets/icons/ControlFull.svg";
import SnackBar from "../SnackBar";

const toggleAnimation = ({ show, showAnimation, setAnimationValue }) => {
  const val = show ? 0 : -1000;
  Animated.timing(showAnimation, {
    useNativeDriver: false,
    toValue: val,
    duration: 350,
  }).start();
  setAnimationValue(val);
};
const FolderBottomSheet = ({
  stackNavigation,
  show,
  setShow,
  setFolderName,
  setFolderID,
  selectedFolderID,
}) => {
  const myContext = useContext(AppContext);
  const myUID = myContext.myUID;

  const [folderIDNameList, setFolderIDNameList] = useState({}); //{folderID: folderName}가 쌓여있음
  const [isSelectingFolder, setIsSelectingFolder] = useState(true); //folderlist 창과 폴더 추가창 중 무엇을 띄울지에 대한 bool
  const [animationValue, setAnimationValue] = useState(-1000);
  const [visible, setVisible] = useState(false); // Snackbar
  const onToggleSnackBar = () => setVisible(!visible); // SnackbarButton -> 나중에는 없애기
  const onDismissSnackBar = () => setVisible(false); // Snackbar

  const showAnimation = useRef(new Animated.Value(animationValue)).current;
  useEffect(() => {
    toggleAnimation({ show, showAnimation, setAnimationValue });
    setIsSelectingFolder(true);
  }, [show]);
  useEffect(() => {
    onValue(ref(db, "/users/" + myUID + "/folderIDs"), (snapshot) => {
      if (snapshot.val() != null) {
        const folderIDList = Object.keys(snapshot.val());
        setFolderIDNameList({});
        folderIDList.map((folderID) => {
          onValue(
            ref(db, "/folders/" + folderID + "/folderName/" + myUID),
            (snapshot2) => {
              setFolderIDNameList((prev) => ({
                ...prev,
                [folderID]: { folderID, folderName: snapshot2.val() },
              }));
            }
          );
        });
      }
    });
  }, []);

  return (
    <Animated.View
      style={{
        width: "100%",
        backgroundColor: "#fff",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        borderWidth: 1,
        borderColor: "#DDDFE9",
        padding: 0,
        position: "absolute",
        zIndex: 3,
        alignItems: "center",
        justifyContent: "center",
        height: 728,
        alignSelf: "center",
        bottom: showAnimation,
        elevation: 24,
      }}
    >
      {isSelectingFolder ? (
        <View style={{ width: "100%", height: "100%", alignItems: "center" }}>
          <BottomSheetScroll style={{ top: 8 }} />

          <ScrollView
            showsHorizontalScrollIndicator={false}
            style={{ width: "100%", top: 20 }}
          >
            {Object.values(folderIDNameList).map(({ folderID, folderName }) => {
              if (folderName != null)
                return (
                  <View
                    style={{ alignItems: "center", height: 48 }}
                    key={folderID}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        setFolderName(folderName);
                        setFolderID(folderID);
                        setShow(false);
                      }}
                      style={{
                        width: 344,
                      }}
                    >
                      <View
                        style={{
                          height: 40,
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <View
                          style={{
                            height: 40,
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <ListEcllipse />
                          <Text style={{ fontSize: 14, left: 16 }}>
                            {folderName}
                          </Text>
                        </View>
                        {selectedFolderID === folderID ? (
                          <ControlFull />
                        ) : (
                          <ControlEmpty />
                        )}
                      </View>
                    </TouchableOpacity>
                  </View>
                );
            })}
          </ScrollView>
          <BottomButton
            onPressFunction={() => {
              if (Object.values(folderIDNameList).length >= 16)
                onToggleSnackBar();
              else setIsSelectingFolder(false);
            }}
            text="새폴더 추가"
            style={{ bottom: 40 }}
          />
        </View>
      ) : (
        <AddFolderBottomSheet
          stackNavigation={stackNavigation}
          setFolderName={(f) => setFolderName(f)}
          setFolderID={(f) => setFolderID(f)}
          setFolderIDNameList={(f) => setFolderIDNameList(f)}
          setShow={(s) => setShow(s)}
        />
      )}
      <SnackBar
        visible={visible}
        onDismissSnackBar={onDismissSnackBar}
        text="최대 16개까지 폴더를 만들 수 있습니다."
      />
    </Animated.View>
  );
};

export default FolderBottomSheet;
