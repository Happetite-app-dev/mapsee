import React, { useRef, useState } from "react";
import { Animated, View } from "react-native";

import MakeFolderBottomSheet from "../components/MakeFolderBottomSheet";
import { PopUpType1 } from "../components/PopUp";

const toggleAnimation = ({ showAnimation, setAnimationValue }) => {
  const val = -1000;
  Animated.timing(showAnimation, {
    useNativeDriver: false,
    toValue: val,
    duration: 350,
  }).start();
  setAnimationValue(val);
};

const MakeFolderBottomSheetScreen = ({ navigation, route }) => {
  const { folderID, folderName, folderColor, folderUserIDs, recordDataSource } =
    route.params;
  const [animationValue, setAnimationValue] = useState(0);

  const showAnimation = useRef(new Animated.Value(animationValue)).current;
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View
      style={{ width: "100%", height: "100%", backgroundColor: "transparent" }}
    >
      <View
        style={{ width: "100%", height: "26%", backgroundColor: "transparent" }}
        onTouchEndCapture={() => {
          setModalVisible(true);
        }}
      />
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
        <MakeFolderBottomSheet
          stackNavigation={navigation}
          folderID={folderID}
          folderName_={folderName}
          folderColor_={folderColor}
          folderUserIDs_={folderUserIDs}
          recordDataSource={recordDataSource}
        />
      </Animated.View>
      <PopUpType1
        modalVisible={modalVisible}
        modalHandler={setModalVisible}
        action={() => {
          toggleAnimation({ showAnimation, setAnimationValue });
          navigation.goBack();
        }}
        askValue="정말 폴더 생성을 그만두시겠어요?"
        actionValue="그만두기"
      />
    </View>
  );
};

export default MakeFolderBottomSheetScreen;
