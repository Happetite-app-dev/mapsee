import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

import Close from "../assets/icons/close.svg";
import GoBack from "../assets/icons/goBack.svg";
import SearchHistory from "../assets/icons/searchPlace.svg";

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

const InbetweenCompo = ({ name, history, setHistory, navigation }) => {
  const renderHistoryItem = ({ item }) => {
    return (
      <View
        style={styles.historyItem}
        onTouchEndCapture={() => {
          console.log("history page", item);
          gotoSearch2Screen({ navigation, data: item });
        }}
      >
        <SearchHistory />
        <Text style={{ marginLeft: 20, fontSize: 14, lineHeight: 24 }}>
          {item.name}
        </Text>
      </View>
    );
  };
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

        console.log("onPress", details);
        gotoSearch2Screen({ navigation, data: details });
      }}
      styles={styles.GooglePlacesAutocomplete}
    />
  );
};

const renderDescription = (data) => {
  return (
    <View style={styles.descriptionContainer}>
      <View style={styles.descriptionImage}>
        <SearchHistory style={{ width: 16 }} />
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

const MapSearchScreen1 = ({ navigation, route }) => {
  const [name, setName] = useState("");
  const [history, setHistory] = useState([]);

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
    width: "100%",
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
    marginLeft: 20,
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
    marginTop: 28,
    marginLeft: 23,
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
