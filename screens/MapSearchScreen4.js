import React from "react";
import Geocode from "react-geocode";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableHighlight,
  Image,
} from "react-native";

import Close from "../assets/icons/close.svg";
import GoBack from "../assets/icons/goBack.svg";
import GoBackHeader from "../components/GoBackHeader";
Geocode.setApiKey("AIzaSyDBq4tZ1QLm1R7iPH8O4dTvebVGWgkRPks");
Geocode.setLanguage("ko");

const gotoSearch2Screen = ({ navigation, item }) => {
  Geocode.fromAddress(item.structured_formatting.main_text).then(
    (response) => {
      const { lat, lng } = response.results[0].geometry.location;
      const newPlace = {
        geometry: { location: { lat, lng } },
        name: item.structured_formatting.main_text,
        address: item.structured_formatting.secondary_text,
        id: item.place_id,
      };
      navigation.navigate("MapSearchScreen2", newPlace);
    },
    (error) => {
      console.error("cannot move to MapSearchScreen2", error);
    }
  );
};

const _renderRow = ({ navigation, item }) => {
  return (
    <TouchableHighlight
      onPress={() => gotoSearch2Screen({ navigation, item })}
      underlayColor="#c8c7cc"
    >
      <View style={{ flexDirection: "column", height: 84, marginLeft: 23 }}>
        <View style={styles.descriptionMainText}>
          <View
            style={{
              height: 24,
              width: item.structured_formatting.main_text.length * 9 + 20,
            }}
          >
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

const MapSearchScreen4 = ({ navigation, route }) => {
  return (
    <View style={{ height: "100%", backgroundColor: "white" }}>
      <GoBackHeader
        navigation={navigation}
        text={route.params[0]}
        rightButton="goHome"
      />
      <FlatList
        data={route.params[1]}
        renderItem={({ item }) => _renderRow({ navigation, item })}
        style={{ width: "100%" }}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "stretch",
    justifyContent: "center",
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

export default MapSearchScreen4;
