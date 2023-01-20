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
} from "react-native";
import Geocoder from "react-native-geocoding";
import MapView, { Marker } from "react-native-maps";
import { Easing } from "react-native-reanimated";

import Marker1 from "../assets/markers/marker#4F92D9.svg";
import NewMarker from "../assets/markers/newMarker.svg";
import AppContext from "../components/AppContext";
import PlaceInfoBottomSheet from "../components/PlaceInfoBottomSheet";
import GeneratePushToken from "../modules/GeneratePushToken";

const currentLocationImage = require("../assets/image/currentLocation.png");
const findCurrentLocationImage = require("../assets/image/findCurrentLocation.png");
const targetLocationImage = require("../assets/image/targetLocation.png");
const mapStyle = require("../assets/mapDesign.json");

// date & colors array
const now = new Date();
const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

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
  }, []);

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
      <Button
        onPress={() =>
          navigation.navigate("MapSearchScreen1", {
            latitude: origin.latitude,
            longitude: origin.longitude,
          })
        }
        title="Search"
        style={{
          position: "absolute",
          bottom: 100,
          left: 50,
        }}
      />
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
        <Marker coordinate={current}>
          <Image
            source={currentLocationImage}
            style={{
              width: 25,
              height: 25,
              resizeMode: "contain",
              zIndex: 5,
            }}
          />
        </Marker>
        <Marker coordinate={target.lctn} opacity={targetShown ? 100 : 0}>
          <Image
            source={targetLocationImage}
            style={{
              width: 37,
              height: 37,
              resizeMode: "contain",
              tintColor: "blue",
              zIndex: 10,
            }}
          />
        </Marker>
        <View
          style={{
            position: "absolute",
            width: 40,
            height: 40,
            borderRadius: 20,
            right: 25,
            bottom: 120,
            backgroundColor: "white",
          }}
        >
          <TouchableOpacity
            style={{
              position: "absolute",
              width: 40,
              height: 40,
              borderRadius: 20,
              left: 325,
              top: 603,
            }}
            activeOpacity={1}
            onPress={() => {
              mapRef.current.animateToRegion({
                latitude: current.latitude,
                longitude: current.longitude,
                latitudeDelta: 0.0016,
                longitudeDelta: 0.0012,
              });
            }}
          />
          <Animated.Image
            source={findCurrentLocationImage}
            resizeMode="contain"
            style={{
              position: "absolute",
              width: 30,
              height: 30,
              borderRadius: 15,
              left: 330,
              top: 608,
              tintColor: "grey",
              transform: [{ rotate: RotateData }],
            }}
          />
        </View>
        {list1 == null || list1 === undefined ? (
          <></>
        ) : (
          Object.values(list1).map((record) => {
            const showMarker = Math.random();
            const dayDiff = (record.date - currentDate) / (1000 * 60 * 60 * 24);
            const color = record.color;

            return (
              <Marker
                // key={record.recordID}
                key={record.recordID}
                coordinate={record.lctn}
                opacity={
                  origin.latitudeDelta < 0.01 || showMarker > 0.5 ? 100 : 0
                }
                style={{ zIndex: 2 }}
              >
                {dayDiff <= 3 ? (
                  <Image
                    source={targetLocationImage}
                    style={{
                      width: 37,
                      height: 37,
                      resizeMode: "contain",
                      tintColor: color,
                      zIndex: 10,
                    }}
                  />
                ) : (
                  <Image
                    source={{ targetLocationImage }}
                    style={{ tintColor: color, backgroundColor: "red" }}
                  />
                )}
              </Marker>
            );
          })
        )}
      </MapView>
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
