import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import * as Location from "expo-location";
import { getDatabase, ref, onValue } from "firebase/database";
import React, { useEffect, useState, useContext } from "react";
import {
  Image,
  StyleSheet,
  View,
  SafeAreaView,
  Button,
  Animated,
  TouchableOpacity,
  Text,
} from "react-native";
import Geocoder from "react-native-geocoding";
import MapView, { Marker } from "react-native-maps";
import { Easing } from "react-native-reanimated";

import CreateNote from "../assets/icons/createNote.svg";
import SearchMain from "../assets/icons/searchMain.svg";
import SearchBox from "../assets/image/searchBox.svg";
import Marker1 from "../assets/markers/marker#4F92D9.svg";
import NewMarker from "../assets/markers/newMarker.svg";
import TargetMarker from "../assets/markers/selectedMarker.svg";
import AppContext from "../components/AppContext";
import RecordMarker from "../components/RecordMarker";
import GeneratePushToken from "../modules/GeneratePushToken";

const myLocationImage = require("../assets/icons/myLocation.png");
const mapStyle = require("../assets/mapDesign.json");

const SearchView = ({ navigation, origin }) => {
  return (
    <View
      style={{
        width: 344,
        height: 48,
        flexDirection: "row",
        left: 23,
        top: 36,
        position: "absolute",
        alignItems: "center",
      }}
      onTouchEndCapture={() =>
        navigation.navigate("MapSearchScreen1", {
          latitude: origin.latitude,
          longitude: origin.longitude,
        })
      }
    >
      <SearchBox style={{ position: "absolute" }} />
      <SearchMain style={{ position: "relative", left: 12 }} />
      <Text style={{ left: 20, fontSize: 16, color: "#DDDFE9" }}>
        열람하고 싶은 장소를 검색하세요
      </Text>
    </View>
  );
};
// Tutorial Reload
const storeData = async (value) => {
  try {
    await AsyncStorage.setItem("tutorial", value);
  } catch (e) {
    //
  }
};

const getData = async () => {
  try {
    const value = await AsyncStorage.getItem("tutorial");
    if (value !== null) {
    }
  } catch (e) {
    //
  }
};

const gotoTutorial = ({ navigation, onChangeGetPermissions }) => {
  navigation.navigate("TutorialScreen", {
    onChangeGetPermissions,
  });
};

const targetingFromLocation = ({
  lctn,
  name,
  setOrigin,
  setTarget,
  setTargetShown,
}) => {
  Geocoder.from(lctn)
    .then((json) => {
      const addressComponent = json.results[0].formatted_address;
      setOrigin({
        latitude: lctn.latitude,
        longitude: lctn.longitude,
        latitudeDelta: 0.0016,
        longitudeDelta: 0.0012,
      });
      setTarget({
        name,
        address: addressComponent,
        id: json.results[0].place_id,
        lctn: { latitude: lctn.latitude, longitude: lctn.longitude },
      });
      setTargetShown(true);
    })
    .catch((error) => console.warn(error));
};

async function getLocationPermission({ setCurrent, setOrigin }) {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    alert("Permission denied");
    return;
  }
  const location = await Location.getCurrentPositionAsync({});
  setCurrent({
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  });
  setOrigin((prev) => ({
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    latitudeDelta: 0.0016,
    longitudeDelta: 0.0012,
  }));
}

const rotateValueHolder = new Animated.Value(0);

const CurrentRotate = (isFocused) => {
  if (isFocused) {
    rotateValueHolder.setValue(0);
    Animated.loop(
      Animated.timing(rotateValueHolder, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
      { iteration: 4 }
    ).start();
  }
};

const RotateData = rotateValueHolder.interpolate({
  inputRange: [0, 1],
  outputRange: ["0deg", "360deg"],
});

const MapScreen = ({ navigation }) => {
  const myContext = useContext(AppContext);
  const myUID = myContext.myUID;
  const isFocused = useIsFocused();
  const [list1, setList1] = useState({});
  const [getPermissions, setGetPermissions] = useState(false);

  const mapRef = React.createRef();
  const [origin, setOrigin] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0016,
    longitudeDelta: 0.0012,
  }); //현재 스크린에 나타나는 map의 중앙 좌표값
  const [current, setCurrent] = useState({ latitude: 0, longitude: 0 }); //내 위치 좌표
  const [target, setTarget] = useState({
    name: "",
    address: "",
    id: "",
    lctn: { latitude: 0, longitude: 0 },
  }); //검색 target의 좌표
  const [targetShown, setTargetShown] = useState(false);
  const onChangeGetPermissions = (b) => {
    setGetPermissions(b);
  };

  useEffect(() => {
    if (getPermissions) {
      Geocoder.init("AIzaSyDBq4tZ1QLm1R7iPH8O4dTvebVGWgkRPks", {
        language: "kor",
      });
      GeneratePushToken(myUID);
      getLocationPermission({ setCurrent, setOrigin });
    }
  }, [getPermissions]);

  useEffect(() => {
    // go to place info bottom sheet
    if (targetShown) {
      navigation.navigate("PlaceInfoBottomSheetScreen", {
        targetName: target.name,
        targetAddress: target.address,
        targetId: target.id,
        targetLctn: target.lctn,
      });
    }
  }, [targetShown]);

  useEffect(() => {
    // earse Target marker when come back from other screen
    if (targetShown && isFocused) setTargetShown(false);
  }, [isFocused]);

  useEffect(() => {
    // earse Target marker when come back from other screen
    if (targetShown && isFocused) setTargetShown(false);
  }, [isFocused]);
  useEffect(() => {
    // get record data
    const db = getDatabase();
    onValue(ref(db, "/users/" + myUID + "/folderIDs"), (snapshot) => {
      if (snapshot.val() != null) {
        const folderIDList1 = Object.keys(snapshot.val());
        folderIDList1.map((folderID) => {
          onValue(
            ref(db, "/folders/" + folderID + "/placeRecords"),
            (snapshot2) => {
              if (snapshot2.val() != null) {
                const placeRecordList1 = Object.values(snapshot2.val());
                placeRecordList1.map((placeRecord1) => {
                  const recordIDList1 = Object.keys(placeRecord1);
                  recordIDList1.map((recordID) => {
                    onValue(
                      ref(db, "/records/" + recordID + "/folderID"),
                      (snapshotFolder) => {
                        const folderID = snapshotFolder.val();
                        onValue(
                          ref(db, "/folders/" + folderID + "/folderColor"),
                          (snapshotColor) => {
                            if (snapshotColor.val() != null) {
                              const color = Object.values(
                                snapshotColor.val()
                              )[0];

                              onValue(
                                ref(db, "/records/" + recordID + "/writeDate"),
                                (snapshotDate) => {
                                  if (
                                    snapshotDate.val() != null &&
                                    snapshotDate.val().year != null &&
                                    snapshotDate.val().year !== undefined
                                  ) {
                                    const date = new Date(
                                      snapshotDate.val().year,
                                      snapshotDate.val().month - 1,
                                      snapshotDate.val().day,
                                      snapshotDate.val().hour,
                                      snapshotDate.val().minute
                                    );
                                    onValue(
                                      ref(db, "/records/" + recordID + "/lctn"),
                                      (snapshot3) => {
                                        setList1((list1) => ({
                                          ...list1,
                                          [recordID]: {
                                            recordID,
                                            lctn: snapshot3.val(),
                                            color,
                                            date,
                                          },
                                        }));
                                      }
                                    );
                                  }
                                }
                              );
                            }
                          }
                        );
                      }
                    );
                  });
                });
              }
            }
          );
        });
      }
    });
  }, [isFocused]);

  useEffect(() => {
    if (getData == null) {
      gotoTutorial({ navigation, onChangeGetPermissions });
      storeData("true");
    } else {
      onChangeGetPermissions(true);
    }
    CurrentRotate(isFocused); //나중에 혹시나 수정 필요
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        provider="google"
        ref={mapRef}
        style={styles.map}
        customMapStyle={mapStyle}
        region={{
          latitude: origin.latitude,
          longitude: origin.longitude,
          latitudeDelta: origin.latitudeDelta,
          longitudeDelta: origin.longitudeDelta,
        }}
        onRegionChangeComplete={(region) => {
          if (region !== undefined) {
            setOrigin({
              latitude: region.latitude,
              longitude: region.longitude,
              latitudeDelta: region.latitudeDelta,
              longitudeDelta: region.longitudeDelta,
            });
          }
        }}
        onPoiClick={(data) => {
          console.log("Poi click");
          targetingFromLocation({
            lctn: data.nativeEvent.coordinate,
            name: data.nativeEvent.name.split("\n")[0],
            setOrigin,
            setTarget,
            setTargetShown,
          });
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
        <Marker coordinate={target.lctn} opacity={targetShown ? 100 : 0}>
          <TargetMarker />
        </Marker>

        <View
          style={{
            position: "absolute",
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
            left: 319,
            bottom: 112,
          }}
          onTouchEndCapture={() => {
            console.log("create note !!");
          }}
        >
          <CreateNote />
        </View>
        <View
          style={{
            position: "absolute",
            width: 48,
            height: 48,
            borderRadius: 24,
            left: 23,
            bottom: 112,
            backgroundColor: "white",
          }}
          onTouchEndCapture={() => {
            mapRef.current.animateToRegion({
              latitude: current.latitude,
              longitude: current.longitude,
              latitudeDelta: 0.0016,
              longitudeDelta: 0.0012,
            });
          }}
        >
          <Animated.Image
            source={myLocationImage}
            resizeMode="contain"
            style={{
              position: "absolute",
              width: 48,
              height: 48,
              borderRadius: 15,
              transform: [{ rotate: RotateData }],
            }}
          />
        </View>
        <View
          style={{
            position: "absolute",
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
            left: 319,
            bottom: 112,
            backgroundColor: "red",
          }}
          onTouchEndCapture={() => {
            console.log("create note !!");
          }}
        >
          <CreateNote />
        </View>
        <RecordMarker recordData={list1} origin={origin} />
      </MapView>
      <SearchView navigation={navigation} origin={origin} />
    </SafeAreaView>
  );
};

export default MapScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "stretch",
    justifyContent: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  currentLocationImage: {
    position: "absolute",
    width: 30,
    height: 30,
    borderRadius: 15,
    left: 330,
    top: 608,
    tintColor: "grey",
  },
});
