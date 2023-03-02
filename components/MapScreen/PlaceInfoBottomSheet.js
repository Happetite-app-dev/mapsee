import React, {
  useEffect,
  useRef,
  useState,
  useContext,
  TouchableOpacity,
} from "react";
import {
  Animated,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Button,
  Image,
} from "react-native";
import { onValue, ref } from "firebase/database";
import { useUserQuery, useAllRecordQuery } from "../../queries";
import CreateNote from "../../assets/icons/createNote.svg";
import GoBackHeader from "../GoBackHeader";

import { database } from "../../firebase";
const db = database;
import AppContext from "../AppContext";
import RecordFlatList from "../StorageScreen/RecordFlatList";

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
}) => {
  const myContext = useContext(AppContext);
  const myUID = myContext.myUID;

  const gotoEditScreen = () => {
    return navigation.push("EditScreen", {
      placeName: targetName,
      placeID: targetId,
      address: targetAddress,
      lctn: targetLctn,
    });
  };

  const [masterDataSource, setMasterDataSource] = useState({}); //shortened record가 쌓여있음 {recordID, title, folderID, placeName, date, text, photos}
  useEffect(() => {
    onValue(ref(db, "/users/" + myUID + "/folderIDs"), (snapshot) => {
      if (snapshot.val() != null) {
        //한 user가 folder를 갖고 있지 않을 수 있어!!
        const folderIDList = Object.keys(snapshot.val()); //folderIDList 만들기
        setMasterDataSource({}); //initializing masterDataSource
        folderIDList.map((folderID) => {
          //각 폴더에 대하여...
          onValue(
            ref(db, "/folders/" + folderID + "/placeRecords/" + targetId),
            (snapshot2) => {
              if (snapshot2.val() != (null || undefined)) {
                //폴더는 있지만 빈폴더라서 record가 안에 없을 수 있어!!
                Object.keys(snapshot2.val()).map((recordID) => {
                  //folders의 placeRecord 속에 있는 각 placeID에 대응되는 recordIDObject들에 대하여....
                  onValue(ref(db, "/records/" + recordID), (snapshot3) => {
                    // console.log('----------------------------')
                    // console.log(recordID)
                    // console.log(snapshot3.val().address)
                    //   console.log('placeName', snapshot3.val().placeName)
                    //   console.log('targetName', targetName)
                    //   console.log(snapshot3.val().placeName.includes(targetName))
                    //   console.log(targetName.includes(snapshot3.val().placeName))
                    if (
                      snapshot3.val() != (null || undefined) &&
                      (snapshot3.val().placeName.includes(targetName) ||
                        targetName.includes(snapshot3.val().placeName) ||
                        snapshot3.val().placeName == targetName)
                    ) {
                      //masterDataSource 채워주기 --> 기존 record를 지웠을 때, 없는 recordID를 찾아서 null이 masterDataSource에 들어가는 경우를 방지하고자 함
                      // console.log('----------------------------')
                      // console.log('placeName', snapshot3.val().placeName)
                      // console.log('targetName', targetName)
                      // console.log(snapshot3.val().placeName.includes(targetName))
                      // console.log(targetName.includes(snapshot3.val().placeName))
                      setMasterDataSource((prev) => ({
                        ...prev,
                        [recordID]: { recordID, recordData: snapshot3.val() },
                      })); //{recordID: recordID, recordData:{title: ~~, date: ~~, lctn: ~~, text: ~~, placeName: ~~}}가 쌓여있음
                    }
                  });
                });
              }
            }
          );
        });
      }
    });
  }, []);

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
              fontWeight: "bold",
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
            }}
          >
            기록 {Object.values(masterDataSource).length}
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
        <View
          style={{
            position: "absolute",
            width: 48,
            height: 48,
            marginTop: 48,
            marginLeft: 319,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TouchableHighlight
            style={{
              position: "absolute",
              alignItems: "center",
              width: 48,
              height: 48,
              borderRadius: 24,
              zIndex: 1,
              bottom: 23,
              shadowColor: "black",
              shadowOffset: {
                width: 0,
                height: 5,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.5,
              elevation: 5, //only for ios
            }}
            underlayColor="white"
            onPress={gotoEditScreen}
          >
            <CreateNote />
          </TouchableHighlight>
        </View>
      </View>
    );
  } else {
    // TODO (@KhoDongwook) hook 루트로 빼기

    return (
      //bottomsheet가 전체 화면을 덮은 후
      <View
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
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
          style={{ position: "absolute", top: 85, width: "100%", height: 600 }}
        >
          <RecordFlatList
            recordDataSource={Object.entries(masterDataSource)}
            stackNavigation={navigation}
          />
        </View>
        <TouchableHighlight
          style={{
            position: "absolute",
            bottom: 100,
            right: 10,
            alignItems: "center",
            width: 48,
            height: 48,
            borderRadius: 24,
            zIndex: 1,

            shadowColor: "black",
            shadowOffset: {
              width: 0,
              height: 5,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.5,
          }}
          underlayColor="blue"
          onPress={gotoEditScreen}
        >
          <CreateNote />
        </TouchableHighlight>
      </View>
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
          height: 844, //조정 필요
          backgroundColor: "#fff",
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
        />
      </Animated.View>
    </View>
  );
};

const PlaceInfoBottomSheet = ({ navigation, route }) => {
  const { targetName, targetAddress, targetId, targetLctn } = route.params;
  const [animationValue, setAnimationValue] = useState(-1000);
  const showAnimation = useRef(new Animated.Value(animationValue)).current;
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
});

export default PlaceInfoBottomSheet;
