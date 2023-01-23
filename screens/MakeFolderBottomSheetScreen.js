import React, { useRef, useState } from "react";
import { Animated, View } from "react-native";

import MakeFolderBottomSheet from "../components/MakeFolderBottomSheet";

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

  return (
    <View
      style={{ width: "100%", height: "100%", backgroundColor: "transparent" }}
    >
      <View
        style={{ width: "100%", height: "26%", backgroundColor: "transparent" }}
        onTouchEndCapture={() => {
          toggleAnimation({ showAnimation, setAnimationValue });
          navigation.goBack();
        }}
      />
      <Animated.View
        style={{
          width: "100%",
          backgroundColor: "#fff",
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          padding: 0,
          position: "absolute",
          zIndex: 3,
          alignItems: "center",
          justifyContent: "center",
          height: 728,
          alignSelf: "center",
          bottom: showAnimation,
          elevation: 24,
          borderWidth: 1,
          borderColor: "#DDDFE9",
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
    </View>
  );
};

export default MakeFolderBottomSheetScreen;
