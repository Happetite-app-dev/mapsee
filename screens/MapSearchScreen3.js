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

const _renderRow = ({ navigation, item }) => {
  return (
    <ScrollView scrollEnabled={false}>
      <TouchableHighlight
        onPress={() => gotoSearch2Screen({ navigation, item })}
        underlayColor="#c8c7cc"
      >
        <View>
          <View style={styles.main_text}>
            <Text>{item.structured_formatting.main_text}</Text>
          </View>

          <View style={styles.category}>
            <Text>{item.types[0]}</Text>
          </View>

          <View style={styles.address}>
            <Text>{item.description}</Text>
          </View>
        </View>
      </TouchableHighlight>
    </ScrollView>
  );
};

const MapSearchScreen3 = ({ navigation, route }) => {
  const mapRef = React.createRef();
  const [origin, setOrigin] = useState([0, 0]);

  const [animationValue, setAnimationValue] = useState(0);
  const showAnimation = useRef(new Animated.Value(animationValue)).current;

  const [latList, setLatList] = useState([]);
  const [lngList, setLngList] = useState([]);

  const [focused, setFocused] = useState(true);

  const toggleAnimation = () => {
    const val = animationValue == 0 ? 400 : 0;
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

  if (focused) {
    onInsert(route.params[1]);

    setFocused(false);
  }

  const BottomSheet = ({ navigation, animation, data }) => {
    return (
      <Animated.View
        style={{
          width: "100%",
          backgroundColor: "#fff",
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          padding: 20,
          position: "absolute",
          bottom: animation,
          zIndex: 3,
          alignItems: "center",
          justifyContent: "center",
          maxHeight: 300,
          borderWidth: 1,
          borderColor: "#DDDFE9",
          borderRadius: 16,
          elevation: 24,
        }}
      >
        <TouchableOpacity onPress={() => toggleAnimation()}>
          <View>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              BottomSheet. Touch and Up
            </Text>
          </View>
        </TouchableOpacity>
        <FlatList
          data={data}
          renderItem={({ item }) => _renderRow({ navigation, item })}
        />
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={{ marginTop: 50 }}>
        {" "}
        MapSearchScreen3 : {route.params[0]}{" "}
      </Text>
      <Button
        title="Go Back"
        onPress={() => {
          navigation.goBack();
        }} // 이전페이지로 돌아가는 버튼
      />
      <MapView
        provider="google"
        ref={mapRef}
        style={styles.map}
        region={{
          latitude: origin[0],
          longitude: origin[1],
          latitudeDelta: 0.0016,
          longitudeDelta: 0.0016,
        }}
      >
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
    </SafeAreaView>
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
  main_text: {
    height: 24,
    //width: 90,
    marginLeft: 23,
    fontSize: 14,
  },
  address: {
    height: 24,
    //width: 344,
    marginLeft: 23,
    fontSize: 12,
  },
  category: {
    height: 16,
    //width: 100,
    marginLeft: 121,
    fontSize: 10,
  },
});

export default MapSearchScreen3;
