import React, { useRef, useState, useEffect } from "react";
import Geocode from "react-geocode";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableHighlight,
  TextInput,
  Button,
  Animated,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

import SearchMarker from "../assets/markers/searchMarker.svg";
import GoBackHeader from "../components/GoBackHeader";

const bottomSheetImage = require("../assets/image/bottomSheetScroll.png");
const mapStyle = require("../assets/mapDesign.json");

Geocode.setApiKey("AIzaSyDBq4tZ1QLm1R7iPH8O4dTvebVGWgkRPks");
Geocode.setLanguage("ko");

const gotoSearch2Screen = ({
  navigation,
  item,
  setPlaceID,
  setPlaceName,
  setAddress,
  setLctn,
}) => {
  Geocode.fromAddress(item.structured_formatting.main_text).then(
    (response) => {
      const { lat, lng } = response.results[0].geometry.location;
      const newPlace = {
        details: {
          geometry: { location: { lat, lng } },
          name: item.structured_formatting.main_text,
          address: item.structured_formatting.secondary_text,
          id: item.place_id,
        },
        setPlaceID: (f) => setPlaceID(f),
        setPlaceName: (f) => setPlaceName(f),
        setAddress: (f) => setAddress(f),
        setLctn: (f) => setLctn(f),
        fromThree: true,
      };

      navigation.navigate("SubSearchScreen2", newPlace);
    },
    (error) => {
      console.error("cannot move to SubSearchScreen2", error);
    }
  );
};

const getAverage = (numbers) => {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((a, b) => a + b);
  return sum / numbers.length;
};

const getLatDelta = (numbers, average) => {
  if (numbers.length === 0) return 0.016;
  const diff = numbers.map((el) => el - average);
  return 10 * Math.max(...diff);
};

const getLngDelta = (numbers, average) => {
  if (numbers.length === 0) return 0.012;
  const diff = numbers.map((el) => el - average);
  return 10 * Math.max(...diff);
};

const _renderRow = ({
  navigation,
  item,
  setPlaceID,
  setPlaceName,
  setAddress,
  setLctn,
}) => {
  return (
    <TouchableHighlight
      onPress={() =>
        gotoSearch2Screen({
          navigation,
          item,
          setPlaceID,
          setPlaceName,
          setAddress,
          setLctn,
        })
      }
      underlayColor="#c8c7cc"
    >
      <View
        style={{
          flexDirection: "column",
          height: 84,
          marginLeft: 23,
        }}
      >
        <View style={styles.descriptionMainText}>
          <View
            style={{
              height: 24,
              width: item.structured_formatting.main_text.length * 9 + 20,
            }}
          >
            <Text style={{ fontSize: 14, fontFamily: "NotoSansKR-Medium" }}>
              {item.structured_formatting.main_text}
            </Text>
          </View>
          <View style={styles.descriptionType}>
            <Text
              style={{
                fontSize: 10,
                color: "#ADB1C5",
                fontFamily: "NotoSansKR-Light",
              }}
            >
              기타
            </Text>
          </View>
        </View>

        <View style={styles.descriptionSecondaryText}>
          <Text
            style={{
              fontSize: 12,
              color: "#545766",
              fontFamily: "NotoSansKR-Regular",
            }}
          >
            {item.structured_formatting.secondary_text}
          </Text>
        </View>
      </View>
    </TouchableHighlight>
  );
};

const BottomSheet = ({
  navigation,
  animation,
  name,
  data,
  setPlaceID,
  setPlaceName,
  setAddress,
  setLctn,
}) => {
  return (
    <Animated.View
      style={{
        width: "100%",
        backgroundColor: "white",
        height: 433,

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
      <View style={{ marginTop: 8, zIndex: 1 }}>
        <Image source={bottomSheetImage} />
      </View>
      <FlatList
        data={data}
        renderItem={({ item }) =>
          _renderRow({
            navigation,
            item,
            setPlaceID: (f) => setPlaceID(f),
            setPlaceName: (f) => setPlaceName(f),
            setAddress: (f) => setAddress(f),
            setLctn: (f) => setLctn(f),
          })
        }
        style={{ width: "100%", height: "100%" }}
        scrollEnabled
      />
    </Animated.View>
  );
};

const SubSearchScreen3 = ({ navigation, route }) => {
  const mapRef = React.createRef();
  const [origin, setOrigin] = useState([0, 0]);
  const [delta, setDelta] = useState([0.016, 0.012]);

  const [animationValue, setAnimationValue] = useState(0);
  const showAnimation = useRef(new Animated.Value(animationValue)).current;

  const [latList, setLatList] = useState([]);
  const [lngList, setLngList] = useState([]);
  const onInsert = (data) => {
    data.map((item) => {
      Geocode.fromAddress(item.structured_formatting.main_text).then(
        (response) => {
          const { lat, lng } = response.results[0].geometry.location;

          setLatList((latList) => {
            return [...latList, lat];
          });
          setLngList((lngList) => {
            return [...lngList, lng];
          });
        },
        (error) => {
          console.error(error);
        }
      );
    });
  };
  useEffect(() => {
    onInsert(route.params.dataSource);
  }, []);

  useEffect(() => {
    if (lngList.length > 1) {
      setOrigin([getAverage(latList), getAverage(lngList)]);
    }
  }, [latList]);

  useEffect(() => {
    if (origin[0] !== 0) {
      setDelta([
        getLatDelta(latList, origin[0]),
        getLngDelta(lngList, origin[1]),
      ]);
    }
  }, [origin]);

  return (
    <View>
      <GoBackHeader
        navigation={navigation}
        text={route.params.name}
        rightButton="goHome"
      />
      <BottomSheet
        navigation={navigation}
        animation={showAnimation}
        data={route.params.dataSource}
        name={route.params.name}
        setPlaceID={route.params.setPlaceID}
        setPlaceName={route.params.setPlaceName}
        setAddress={route.params.setAddress}
        setLctn={route.params.setLctn}
      />
      <MapView
        showsBuildings={false}
        customMapStyle={mapStyle}
        provider="google"
        ref={mapRef}
        style={styles.map}
        region={{
          latitude: origin[0] == null ? 0 : origin[0] - delta[0] * 0.35,
          longitude: origin[1] == null ? 0 : origin[1],
          latitudeDelta: delta[0],
          longitudeDelta: delta[1],
        }}
      >
        {latList.map((item, index) => {
          return (
            <Marker coordinate={{ latitude: item, longitude: lngList[index] }}>
              <SearchMarker />
            </Marker>
          );
        })}
      </MapView>
    </View>
  );
};

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
  buttons: {
    height: 88,
    width: "100%",
    backgroundColor: "#fff",
    flexDirection: "row",
    position: "absolute",
    zIndex: 3,
  },
  goBack: {
    width: 30,
    height: 18,
    marginTop: 51,
    marginLeft: 31,
    position: "absolute",
    zIndex: 4,
  },
  goBackImage: {
    width: 9,
    height: 18,
    resizeMode: "contain",
    marginTop: 51,
    marginLeft: 31,
    tintColor: "black",
    zIndex: 4,
  },
  title: {
    width: 280,
    height: 24,
    marginTop: 48,
    marginLeft: 63,
    position: "absolute",
    zIndex: 4,
  },
  titleText: {
    height: 24,
    fontSize: 16,
    lineHeight: 24,
    marginTop: 48,
    marginLeft: 63,
    zIndex: 4,
  },
  goHome: {
    width: 15,
    height: 15,
    marginLeft: 347.5,
    marginTop: 52.5,
    zIndex: 4,
  },
  goHomeImage: {
    width: 15,
    height: 15,
    marginLeft: 347.5,
    marginTop: 52.5,
    position: "absolute",
    zIndex: 4,
  },
  descriptionMainText: {
    marginTop: 16,
    height: 24,
    width: "100%",
    flexDirection: "row",
  },
  descriptionSecondaryText: {
    height: 20,
    width: "100%",
    marginTop: 4,
  },
  descriptionType: {
    height: 16,
    width: 18,
    margin: 4,
    marginLeft: 8,
  },
});

export default SubSearchScreen3;
