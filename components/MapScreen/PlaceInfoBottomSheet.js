import { useIsFocused } from "@react-navigation/native";
import { onValue, ref } from "firebase/database";
import React, { useEffect, useRef, useState, useContext } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Image,
} from "react-native";
import { useAllRecordQuery, useUserQuery } from "../../queries";

//import CreateNote from "../../assets/icons/createNote.svg";
import { CreateNote } from "./CreateNote";
import { database } from "../../firebase";
import AppContext from "../AppContext";
import GoBackHeader from "../GoBackHeader";
import RecordFlatList from "../StorageScreen/RecordFlatList";
import { SafeAreaView } from "react-native-safe-area-context";
const db = database;

const bottomSheetImage = require("../../assets/image/bottomSheetScroll.png");

const toggleAnimation1 = (showAnimation, setAnimationValue) => {
  //bottomsheet가 -650일 때  안 보이게 하기
  const val = -1000;
  Animated.timing(showAnimation, {
    useNativeDriver: false,
    toValue: val,
    duration: 350,
  }).start();
  setAnimationValue(val);
};
const toggleAnimation2 = (showAnimation, setAnimationValue) => {
  //bottomsheet가 -650일 때 터치해서 전체 화면으로 올리기
  const val2 = 0;
  Animated.timing(showAnimation, {
    useNativeDriver: false,
    toValue: val2,
    duration: 350,
  }).start();
  setAnimationValue(val2);
};
const toggleAnimation3 = (showAnimation, setAnimationValue) => {
  //bottomsheet가 -1000일 때 보이게 하기, bottomsheet가 0일 때 뒤로 가기 버튼 눌러서 보이게만 하기
  const val3 = -692;
  Animated.timing(showAnimation, {
    useNativeDriver: false,
    toValue: val3,
    duration: 350,
  }).start();
  setAnimationValue(val3);
};

const BottomSheetScreen = ({
  setAnimationValue,
  showAnimation,
  animationVal,
  targetName,
  targetAddress,
  targetId,
  targetLctn,
  navigation,
  recordDataSource,
}) => {
  const isFocused = useIsFocused();
  if (animationVal < 0) {
    return (
      //bottomsheet가 전체 화면을 덮기 전
      <View
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          flexDirection: "column",
        }}
      >
        <View
          style={{
            position: "absolute",
            width: "75%",
            height: "100%",
          }}
          onTouchEndCapture={() =>
            toggleAnimation2(showAnimation, setAnimationValue)
          }
        >
          <Image
            source={bottomSheetImage}
            style={{ marginLeft: 175, marginTop: 8 }}
          />
          <Text
            style={{
              position: "absolute",
              marginTop: 24,
              marginLeft: 23,
              fontSize: 16,
              fontFamily: "NotoSansKR-Medium",
            }}
          >
            {targetName}
          </Text>
          <Text
            style={{
              position: "absolute",
              marginTop: 56,
              marginLeft: 23,
              fontSize: 12,
              color: "#545766",
              fontFamily: "NotoSansKR-Regular",
            }}
          >
            {targetAddress}
          </Text>
          <Text
            style={{
              position: "absolute",
              marginTop: 88,
              marginLeft: 23,
              fontSize: 12,
              color: "#ADB1C5",
              fontFamily: "NotoSansKR-Regular",
            }}
          >
            기록 {recordDataSource.length}
          </Text>
        </View>
        <View
          style={{
            position: "absolute",
            right: 0,
            width: "25%",
            height: "8%",
          }}
          onTouchEndCapture={() =>
            toggleAnimation2(showAnimation, setAnimationValue)
          }
        />
        <CreateNote
          navigation={navigation}
          isFocused={isFocused}
          style={styles.createNote}
        />
      </View>
    );
  } else {
    // TODO (@KhoDongwook) hook 루트로 빼기

    return (
      //bottomsheet가 전체 화면을 덮은 후
      <SafeAreaView
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: -8,
        }}
      >
        <GoBackHeader
          text={targetName}
          rightButton="goHome"
          navigation={navigation}
          goBackFunction={() =>
            toggleAnimation3(showAnimation, setAnimationValue)
          }
        />
        <View
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <RecordFlatList
            recordList={recordDataSource}
            stackNavigation={navigation}
          />
        </View>

        <CreateNote
          isFocused={isFocused}
          navigation={navigation}
          style={{
            left: 319,
            bottom: 103,
            position: "absolute",
            width: 48,
            height: 48,
            borderRadius: 24,
            shadowColor: "black",
            shadowOffset: {
              width: 0,
              height: 5,
            },
            shadowOpacity: 0.15,
            shadowRadius: 3.5,
          }}
        />
      </SafeAreaView>
    );
  }
};

const BottomSheet = ({
  showAnimation,
  setAnimationValue,
  animation,
  animationVal,
  targetName,
  targetAddress,
  targetId,
  targetLctn,
  navigation,
  recordDataSource,
}) => {
  return (
    <View
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <View
        style={{
          width: "100%",
          height: 692,
        }}
        onTouchEndCapture={() => {
          toggleAnimation1(showAnimation, setAnimationValue);
          navigation.goBack();
        }}
      />
      <Animated.View
        style={{
          width: "100%",
          height: 884, //조정 필요,
          backgroundColor: "white",
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          padding: 0,
          position: "absolute",
          zIndex: 4,
          alignItems: "center",
          justifyContent: "center",
          bottom: animation,
          elevation: 24,
          borderWidth: 1,
          borderColor: "#DDDFE9",
        }}
      >
        <BottomSheetScreen
          showAnimation={showAnimation}
          setAnimationValue={setAnimationValue}
          animationVal={animationVal}
          targetName={targetName}
          targetAddress={targetAddress}
          targetId={targetId}
          targetLctn={targetLctn}
          navigation={navigation}
          recordDataSource={recordDataSource}
        />
      </Animated.View>
    </View>
  );
};

const PlaceInfoBottomSheet = ({ navigation, route }) => {
  const { targetName, targetAddress, targetId, targetLctn } = route.params;
  const [animationValue, setAnimationValue] = useState(-1000);
  const showAnimation = useRef(new Animated.Value(animationValue)).current;
  const allRecordQuery = useAllRecordQuery();
  const myContext = useContext(AppContext);
  const myUID = myContext.myUID;
  const userQuery = useUserQuery(myUID);
  const recordDataSource =
    allRecordQuery.data && userQuery.data?.folderIDs
      ? Object.entries(allRecordQuery.data).filter(([key, record]) => {
          return (
            record.folderID in userQuery.data?.folderIDs &&
            targetId === record.placeID
          );
        })
      : [];
  useEffect(() => {
    toggleAnimation3(showAnimation, setAnimationValue);
  }, []);
  return (
    <View>
      <BottomSheet
        showAnimation={showAnimation}
        setAnimationValue={setAnimationValue}
        animation={showAnimation}
        animationVal={animationValue}
        targetName={targetName}
        targetAddress={targetAddress}
        targetId={targetId}
        targetLctn={targetLctn}
        navigation={navigation}
        recordDataSource={recordDataSource}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    position: "relative",
    backgroundColor: "white",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  buttons: {
    height: 88,
    width: "100%",
    backgroundColor: "white",
    flexDirection: "row",
    position: "absolute",
  },
  goBack: {
    width: 30,
    height: 18,
    position: "absolute",
    marginTop: 51,
    marginLeft: 31,
  },
  goBackImage: {
    width: 9,
    height: 18,
    resizeMode: "contain",
    tintColor: "black",
  },
  title: {
    width: 280,
    height: 24,

    marginTop: 48,
    marginLeft: 63,
    position: "absolute",
  },
  titleText: {
    height: 24,
    fontSize: 16,
    lineHeight: 24,
  },
  goHome: {
    width: 15,
    height: 15,
    marginLeft: 347.5,
    marginTop: 52.5,
  },
  goHomeImage: {
    width: 15,
    height: 15,
    position: "absolute",
  },
  createNote: {
    width: 48,
    height: 48,
    borderRadius: 24,
    left: 319,
    top: 32,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.5,
  },
});

export default PlaceInfoBottomSheet;
