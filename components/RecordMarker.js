import {
  Image,
  StyleSheet,
  View,
  SafeAreaView,
  Button,
  Animated,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

import NewMarker from "../assets/markers/newMarker.svg";
import SimpleMarker from "../assets/markers/simpleMarker.svg";

const now = new Date();
const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
const targetLocationImage = require("../assets/image/targetLocation.png");
const RecordMarker = ({ recordData, origin }) => {
  return recordData == null || recordData === undefined ? (
    <></>
  ) : (
    Object.values(recordData).map((record) => {
      const showMarker = Math.random();
      const dayDiff = (record.date - currentDate) / (1000 * 60 * 60 * 24);
      const color = record.color;

      return (
        <Marker
          // key={record.recordID}
          key={record.recordID}
          coordinate={record.lctn}
          opacity={origin.latitudeDelta < 0.01 || showMarker > 0.5 ? 100 : 0}
          style={{ zIndex: Math.round(dayDiff * 1000) }}
        >
          {dayDiff <= 3 ? <NewMarker /> : <SimpleMarker color={color} />}
        </Marker>
      );
    })
  );
};

export default RecordMarker;
