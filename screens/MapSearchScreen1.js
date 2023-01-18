import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const searchHistoryImage = require("../assets/image/Location.png");
const closeImage = require("../assets/image/close.png");
const closeImage1 = require("../assets/image/close_1.png");
const goBackImage = require("../assets/image/goBack.png");

const gotoSearch2Screen = ({ navigation, data }) => {
  navigation.navigate("MapSearchScreen2", data);
};

const gotoSearch3Screen = ({ navigation, data }) => {
  navigation.navigate("MapSearchScreen3", data);
};

const renderDescription = (data) => {
  return (
    <View style={styles.descriptionContainer}>
      <View style={styles.descriptionImage}>
        <Image style={{ width: 16 }} source={searchHistoryImage} />
      </View>
      <View style={{ flexDirection: "column" }}>
        <View style={styles.descriptionMainText}>
          <View
            style={{
              height: 24,
              width: data.structured_formatting.main_text.length * 9 + 20,
            }}
          >
            <Text style={{ fontSize: 14 }}>
              {data.structured_formatting.main_text}
            </Text>
          </View>

          <View style={styles.descriptionType}>
            <Text style={{ fontSize: 10, color: "#ADB1C5" }}>기타</Text>
          </View>
        </View>

        <View style={styles.descriptionSecondaryText}>
          <Text style={{ fontSize: 12, color: "#545766" }}>
            {data.structured_formatting.secondary_text}
          </Text>
        </View>
      </View>
    </View>
  );
};

// Store Current Search Data
const storeData = async (value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem("search", jsonValue);
  } catch (e) {
    // saving error
  }
};

const MapSearchScreen1 = ({ navigation, route }) => {
  const [name, setName] = useState("");
  const [history, setHistory] = useState([]);

  const onClick = (dataSource) => {
    gotoSearch3Screen({ navigation, data: [name, dataSource] });
  };

  useEffect(() => {
    async function fetchData() {
      setHistory(
        JSON.parse(await AsyncStorage.getItem("search")) === null
          ? []
          : JSON.parse(await AsyncStorage.getItem("search"))
      );
      console.log("setHistory done");
    }

    fetchData();
  }, [useIsFocused]);

  useEffect(() => {
    console.log("history changed", history);
  }, [history]);

  const InbetweenCompo = () => {
    return name === "" ? (
      <View>
        <View style={styles.inbetweenCompo}>
          <View style={styles.recentSearch}>
            <Text style={{ fontSize: 16 }}>최근검색</Text>
          </View>
          <View
            onTouchEndCapture={() => {
              storeData("");
              setHistory([]);
            }}
            style={styles.eraseAll}
          >
            <Text style={{ fontSize: 14, color: "#5ED3CC" }}>전체삭제</Text>
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

  const renderHistoryItem = ({ item }) => {
    return (
      <View
        style={styles.historyItem}
        onTouchEndCapture={() => {
          console.log("history page", item);
          gotoSearch2Screen({ navigation, data: item });
        }}
      >
        <Image source={searchHistoryImage} />
        <Text style={{ marginLeft: 20, fontSize: 14, lineHeight: 24 }}>
          {item.name}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttons}>
        <View
          onTouchEndCapture={() => {
            navigation.goBack();
          }}
          style={styles.goBack}
        >
          <Image source={goBackImage} style={styles.goBackImage} />
        </View>
        <View
          onTouchEndCapture={() => {
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
      <GooglePlacesAutocomplete
        inbetweenCompo={<InbetweenCompo />}
        getSearchWord={(text) => {
          setName(text);
        }}
        getResultArray={(dataSource) => {
          onClick(dataSource);
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
          location: route.params.latitude + ", " + route.params.longitude,
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
            address: details.formatted_address,
            id: details.place_id,
            structured_formatting: { main_text: details.name },
          };

          setHistory((prevList) => [...prevList, newPlace]);

          const newArray =
            JSON.parse(await AsyncStorage.getItem("search")) === null
              ? []
              : JSON.parse(await AsyncStorage.getItem("search"));
          storeData([...newArray, newPlace]);

          console.log("onPress", details);
          gotoSearch2Screen({ navigation, data: details });
        }}
        styles={styles.GooglePlacesAutocomplete}
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
      marginLeft: 63,
      width: 280,
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
  inbetweenCompo: {
    height: 24,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 32,
  },
  recentSearch: {
    width: 51,
    height: 24,
    marginLeft: 23,
  },
  eraseAll: {
    height: 12,
    marginRight: 23,
  },
  historyItem: {
    height: 48,
    width: 320,
    marginLeft: 24,
    flexDirection: "row",
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
    marginTop: 51,
    marginLeft: 31,
  },
  goBackImage: {
    width: 9,
    height: 18,
    resizeMode: "contain",
    tintColor: "black",
  },
  goHome: { width: 15, height: 15, marginRight: 20.5, marginTop: 52.5 },
  descriptionContainer: {
    height: 72,
    width: 400,
    flexDirection: "row",
    display: "flex",
  },
  descriptionImage: {
    marginTop: 31,
    marginLeft: 27,
    width: 16,
    height: 18,
  },
  descriptionMainText: {
    marginTop: 16,
    marginLeft: 20,
    height: 24,
    width: "100%",
    flexDirection: "row",
  },
  descriptionSecondaryText: {
    height: 20,
    width: "100%",
    marginTop: 4,
    marginLeft: 20,
  },
  descriptionType: {
    height: 16,
    width: 18,
    margin: 4,
    marginLeft: 8,
  },
});

export default MapSearchScreen1;
