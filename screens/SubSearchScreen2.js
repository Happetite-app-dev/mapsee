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

import { useUserQuery, useAllRecordQuery } from "../queries";

import TargetMarker from "../assets/markers/selectedMarker.svg";

import AppContext from "../components/AppContext";
import GoBackHeader from "../components/GoBackHeader";
import BottomButton from "../components/BottomButton";

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
  const val2 = -660;
  Animated.timing(showAnimation, {
    useNativeDriver: false,
    toValue: val2,
    duration: 350,
  }).start();
  setAnimationValue(val2);
};
const toggleAnimation3 = (showAnimation, setAnimationValue) => {
  const val3 = -660;
  Animated.timing(showAnimation, {
    useNativeDriver: false,
    toValue: val3,
    duration: 350,
  }).start();
  setAnimationValue(val3);
};

const BottomSheetScreen = ({
  showAnimation,
  animationVal,
  setAnimationValue,
  targetName,
  targetAddress,
  targetId,
  targetLctn,
  navigation,

  setPlaceID,
  setPlaceName,
  setAddress,
  setLctn,

  fromThree,
}) => {
  const myContext = useContext(AppContext);
  const myUID = myContext.myUID;
  const userQuery = useUserQuery(myUID);

  const allRecordQuery = useAllRecordQuery();

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
        onTouchEndCapture={() => {
          toggleAnimation2(showAnimation, setAnimationValue);
        }}
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
          기록{" "}
          {
            Object.values(
              allRecordQuery.data
                ? Object.values(allRecordQuery.data)
                    .filter((record) => {
                      return record.folderID in userQuery.data?.folderIDs;
                    })
                    .filter((record) => {
                      return record.placeID === targetId;
                    })
                : []
            ).length
          }
        </Text>
      </View>
      <BottomButton
        onPressFunction={() => {
          console.log(targetId);
          setPlaceID(targetId);
          setPlaceName(targetName);
          setAddress(targetAddress);
          setLctn(targetLctn);
          navigation.pop(fromThree ? 3 : 2);
        }}
        text="장소 선택"
        style={{ top: 136 }}
      />
    </View>
  );
};

const BottomSheet = ({
  showAnimation,
  animationVal,
  setAnimationValue,
  targetName,
  targetAddress,
  targetId,
  targetLctn,
  navigation,
  setPlaceID,
  setPlaceName,
  setAddress,
  setLctn,
  fromThree,
}) => {
  return (
    <View>
      <Animated.View
        style={{
          width: "100%",
          height: 884,
          backgroundColor: "white",
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          position: "absolute",
          bottom: showAnimation,
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
          showAnimation={showAnimation}
          animationVal={animationVal}
          setAnimationValue={setAnimationValue}
          targetName={targetName}
          targetAddress={targetAddress}
          targetId={targetId}
          targetLctn={targetLctn}
          navigation={navigation}
          setPlaceID={(f) => setPlaceID(f)}
          setPlaceName={(f) => setPlaceName(f)}
          setAddress={(f) => setAddress(f)}
          setLctn={(f) => setLctn(f)}
          fromThree={fromThree}
        />
      </Animated.View>
    </View>
  );
};

const SubSearchScreen2 = ({ navigation, route }) => {
  console.log("SubSearchScreen2", route.params);
  const [animationValue, setAnimationValue] = useState(0);
  //console.log(route.params.details);
  const showAnimation = useRef(new Animated.Value(animationValue)).current;

  const mapRef = React.createRef();

  const [target, setTarget] = useState({
    lctn: {
      latitude:
        //route.params.geometry.location?.lat ||
        route.params.details.geometry.location.lat,
      longitude:
        //route.params.geometry.location?.lng ||
        route.params.details.geometry.location.lng,
    },
    latitudeDelta: 0.0016,
    longitudeDelta: 0.0012,
    //route.params.name ||
    name: route.params.details.name,
    //route.params.address ||
    address: route.params.details.formatted_address,
    //route.params.id ||
    id: route.params.details.place_id,
  });
  const [targetShown, setTargetShown] = useState(true);
  const [region, setRegion] = useState({
    latitude: target.lctn.latitude,
    longitude: target.lctn.longitude,
    latitudeDelta: target.latitudeDelta,
    longitudeDelta: target.longitudeDelta,
  });

  const [loaded, setLoaded] = useState(false);
  const onRegionChangeComplete = (region) => {
    if (!loaded) {
      if (
        region.latitude != region.latitude ||
        region.longitude != region.longitude
      ) {
        mapRef.animateToRegion(region, 1);
      }
      setLoaded(true);
    }
  };

  useEffect(() => {
    toggleAnimation3(showAnimation, setAnimationValue);
  }, []);
  useEffect(() => {
    if (targetShown === false)
      toggleAnimation1(showAnimation, setAnimationValue);
  }, [targetShown]);
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
      <GoBackHeader
        navigation={navigation}
        text={target.name}
        rightButton="goHome"
      />
      <MapView
        showsBuildings={false}
        customMapStyle={mapStyle}
        provider="google"
        ref={mapRef}
        style={styles.map}
        region={region}
        onRegionChangeComplete={onRegionChangeComplete}
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
        <Marker
          coordinate={target.lctn}
          opacity={targetShown ? 100 : 0}
          style={{ position: "relative" }}
        >
          <TargetMarker />
        </Marker>
      </MapView>

      <BottomSheet
        showAnimation={showAnimation}
        animationVal={animationValue}
        setAnimationValue={(val) => setAnimationValue(val)}
        targetName={target.name}
        targetAddress={target.address}
        targetId={target.id}
        targetLctn={target.lctn}
        navigation={navigation}
        setPlaceID={(f) => route.params.setPlaceID(f)}
        setPlaceName={(f) => route.params.setPlaceName(f)}
        setAddress={(f) => route.params.setAddress(f)}
        setLctn={(f) => route.params.setLctn(f)}
        fromThree={route.params.fromThree}
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
    height: 756,
    marginTop: 0,
  },
});

export default SubSearchScreen2;
