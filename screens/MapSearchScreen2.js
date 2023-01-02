import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, push } from "firebase/database";
import React, { useRef, useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Animated,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  TouchableHighlight,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

import AppContext from "../components/AppContext";
import PlaceInfoBottomSheet from "../components/PlaceInfoBottomSheet";
import RecordFlatList from "../components/RecordFlatList";

const targetLocationImage = require("../assets/image/targetLocation.png");

const firebaseConfig = {
  apiKey: "AIzaSyDBq4tZ1QLm1R7iPH8O4dTvebVGWgkRPks",
  authDomain: "mapseedemo1.firebaseapp.com",
  projectId: "mapseedemo1",
  storageBucket: "mapseedemo1.appspot.com",
  messagingSenderId: "839335870793",
  appId: "1:839335870793:web:75004c5d43270610411a98",
  measurementId: "G-8L1MD1CGN2",
};

const app = initializeApp(firebaseConfig);

const MapSearchScreen2 = ({ navigation, route }) => {
  // lat, lng: route.geometry.location.lat, route.geometry.locationn.lng
  // name: route.name
  // formated address: route.formatted_address
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
  }); //현재 스크린에 나타나는 map의 중앙 좌표값
  const [targetShown, setTargetShown] = useState(true);

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
      >
        <View style={{ height: 88, width: "100%", backgroundColor: "#fff" }} />
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
