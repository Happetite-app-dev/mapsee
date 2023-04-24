import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  FlatList,
  Keyboard,
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import * as Location from "expo-location";

import Close from "../assets/icons/Close.svg";
import GoBack from "../assets/icons/BackArrow.svg";
import SearchHistory from "../assets/icons/Location/Location.svg";
import renderDescription from "../components/MapSearchScreen/RenderDescription";

const storeData = async (value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem("search", jsonValue);
  } catch (e) {
    // saving error
  }
};

const InbetweenCompo = ({
  name,
  history,
  setHistory,
  navigation,
  setPlaceID,
  setPlaceName,
  setAddress,
  setLctn,
}) => {
  const renderHistoryItem = ({ item }) => {
    return (
      <View
        style={styles.historyItem}
        onTouchEndCapture={() => {
          navigation.navigate("SubSearchScreen2", {
            details: item,
            setPlaceID: (f) => setPlaceID(f),
            setPlaceName: (f) => setPlaceName(f),
            setAddress: (f) => setAddress(f),
            setLctn: (f) => setLctn(f),
          });
        }}
      >
        <SearchHistory />
        <Text
          style={{
            marginLeft: 20,
            fontSize: 14,
            lineHeight: 24,
            fontFamily: "NotoSansKR-Medium",
          }}
        >
          {item.name}
        </Text>
      </View>
    );
  };
  return name === "" ? (
    <View>
      <View style={styles.inbetweenCompo}>
        <View style={styles.recentSearch}>
          <Text style={{ fontSize: 16, fontFamily: "NotoSansKR-Medium" }}>
            최근검색
          </Text>
        </View>
        <View
          onTouchEndCapture={() => {
            storeData("");
            setHistory([]);
          }}
          style={styles.eraseAll}
        >
          <Text
            style={{
              fontSize: 14,
              color: "#5ED3CC",
              fontFamily: "NotoSansKR-Bold",
            }}
          >
            전체삭제
          </Text>
        </View>
      </View>
      <FlatList
        data={history}
        renderItem={renderHistoryItem}
        extraData={history}
        style={{ marginTop: 24 }}
      />
    </View>
  ) : (
    <></>
  );
};

const SearchBox = ({
  name,
  setName,
  history,
  setHistory,
  location,
  navigation,
  setPlaceID,
  setPlaceName,
  setAddress,
  setLctn,
}) => {
  return (
    <GooglePlacesAutocomplete
      inbetweenCompo={
        <InbetweenCompo
          name={name}
          history={history}
          setHistory={setHistory}
          navigation={navigation}
          setPlaceID={setPlaceID}
          setPlaceName={setPlaceName}
          setAddress={setAddress}
          setLctn={setLctn}
        />
      }
      getResultArray={Keyboard.dismiss}
      getSearchWord={(text) => {
        setName(text);
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
        key: "AIzaSyA2FBudItIm0cVgwNOsuc8D9BKk0HUeUTs",
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
        navigation.navigate("SubSearchScreen2", {
          details,
          setPlaceID: (f) => setPlaceID(f),
          setPlaceName: (f) => setPlaceName(f),
          setAddress: (f) => setAddress(f),
          setLctn: (f) => setLctn(f),
        });
      }}
      styles={styles.GooglePlacesAutocomplete}
    />
  );
};

const SubSearchScreen1 = ({ navigation, route }) => {
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
        location={
          [route.params.current.latitude, route.params.current.longitude] || [
            current.latitude,
            current.longitude,
          ]
        }
        navigation={navigation}
        setPlaceID={route.params.setPlaceID}
        setPlaceName={route.params.setPlaceName}
        setAddress={route.params.setAddress}
        setLctn={route.params.setLctn}
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
    },
    textInput: {
      height: 24,
      width: 300,
      fontSize: 16,
      marginTop: 48,
      marginBottom: 16,
    },
    separator: { height: 0 },
    row: {
      padding: 0,
      height: 72,
      flexDirection: "row",
    },
  },
  buttons: {
    height: 88,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
  },
  goBack: {
    width: 30,
    height: 18,
    marginTop: 48,
    marginLeft: 23,
  },
  goBackImage: {
    width: 9,
    height: 18,
    resizeMode: "contain",
    tintColor: "black",
  },
  goHome: { width: 24, height: 24, marginRight: 23, marginTop: 48 },

  inbetweenCompo: {
    height: 24,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 32,
  },
  recentSearch: {
    marginLeft: 23,
  },
  eraseAll: {
    marginRight: 23,
  },
  historyItem: {
    height: 48,
    width: 320,
    marginLeft: 20,
    flexDirection: "row",
  },
});

export default SubSearchScreen1;
