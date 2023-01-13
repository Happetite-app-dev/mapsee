import { set, getDatabase, ref, onValue, push } from "firebase/database";
import React, { useEffect, useRef, useState, useContext } from "react";
import { Animated, Text, View, TouchableOpacity, Button } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import AppContext from "../components/AppContext";
import AddFolderBottomSheet from "./AddFolderBottomSheet";

const FolderBottomSheet = ({
  stackNavigation,
  show,
  setShow,
  setFolderName,
  setFolderID,
}) => {
  const myContext = useContext(AppContext);
  const myUID = myContext.myUID;

  useEffect(() => {
    const db = getDatabase();
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

  const [folderIDNameList, setFolderIDNameList] = useState({}); //{folderID: folderName}가 쌓여있음
  const [isSelectingFolder, setIsSelectingFolder] = useState(true); //folderlist 창과 폴더 추가창 중 무엇을 띄울지에 대한 bool

  const [animationValue, setAnimationValue] = useState(-1000);
  useEffect(() => {
    toggleAnimation();
    setIsSelectingFolder(true);
  }, [show]);

  const showAnimation = useRef(new Animated.Value(animationValue)).current;
  const toggleAnimation = () => {
    const val = show ? 0 : -1000;
    Animated.timing(showAnimation, {
      useNativeDriver: false,
      toValue: val,
      duration: 350,
    }).start();
    setAnimationValue(val);
  };

  return (
    <Animated.View
      style={{
        width: "100%",
        backgroundColor: "#fff",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 0,
        position: "absolute",
        zIndex: 3,
        alignItems: "center",
        justifyContent: "center",
        height: 630,
        shadowOffset: {
          width: 0,
          height: 12,
        },
        alignSelf: "center",
        shadowOpacity: 0.58,
        shadowRadius: 16.0,
        bottom: showAnimation,
        elevation: 24,
      }}
    >
      {isSelectingFolder ? (
        <View style={{ width: "100%", height: "100%" }}>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            style={{ width: "100%", top: 20 }}
          >
            {Object.values(folderIDNameList).map(({ folderID, folderName }) => {
              if (folderName != null)
                return (
                  <View
                    style={{ alignItems: "center", paddingBottom: 10 }}
                    key={folderID}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        setFolderName(folderName);
                        setFolderID(folderID);
                        setShow(false);
                      }}
                      style={{
                        width: 350,
                        borderWidth: 1,
                        borderRadius: 8,
                      }}
                    >
                      <View
                        style={{
                          alignItems: "center",
                          justifyContent: "center",
                          height: 40,
                          marginBottom: 0,
                          top: 0,
                        }}
                      >
                        <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                          {folderName}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
            })}
          </ScrollView>
          <TouchableOpacity
            onPress={() => {
              setIsSelectingFolder(false);
            }}
            style={{
              bottom: 40,
              width: 350,
              borderColor: "black",
              borderWidth: 1,
              borderRadius: 8,
              alignSelf: "center",
            }}
          >
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                height: 40,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                새 폴더 추가
              </Text>
            </View>
          </TouchableOpacity>
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
    </Animated.View>
  );
};

export default FolderBottomSheet;
