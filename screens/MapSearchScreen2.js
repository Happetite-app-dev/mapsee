import React, { useEffect, useState } from "react";
import { StyleSheet, View, Image } from "react-native";
import Geocoder from "react-native-geocoding";
import { TouchableOpacity } from "react-native-gesture-handler";
import MapView, { Marker } from "react-native-maps";

const goBackImage = require("../assets/image/goBack.png");
const targetLocationImage = require("../assets/image/targetLocation.png");

const MapSearchScreen2 = ({ navigation, route }) => {
  // lat, lng: route.geometry.location.lat, route.geometry.locationn.lng
  // name: route.name
  // formated address: route.formatted_address

  const gotoPlaceInfoBottomSheet = () => {
    navigation.navigate("PlaceInfoBottomSheetScreen", {
      targetName: target.name,
      targetAddress: target.address,
      targetId: target.id,
      targetLctn: target.lctn,
    });
  };

  const mapRef = React.createRef();
  const [target, setTarget] = useState({
    lctn: {
      latitude: route.params.geometry.location.lat,
      longitude: route.params.geometry.location.lng,
    },
    latitudeDelta: 0.0016,
    longitudeDelta: 0.0012,
    name: route.params.name,
    address: route.params.formatted_address,
    id: route.params.place_id,
    bottomShown: route.params.bottomShown,
  });

  const [targetShown, setTargetShown] = useState(true);

  useEffect(() => {
    gotoPlaceInfoBottomSheet();
  });

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
    gotoPlaceInfoBottomSheet();
  };

  return (
    <View>
      <MapView
        provider="google"
        ref={mapRef}
        style={styles.map}
        region={{
          latitude: target.lctn.latitude,
          longitude: target.lctn.longitude,
          latitudeDelta: target.latitudeDelta,
          longitudeDelta: target.longitudeDelta,
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
        <View style={{ height: 88, width: "100%", backgroundColor: "#fff" }}>
          <TouchableOpacity
            onPress={() => {
              console.log("back");
              navigation.goBack();
            }}
            style={{
              width: 30,
              height: 30,
              marginTop: 51,
              marginLeft: 31,
              backgroundColor: "red",
            }}
          >
            <Image
              source={goBackImage}
              style={{
                width: 9,
                height: 18,
                resizeMode: "contain",
                marginTop: 51,
                marginLeft: 31,
                tintColor: "black",
              }}
            />
          </TouchableOpacity>
        </View>
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
});

export default MapSearchScreen2;
