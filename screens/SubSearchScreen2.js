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

import { useUserQuery, useRecordQueries, useRecordIDListQuery } from "../queries";

import TargetMarker from "../assets/markers/selectedMarker.svg";

import AppContext from "../components/AppContext";
import GoBackHeader from "../components/GoBackHeader";
import RecordMarker from "../components/MapScreen/RecordMarker";
import RecordFlatList from "../components/StorageScreen/RecordFlatList";
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
  const val2 = 0;
  Animated.timing(showAnimation, {
    useNativeDriver: false,
    toValue: val2,
    duration: 350,
  }).start();
  setAnimationValue(val2);
};
const toggleAnimation3 = (showAnimation, setAnimationValue) => {
  const val3 = -588;
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
}) => {
  const myContext = useContext(AppContext);
  const myUID = myContext.myUID;
  const userQuery = useUserQuery(myUID);

  const folderIDList = userQuery.data?.folderIDs ? Object.keys(userQuery.data.folderIDs) : []
  const { data: recordIDList } = useRecordIDListQuery(folderIDList)
  const recordQueries = useRecordQueries(recordIDList ? recordIDList : [])
  const recordObjLists = recordIDList ?
    recordIDList.reduce((acc, curr, idx) => {
      return [...acc, [curr, recordQueries[idx]?.data]]
    }, new Array)
    :
    []

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
          기록{" "}
          {
            //박정인 점검 필요
            Object.values(
              recordObjLists
                ? recordObjLists
                  .filter((record) => {
                    return record?.folderID in userQuery.data?.folderIDs;
                  })
                  .filter((record) => {
                    return record?.placeID === targetId;
                  })
                : []
            ).length
          }
        </Text>
      </View>
      <BottomButton
        onPressFunction={() => {
          setPlaceID(targetId);
          setPlaceName(targetName);
          setAddress(targetAddress);
          setLctn(targetLctn);
          navigation.pop(2);
        }}
        text="장소 선택"
        style={{ top: 168 }}
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
        />
      </Animated.View>
    </View>
  );
};

const SubSearchScreen2 = ({ navigation, route }) => {
  const [animationValue, setAnimationValue] = useState(0);
  const showAnimation = useRef(new Animated.Value(animationValue)).current;

  const mapRef = React.createRef();
  const [target, setTarget] = useState({
    lctn: {
      latitude: route.params.details.geometry.location.lat,
      longitude: route.params.details.geometry.location.lng,
    },
    latitudeDelta: 0.0016,
    longitudeDelta: 0.0012,
    name: route.params.details.name,
    address:
      route.params.details.address || route.params.details.formatted_address,
    id: route.params.details.id || route.params.details.place_id,
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
        setPlaceID={(f) => route.params.setPlaceID(f)}
        setPlaceName={(f) => route.params.setPlaceName(f)}
        setAddress={(f) => route.params.setAddress(f)}
        setLctn={(f) => route.params.setLctn(f)}
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
