import { getDatabase, ref, onValue } from "firebase/database";
import React, {
  useEffect,
  useRef,
  useState,
  useContext,
  TouchableOpacity,
} from "react";
import {
  StyleSheet,
  Animated,
  Text,
  View,
  TouchableHighlight,
  Button,
  Image,
} from "react-native";
import Geocoder from "react-native-geocoding";
import MapView, { Marker } from "react-native-maps";

import Close from "../assets/icons/close.svg";
import CreateNote from "../assets/icons/createNote.svg";
import GoBack from "../assets/icons/goBack.svg";
import SelectedMarker1 from "../assets/icons/selectedMarker1.svg";
import SelectedMarker2 from "../assets/icons/selectedMarker2.svg";
import AppContext from "../components/AppContext";
import GoBackHeader from "../components/GoBackHeader";
import RecordFlatList from "../components/RecordFlatList";

const bottomSheetImage = require("../assets/image/bottomSheetScroll.png");
const mapStyle = require("../assets/mapDesign.json");

const toggleAnimation1 = (showAnimation, setAnimationValue) => {
  const val = -1000;
  Animated.timing(showAnimation, {
    useNativeDriver: false,
    toValue: val,
    duration: 350,
  }).start();
  setAnimationValue(val);
};
const toggleAnimation2 = (showAnimation, setAnimationValue) => {
  const val2 = 0;
  Animated.timing(showAnimation, {
    useNativeDriver: false,
    toValue: val2,
    duration: 350,
  }).start();
  setAnimationValue(val2);
};
const toggleAnimation3 = (showAnimation, setAnimationValue) => {
  const val3 = -692;
  Animated.timing(showAnimation, {
    useNativeDriver: false,
    toValue: val3,
    duration: 350,
  }).start();
  setAnimationValue(val3);
};

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
                    if (
                      snapshot3.val() != (null || undefined) &&
                      (snapshot3.val().placeName.includes(targetName) ||
                        targetName.includes(snapshot3.val().placeName) ||
                        snapshot3.val().placeName == targetName)
                    ) {
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
            <CreateNote resizeMode="contain" />
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
            <GoBack style={styles.goBackImage} />
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
              <Close />
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
          <CreateNote resizeMode="contain" />
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
    <View>
      <Animated.View
        style={{
          width: "100%",
          height: 844,
          backgroundColor: "white",
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          position: "absolute",
          bottom: animation,
          zIndex: 1,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 1,
          borderColor: "#DDDFE9",
          borderRadius: 16,
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

const MapSearchScreen2 = ({ navigation, route }) => {
  const [animationValue, setAnimationValue] = useState(0);

  const showAnimation = useRef(new Animated.Value(animationValue)).current;

  const mapRef = React.createRef();
  const [target, setTarget] = useState({
    lctn: {
      latitude: route.params.geometry.location.lat,
      longitude: route.params.geometry.location.lng,
    },
    latitudeDelta: 0.0016,
    longitudeDelta: 0.0012,
    name: route.params.name,
    address: route.params.address,
    id: route.params.id,
  });

  const [targetShown, setTargetShown] = useState(true);

  useEffect(() => {
    toggleAnimation3(showAnimation, setAnimationValue);
  }, []);
  const targetingFromLocation = (lctn, name) => {
    Geocoder.from(lctn)
      .then((json) => {
        const addressComponent = json.results[0].formatted_address;
        setTarget({
          lctn: { latitude: lctn.latitude, longitude: lctn.longitude },
          latitudeDelta: 0.0016,
          longitudeDelta: 0.0012,
          name,
          address: addressComponent,
          id: json.results[0].place_id,
        });
        setTargetShown(true);
      })
      .catch((error) => console.warn(error));
    toggleAnimation3(showAnimation, setAnimationValue);
  };

  return (
    <View>
      <MapView
        customMapStyle={mapStyle}
        provider="google"
        ref={mapRef}
        style={styles.map}
        region={{
          latitude: target.lctn.latitude,
          longitude: target.lctn.longitude,
          latitudeDelta: 0.0016,
          longitudeDelta: 0.0012,
        }}
        onPoiClick={(data) => {
          targetingFromLocation(
            data.nativeEvent.coordinate,
            data.nativeEvent.name.split("\n")[0]
          );
        }}
        onPress={({ nativeEvent }) => {
          if (
            nativeEvent.action === "marker-press" &&
            nativeEvent.coordinate.latitude === target.lctn.latitude &&
            nativeEvent.coordinate.longitude === target.lctn.longitude
          ) {
            setTargetShown(true);
          } else {
            setTargetShown(false);
          }
        }}
      >
        <GoBackHeader
          navigation={navigation}
          text={target.name}
          RightButton="goHome"
        />

        <Marker
          coordinate={target.lctn}
          opacity={targetShown ? 100 : 0}
          style={{ position: "relative" }}
        >
          <SelectedMarker1 style={{ position: "absolute" }} />
          <SelectedMarker2
            style={{
              position: "absolute",
              marginLeft: 8.89,
              marginTop: 8.89,
            }}
          />
        </Marker>
      </MapView>

      <BottomSheet
        onRemove={() => {
          toggleAnimation1(showAnimation, setAnimationValue);
        }}
        onDisplay={() => {
          toggleAnimation2(showAnimation, setAnimationValue);
        }}
        onCancel={() => {
          toggleAnimation3(showAnimation, setAnimationValue);
        }}
        animation={showAnimation}
        animationVal={animationValue}
        targetName={target.name}
        targetAddress={target.address}
        targetId={target.id}
        targetLctn={target.lctn}
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
    backgroundColor: "#fff",
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
  goHomeImage2: {
    width: 15,
    height: 15,
    position: "absolute",
  },
});

export default MapSearchScreen2;
