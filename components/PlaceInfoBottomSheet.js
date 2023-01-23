import { getDatabase, ref, onValue } from "firebase/database";
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

import AppContext from "../components/AppContext";
import RecordFlatList from "../components/RecordFlatList";

const CreateNoteImage = require("../assets/image/CreateNote.png");
const bottomSheetImage = require("../assets/image/bottomSheetScroll.png");
const closeImage = require("../assets/image/close.png");
const closeImage1 = require("../assets/image/close_1.png");
const goBackImage = require("../assets/image/goBack.png");

const BottomSheetScreen = ({
  onDisplay,
  onCancel,
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
    const db = getDatabase();
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
          onTouchEndCapture={() => onDisplay()}
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
          onTouchEndCapture={() => onDisplay()}
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
            }}
            underlayColor="white"
            onPress={gotoEditScreen}
          >
            <Image source={CreateNoteImage} resizeMode="contain" />
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
        <View
          style={styles.buttons}
          onTouchEndCapture={() => {
            console.log("back");
            onCancel();
          }}
        >
          <View style={styles.goBack}>
            <Image source={goBackImage} style={styles.goBackImage} />
          </View>
          <View style={styles.title}>
            <Text style={styles.titleText}>{targetName}</Text>
          </View>
          <View
            onTouchEndCapture={() => {
              console.log("close");
              navigation.navigate("Map");
            }}
            style={styles.goHome}
          >
            <View style={{ position: "relative" }}>
              <Image style={styles.goHomeImage} source={closeImage} />
              <Image style={styles.goHomeImage} source={closeImage1} />
            </View>
          </View>
        </View>
        <View
          style={{
            position: "absolute",
            top: 30,
            left: 0,
            width: 60,
            height: 50,
            paddingTop: 5,
          }}
        />
        <View
          style={{ position: "absolute", top: 85, width: "100%", height: 600 }}
        >
          <RecordFlatList
            recordDataSource={Object.values(masterDataSource)}
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
          }}
          underlayColor="blue"
          onPress={gotoEditScreen}
        >
          <Image source={CreateNoteImage} resizeMode="contain" />
        </TouchableHighlight>
      </View>
    );
  }
};

const BottomSheet = ({
  onRemove,
  onDisplay,
  onCancel,
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
          onRemove();
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
          onRemove={() => onRemove()}
          onDisplay={() => onDisplay()}
          onCancel={() => onCancel()}
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
    toggleAnimation3();
  }, []);
  const toggleAnimation1 = () => {
    //bottomsheet가 -650일 때  안 보이게 하기
    const val = -1000;
    Animated.timing(showAnimation, {
      useNativeDriver: false,
      toValue: val,
      duration: 350,
    }).start();
    setAnimationValue(val);
  };
  const toggleAnimation2 = () => {
    //bottomsheet가 -650일 때 터치해서 전체 화면으로 올리기
    const val2 = 0;
    Animated.timing(showAnimation, {
      useNativeDriver: false,
      toValue: val2,
      duration: 350,
    }).start();
    setAnimationValue(val2);
  };
  const toggleAnimation3 = () => {
    //bottomsheet가 -1000일 때 보이게 하기, bottomsheet가 0일 때 뒤로 가기 버튼 눌러서 보이게만 하기
    const val3 = -692;
    Animated.timing(showAnimation, {
      useNativeDriver: false,
      toValue: val3,
      duration: 350,
    }).start();
    setAnimationValue(val3);
  };
  return (
    <View>
      <BottomSheet
        onRemove={() => {
          toggleAnimation1();
        }}
        onDisplay={() => {
          toggleAnimation2();
        }}
        onCancel={() => {
          toggleAnimation3();
        }}
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
