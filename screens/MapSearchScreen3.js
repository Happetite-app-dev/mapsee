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

const bottomSheetImage = require("../assets/image/bottomSheetScroll.png");
const closeImage = require("../assets/image/close.png");
const closeImage1 = require("../assets/image/close_1.png");
const goBackImage = require("../assets/image/goBack.png");

Geocode.setApiKey("AIzaSyDBq4tZ1QLm1R7iPH8O4dTvebVGWgkRPks");
Geocode.setLanguage("ko");

const gotoSearch2Screen = ({ navigation, item }) => {
  Geocode.fromAddress(item.structured_formatting.main_text).then(
    (response) => {
      const { lat, lng } = response.results[0].geometry.location;
      console.log("gotoSearch2Screen");
      const newPlace = {
        geometry: { location: { lat, lng } },
        name: item.structured_formatting.main_text,
        formatted_address: item.structured_formatting.secondary_text,
        id: item.place_id,
      };

      navigation.navigate("MapSearchScreen2", newPlace);
    },
    (error) => {
      console.error("cannot move to MapSearchScreen2", error);
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
  console.log("in functionnnn", diff);
  return 2 * Math.max(...diff);
};

const getLngDelta = (numbers, average) => {
  if (numbers.length === 0) return 0.012;
  const diff = numbers.map((el) => el - average);
  console.log("in functionnnn", diff);
  return 2 * Math.max(...diff);
};

const _renderRow = ({ navigation, item }) => {
  return (
    <TouchableHighlight
      onPress={() => gotoSearch2Screen({ navigation, item })}
      underlayColor="#c8c7cc"
    >
      <View style={{ flexDirection: "column", height: 84 }}>
        <View style={styles.descriptionMainText}>
          <View style={{ height: 24, width: 90 }}>
            <Text style={{ fontSize: 14, fontWeight: "bold" }}>
              {item.structured_formatting.main_text}
            </Text>
          </View>
          <View style={styles.descriptionType}>
            <Text style={{ fontSize: 10, color: "#ADB1C5" }}>기타</Text>
          </View>
        </View>

        <View style={styles.descriptionSecondaryText}>
          <Text style={{ fontSize: 12, color: "#545766" }}>
            {item.structured_formatting.secondary_text}
          </Text>
        </View>
      </View>
    </TouchableHighlight>
  );
};

const MapSearchScreen3 = ({ navigation, route }) => {
  const mapRef = React.createRef();
  const [origin, setOrigin] = useState([0, 0]);
  const [delta, setDelta] = useState([0.016, 0.012]);

  const [animationValue, setAnimationValue] = useState(0);
  const showAnimation = useRef(new Animated.Value(animationValue)).current;

  const [latList, setLatList] = useState([]);
  const [lngList, setLngList] = useState([]);

  const toggleAnimation = () => {
    const val = animationValue === 0 ? 500 : 0;
    Animated.timing(showAnimation, {
      useNativeDriver: false,
      toValue: val,
      duration: 350,
    }).start();
    setAnimationValue(val);
  };

  const onInsert = (data) => {
    data.map((item) => {
      Geocode.fromAddress(item.structured_formatting.main_text).then(
        (response) => {
          const { lat, lng } = response.results[0].geometry.location;
          console.log("Geocoding ", lat, lng);

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
    onInsert(route.params[1]);
    console.log(route.params[1].length);
  }, []);

  useEffect(() => {
    console.log("-----useEffect", lngList.length);
    if (lngList.length > 1) {
      console.log("enter");
      setOrigin([getAverage(latList), getAverage(lngList)]);
      console.log("done", getAverage(latList), getAverage(lngList));
    }
  }, [latList]);

  useEffect(() => {
    console.log("origin", origin[0], origin[1]);
    if (origin[0] !== 0) {
      setDelta([
        getLatDelta(latList, origin[0]),
        getLngDelta(lngList, origin[1]),
      ]);
      console.log("delta", getLatDelta(latList, origin[0]));
    }
  }, [origin]);

  const BottomSheet = ({ navigation, animation, data }) => {
    return (
      <Animated.View
        style={{
          width: "100%",
          backgroundColor: "white",
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          position: "absolute",
          bottom: animation,
          zIndex: 3,
          alignItems: "center",
          justifyContent: "center",
          maxHeight: 256,
          borderWidth: 1,
          borderColor: "#DDDFE9",
          borderRadius: 16,
          elevation: 24,
        }}
      >
        <View
          onTouchEndCapture={() => toggleAnimation()}
          style={{ marginTop: 8 }}
        >
          <Image source={bottomSheetImage} style={{ position: "absolute" }} />
        </View>
        <FlatList
          data={data}
          renderItem={({ item }) => _renderRow({ navigation, item })}
          style={{ width: "100%", marginLeft: 23 }}
          scrollEnabled={false}
        />
      </Animated.View>
    );
  };

  return (
    <View>
      <MapView
        provider="google"
        ref={mapRef}
        style={styles.map}
        region={{
          latitude: origin[0] == null ? 0 : origin[0],
          longitude: origin[1] == null ? 0 : origin[1],
          latitudeDelta: delta[0],
          longitudeDelta: delta[1],
        }}
      >
        <View style={styles.buttons}>
          <View
            onTouchEndCapture={() => {
              console.log("back");
              navigation.goBack();
            }}
            style={styles.goBack}
          >
            <Image source={goBackImage} style={styles.goBackImage} />
          </View>
          <View style={styles.title}>
            <Text style={styles.titleText}>{route.params[0]}</Text>
          </View>
          <View
            onTouchEndCapture={() => {
              console.log("close");
              navigation.navigate("Map");
            }}
            style={styles.goHome}
          >
            <View style={{ position: "relative" }}>
              <Image
                style={{ width: 15, height: 15, position: "absolute" }}
                source={closeImage}
              />
              <Image
                style={{ width: 15, height: 15, position: "absolute" }}
                source={closeImage1}
              />
            </View>
          </View>
        </View>
        {latList.map((item, index) => {
          return (
            <Marker
              coordinate={{ latitude: item, longitude: lngList[index] }}
            />
          );
        })}
      </MapView>

      <BottomSheet
        navigation={navigation}
        animation={showAnimation}
        data={route.params[1]}
      />
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
    justifyContent: "space-between",
    position: "absolute",
  },
  goBack: {
    width: 30,
    height: 18,
    marginTop: 51,
    marginLeft: 31,
    position: "absolute",
    backgroundColor: "red",
  },
  goBackImage: {
    width: 9,
    height: 18,
    resizeMode: "contain",
    tintColor: "black",
  },
  title: {
    width: 304,
    height: 24,
    marginTop: 48,
    marginLeft: 63,
    position: "absolute",
  },
  titleText: {
    height: 24,
    fontSize: 16,
    lineHeight: 24,
    marginTop: 2,
    position: "absolute",
  },
  goHome: {
    width: 15,
    height: 15,
    marginLeft: 347.5,
    marginTop: 52.5,
    backgroundColor: "blue",
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

export default MapSearchScreen3;
