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
  Text,
  View,
  TouchableHighlight,
  Button,
  Image,
} from "react-native";

import AppContext from "../components/AppContext";
import RecordFlatList from "../components/RecordFlatList";

const CreateNoteImage = require("../assets/image/CreateNote.png");

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
  if (animationVal < 0) {
    return (
      //bottomsheet가 전체 화면을 덮기 전
      <View style={{ position: "absolute", width: "100%", height: "100%" }}>
        <View
          style={{ position: "absolute", width: "75%", height: "100%" }}
          onTouchEndCapture={() => onDisplay()}
        >
          <Text style={{ position: "absolute", top: 20, fontSize: 20 }}>
            {targetName}
          </Text>
          <Text style={{ position: "absolute", top: 80, fontSize: 15 }}>
            {targetAddress}
          </Text>
        </View>
        <View
          style={{ position: "absolute", right: 0, width: "25%", height: "8%" }}
          onTouchEndCapture={() => onDisplay()}
        />
        <View
          style={{
            position: "absolute",
            top: "8%",
            right: 0,
            width: "25%",
            height: "10%",
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
            underlayColor="blue"
            onPress={gotoEditScreen}
          >
            <Image source={CreateNoteImage} resizeMode="contain" />
          </TouchableHighlight>
        </View>
      </View>
    );
  } else {
    // TODO (@KhoDongwook) hook 루트로 빼기
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [masterDataSource, setMasterDataSource] = useState([]); //shortened record가 쌓여있음 {recordID, title, folderID, placeName, date, text, photos}
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      const db = getDatabase();
      onValue(ref(db, "/users/" + myUID + "/folderIDs"), (snapshot) => {
        if (snapshot.val() != null) {
          //한 user가 folder를 갖고 있지 않을 수 있어!!
          const folderIDList = Object.keys(snapshot.val()); //folderIDList 만들기
          setMasterDataSource([]); //initializing masterDataSource
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
                        setMasterDataSource((prev) => [
                          ...prev,
                          { recordID, recordData: snapshot3.val() },
                        ]); //{recordID: recordID, recordData:{title: ~~, date: ~~, lctn: ~~, text: ~~, placeName: ~~}}가 쌓여있음
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

    return (
      //bottomsheet가 전체 화면을 덮은 후
      <View style={{ position: "absolute", width: "110%", height: "100%" }}>
        <View
          style={{
            position: "absolute",
            top: 30,
            left: 0,
            width: 60,
            height: 50,
            paddingTop: 5,
          }}
        >
          <Button title="back" onPress={() => onCancel()} />
        </View>
        <View
          style={{
            position: "absolute",
            top: 45,
            width: "50%",
            height: 40,
            alignSelf: "center",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              textAlignVertical: "center",
              marginTop: 4,
              fontSize: 25,
            }}
          >
            {targetName}
          </Text>
        </View>
        <View
          style={{ position: "absolute", top: 85, width: "100%", height: 600 }}
        >
          <RecordFlatList
            recordDataSource={masterDataSource}
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
    <View style={{ width: "100%", height: "100%" }}>
      <View
        style={{ width: "100%", height: "76%" }}
        onTouchEndCapture={() => {
          onRemove();
          navigation.goBack();
        }}
      />
      <Animated.View
        style={{
          width: "100%",
          backgroundColor: "#fff",
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          padding: 20,
          position: "absolute",
          zIndex: 4,
          alignItems: "center",
          justifyContent: "center",
          height: 850, //조정 필요
          shadowOffset: {
            width: 0,
            height: 12,
          },
          shadowOpacity: 0.58,
          shadowRadius: 16.0,
          bottom: animation,
          elevation: 24,
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
  console.log(route);
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
    const val3 = -650;
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

export default PlaceInfoBottomSheet;
