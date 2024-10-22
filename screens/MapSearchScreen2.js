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
  Dimensions,
} from "react-native";
import Geocoder from "react-native-geocoding";
import MapView, { Marker } from "react-native-maps";

const screenHeight = Dimensions.get("window").height;

function toDPHeight(x) {
  const heightPixels = (screenHeight * x) / 844;
  console.log(screenHeight);
  console.log(heightPixels);
  return heightPixels;
}

import { useUserQuery, useRecordQueries, useAllRecordQuery } from "../queries";

import { CreateNote } from "../components/MapScreen/CreateNote";
import TargetMarker from "../assets/markers/selectedMarker.svg";

import AppContext from "../components/AppContext";
import GoBackHeader from "../components/GoBackHeader";
import RecordFlatList from "../components/StorageScreen/RecordFlatList";
import { useIsFetching } from "react-query";
import { useIsFocused } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

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
  const val3 = -724;
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
}) => {
  const myContext = useContext(AppContext);
  const myUID = myContext.myUID;
  const userQuery = useUserQuery(myUID);
  const allRecordQuery = useAllRecordQuery();

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
            {allRecordQuery.data
              ? Object.values(allRecordQuery.data)
                  .filter((record) => {
                    if (!userQuery.data?.folderIDs && !record.folderID)
                      return record.folderID in userQuery.data?.folderIDs;
                    else return false;
                  })
                  .filter((record) => {
                    return record.placeID === targetId;
                  }).length
              : 0}
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
          placeID={targetId}
          placeName={targetName}
          address={targetAddress}
          lctn={targetLctn}
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
          backgroundColor: "white",
          top: -8,
        }}
      >
        <GoBackHeader
          navigation={navigation}
          text={targetName}
          rightButton="goHome"
          goBackFunction={() => {
            toggleAnimation3(showAnimation, setAnimationValue);
          }}
        />
        <View
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
          }}
        >
          <RecordFlatList
            recordList={
              allRecordQuery.data && userQuery.data?.folderIDs
                ? Object.entries(allRecordQuery.data).filter(
                    ([key, values]) => {
                      return (
                        values.folderID in userQuery.data?.folderIDs &&
                        values.placeID === targetId
                      );
                    }
                  )
                : []
            } /// 수정필요
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
  animationVal,
  setAnimationValue,
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
          height: toDPHeight(884),
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
        />
      </Animated.View>
    </View>
  );
};

const MapSearchScreen2 = ({ navigation, route }) => {
  console.log("MapSearchScreen2", route.params);
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
    address: route.params.address || route.params.formatted_address,
    id: route.params.id || route.params.place_id,
  });

  const [targetShown, setTargetShown] = useState(true);

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

  return (
    <View>
      <GoBackHeader
        navigation={navigation}
        text={target.name}
        rightButton="goHome"
      />
      <MapView
        onRegionChangeComplete={onRegionChangeComplete}
        showsBuildings={false}
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

export default MapSearchScreen2;
/** */
