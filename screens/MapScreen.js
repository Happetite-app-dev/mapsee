import { API_KEY } from "@env";
import {
  useNavigation,
  useFocusEffect,
  useIsFocused,
} from "@react-navigation/native";
import * as Location from "expo-location";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  remove,
  off,
} from "firebase/database";
import React, { useEffect, useState, useContext } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Button,
  Animated,
  TouchableOpacity,
} from "react-native";
import Geocoder from "react-native-geocoding";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Easing } from "react-native-reanimated";

import AppContext from "../components/AppContext";
import PlaceInfoBottomSheet from "../components/PlaceInfoBottomSheet";
import GeneratePushToken from "../modules/GeneratePushToken";

const currentLocationImage = require("../assets/image/currentLocation.png");
const findCurrentLocationImage = require("../assets/image/findCurrentLocation.png");
const targetLocationImage = require("../assets/image/targetLocation.png");
/*import AsyncStorage from '@react-native-async-storage/async-storage';

const storeData = async (value) => {
  try {
    await AsyncStorage.setItem('@tutorial', value)
  } catch (e) {
    // saving error
  }
}


const getData = async () => {
  try {
    const value = await AsyncStorage.getItem('@tutorial')
    if(value !== null) {
      return value;
    }
    return false;
  } catch(e) {
    // error reading value
  }
}*/

const MapScreen = ({ navigation }) => {
  //1번에 대한 코드
  const myContext = useContext(AppContext);
  const myUID = myContext.myUID;
  const isFocused = useIsFocused();
  const [list1, setList1] = useState([]);

  const gotoTutorial = () => {
    navigation.navigate("TutorialScreen");
  };

  useEffect(() => {
    //console.log(getData());
    if (true) {
      gotoTutorial(); //"각종 알림 권한 허용 팝업"이랑 "튜토리얼 창"을 synchronous하게 맞출 필요가 있어 보여요.
    }
  }, []);

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
  const [isShowBottomSheet, setIsShowBottomSheet] = useState(false);

  useEffect(() => {
    Geocoder.init("AIzaSyDBq4tZ1QLm1R7iPH8O4dTvebVGWgkRPks", {
      language: "kor",
    });
    getLocationPermission();
  }, []);

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

  const targetingFromAddress = async (address, name) => {
    try {
      const json = await Geocoder.from(address);
      const location = json.results[0].geometry.location;
      const lat = location.lat;
      const lng = location.lng;
      setOrigin({
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.0016,
        longitudeDelta: 0.0012,
      });
      setTarget({
        name,
        address,
        id: json.results[0].place_id,
        lctn: { latitude: lat, longitude: lng },
      });
      setTargetShown(true);
    } catch (e) {
      console.warn(e);
    }
  };

  const targetingFromLocation = (lctn, name) => {
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

  async function getLocationPermission() {
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

  const RotateData = rotateValueHolder.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  //------------//Rotate Image//------------//

  return (
    <SafeAreaView style={styles.container}>
      <GeneratePushToken />
      <Button
        onPress={() => navigation.navigate("TutorialScreen")}
        title="Tutorial"
      />
      <MapView
        provider="google"
        ref={mapRef}
        style={styles.map}
        region={{
          latitude: origin.latitude,
          longitude: origin.longitude,
          latitudeDelta: origin.latitudeDelta,
          longitudeDelta: origin.longitudeDelta,
        }}
        onRegionChangeComplete={(region) => {
          if (region != undefined) {
            setOrigin({
              latitude: region.latitude,
              longitude: region.longitude,
              latitudeDelta: region.latitudeDelta,
              longitudeDelta: region.longitudeDelta,
            });
          }
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
        <Button
          onPress={() => navigation.navigate("MapSearchScreen1")}
          title="Search"
          style={{
            position: "absolute",
            bottom: 100,
            left: 50,
          }}
        />
        <Marker coordinate={current}>
          <Image
            source={currentLocationImage}
            style={{
              width: 25,
              height: 25,
              resizeMode: "contain",
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
        {list1.map((record) => {
          <Marker
            coordinate={record.lctn}
            onPress={({ nativeEvent }) => {
              // TODO (@KhoDongwook) 함수 처리
              // setIsShowRecord(true);
              // showRecord(nativeEvent.id);
            }}
          >
            {" "}
            //isShowRecord라는 useState변수를 만들고, 기록마커를 누르면
            isShowRecord가 true가 되도록 함
            <Image
              source={targetLocationImage}
              style={{
                width: 37,
                height: 37,
                resizeMode: "contain",
                tintColor: "blue",
              }}
            />
          </Marker>;
        })}
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
