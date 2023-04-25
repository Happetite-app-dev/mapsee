import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import * as Location from "expo-location";
import React, { useEffect, useState, useContext } from "react";
import { StyleSheet, View, SafeAreaView, Text } from "react-native";
import Geocoder from "react-native-geocoding";
import MapView, { Marker } from "react-native-maps";

import { useUserQuery, useAllRecordQuery } from "../queries";

import MyLocation from "../assets/icons/Current.svg";
import MyLocationMarker from "../assets/markers/MyLocation-2.svg";
import SearchMain from "../assets/icons/searchMain.svg";
import SearchBox from "../assets/image/searchBox.svg";
import TargetMarker from "../assets/markers/selectedMarker.svg";
import AppContext from "../components/AppContext";
import RecordMarker from "../components/MapScreen/RecordMarker";
import GeneratePushToken from "../modules/GeneratePushToken";
const mapStyle = require("../assets/mapDesign.json");
import { CreateNote } from "../components/MapScreen/CreateNote";

const SearchView = ({ navigation, origin }) => {
  return (
    <View
      style={{
        width: "100%",
        height: 48,
        flexDirection: "row",
        top: "0%",
        alignItems: "center",
        left: 23,
        position: "relative",
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
      <Text
        style={{
          left: 20,
          fontSize: 16,
          color: "#DDDFE9",
          fontFamily: "NotoSansKR-Medium",
        }}
      >
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
    return JSON.parse(value);
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

const MapScreen = ({ navigation }) => {
  const myContext = useContext(AppContext);
  const myUID = myContext.myUID;
  const userQuery = useUserQuery(myUID);

  const allRecordQuery = useAllRecordQuery();

  const isFocused = useIsFocused();
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
    if (!getData()) {
      storeData("true");

      gotoTutorial({ navigation, onChangeGetPermissions });
    } else {
      onChangeGetPermissions(true);
    }
  }, []);

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
      navigation.push("PlaceInfoBottomSheetScreen", {
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

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        showsBuildings={false}
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
        <RecordMarker
          recordData={
            allRecordQuery.data && userQuery.data?.folderIDs
              ? Object.entries(allRecordQuery.data).filter(([key, record]) => {
                  return record.folderID in userQuery.data?.folderIDs;
                })
              : []
          }
          origin={origin}
          onPressFunction={(data, placeName) => {
            targetingFromLocation({
              lctn: data.nativeEvent.coordinate,
              name: placeName,
              setOrigin,
              setTarget,
              setTargetShown,
            });
          }}
        />
        <Marker
          coordinate={target.lctn}
          opacity={targetShown ? 100 : 0}
          style={{ zIndex: 1 }}
        >
          <TargetMarker />
        </Marker>
        <Marker
          coordinate={{
            latitude: current.latitude,
            longitude: current.longitude,
          }}
        >
          <MyLocationMarker style={styles.MyLocationMarker} />
        </Marker>
      </MapView>
      <SearchView navigation={navigation} origin={current} />

      <View
        style={styles.currentLocationButton}
        onTouchEndCapture={() => {
          mapRef.current.animateToRegion({
            latitude: current.latitude,
            longitude: current.longitude,
            latitudeDelta: 0.0016,
            longitudeDelta: 0.0012,
          });
        }}
      >
        <MyLocation style={{ top: 12, left: 12 }} />
      </View>
      <CreateNote
        navigation={navigation}
        isFocused={isFocused}
        style={styles.createNote}
      />
    </SafeAreaView>
  );
};

export default MapScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  map: {
    width: "100%",
    height: "120%",
    position: "absolute",
  },
  currentLocationButton: {
    position: "absolute",
    width: 48,
    height: 48,
    borderRadius: 24,
    left: 23,
    bottom: 112,
    backgroundColor: "white",
    borderColor: "#DDDFE9",
    borderWidth: 1,
  },
  createNote: {
    position: "absolute",
    width: 48,
    height: 48,
    borderRadius: 24,
    left: 319,
    bottom: 112,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.5,
  },
  MyLocationMarker: {
    shadowColor: "#5ED3CC",
    shadowRadius: 3,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
  },
});
