import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Close from "../assets/icons/Close.svg";
import GoBack from "../assets/icons/BackArrow.svg";
import InbetweenCompo from "../components/MapSearchScreen/InbetweenCompo";
import renderDescription from "../components/MapSearchScreen/RenderDescription";
import * as Location from "expo-location";

const gotoSearch2Screen = ({ navigation, data }) => {
  navigation.navigate("MapSearchScreen2", data);
};
const gotoSearch3Screen = ({ navigation, data }) => {
  navigation.navigate("MapSearchScreen3", data);
};

const storeData = async (value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem("search", jsonValue);
  } catch (e) {
    // saving error
  }
};

const SearchBox = ({
  name,
  setName,
  history,
  setHistory,
  location,
  navigation,
}) => {
  return (
    <GooglePlacesAutocomplete
      inbetweenCompo={
        <InbetweenCompo
          name={name}
          history={history}
          setHistory={setHistory}
          navigation={navigation}
        />
      }
      getSearchWord={(text) => {
        setName(text);
      }}
      getResultArray={(dataSource) => {
        gotoSearch3Screen({ navigation, data: [name, dataSource] });
        //onClick(navigation, name, dataSource);
      }}
      textInputProps={{
        autoFocus: true, // 커서 바로 이동
        blurOnSubmit: false,
        clearButtonMode: false,
        returnKeyType: "search",
      }}
      listUnderlayColor="#DDDFE9"
      placeholder="검색어를 입력하세요"
      enablePoweredByContainer={false}
      query={{
        key: "AIzaSyDBq4tZ1QLm1R7iPH8O4dTvebVGWgkRPks",
        language: "kor",
        location: location[0] + ", " + location[1],
        radius: "1500",
        rankby: "distance",
      }}
      fetchDetails
      renderDescription={(data) => renderDescription(data)} // custom description render
      onPress={async (data, details) => {
        const newPlace = {
          geometry: {
            location: {
              lat: details.geometry.location.lat,
              lng: details.geometry.location.lng,
            },
          },
          name: details.name,
          formatted_address: details.formatted_address,
          place_id: details.place_id,
          structured_formatting: { main_text: details.name },
        };

        setHistory((prevList) => [...prevList, newPlace]);

        const newArray =
          JSON.parse(await AsyncStorage.getItem("search")) === null
            ? []
            : JSON.parse(await AsyncStorage.getItem("search"));
        storeData([...newArray, newPlace]);

        gotoSearch2Screen({ navigation, data: details });
      }}
      styles={styles.GooglePlacesAutocomplete}
    />
  );
};

const MapSearchScreen1 = ({ navigation, route }) => {
  const [name, setName] = useState("");
  const [history, setHistory] = useState([]);
  const [current, setCurrent] = useState([0, 0]);

  useEffect(() => {
    async function getLocation() {
      const location = await Location.getCurrentPositionAsync({});
      setCurrent({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    }

    getLocation();
  });

  useEffect(() => {
    async function fetchData() {
      setHistory(
        JSON.parse(await AsyncStorage.getItem("search")) === null
          ? []
          : JSON.parse(await AsyncStorage.getItem("search"))
      );
    }

    fetchData();
  }, [useIsFocused]);

  return (
    <View style={styles.container}>
      <View style={styles.buttons}>
        <View
          onTouchEndCapture={() => {
            navigation.goBack();
          }}
          style={styles.goBack}
        >
          <GoBack style={styles.goBackImage} />
        </View>

        <View
          onTouchEndCapture={() => {
            navigation.navigate("Map");
          }}
          style={styles.goHome}
        >
          <View style={{ position: "relative" }}>
            <Close />
          </View>
        </View>
      </View>
      <SearchBox
        name={name}
        setName={(name) => setName(name)}
        history={history}
        setHistory={(history) => setHistory(history)}
        location={[route.params.latitude, route.params.longitude]}
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
  GooglePlacesAutocomplete: {
    position: "absolute",
    textInputContainer: {
      width: 280,
      marginLeft: 63,
      marginBottom: 16,
      marginTop: 48,
      alignItems: "center",
      height: 24,
    },
    textInput: {
      width: 300,
      fontSize: 16,
      fontFamily: "NotoSansKR-Regular",
      lineHeight: 24,
      borderRadius: 0,
      paddingVertical: 0,
      paddingHorizontal: 0,
    },
    separator: { height: 0 },
    row: {
      padding: 0,
      height: 72,
      flexDirection: "row",
    },
  },
  inbetweenCompo: {
    height: 0,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttons: {
    height: 88,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
  },
  goBack: {
    width: 24,
    height: 24,
    marginTop: 48,
    marginLeft: 23,
  },
  goBackImage: {
    width: 9,
    height: 18,
    resizeMode: "contain",
    tintColor: "black",
  },
  goHome: {
    width: 24,
    height: 24,
    marginRight: 23,
    marginTop: 48,
  },
});

export default MapSearchScreen1;
