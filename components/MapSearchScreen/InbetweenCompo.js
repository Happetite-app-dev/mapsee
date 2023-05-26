import { Image, StyleSheet, Text, View, FlatList } from "react-native";
import SearchHistory from "../../assets/icons/Location/Location.svg";
import AsyncStorage from "@react-native-async-storage/async-storage";

const storeData = async (value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem("search", jsonValue);
  } catch (e) {
    // saving error
  }
};

const gotoSearch2Screen = ({ navigation, data }) => {
  navigation.navigate("MapSearchScreen2", data);
};

const InbetweenCompo = ({ name, history, setHistory, navigation }) => {
  const renderHistoryItem = ({ item }) => {
    return (
      <View
        style={styles.historyItem}
        onTouchEndCapture={() => {
          gotoSearch2Screen({ navigation, data: item });
        }}
      >
        <SearchHistory />
        <Text
          style={{
            marginLeft: 20,
            fontSize: 14,
            lineHeight: 24,
            fontFamily: "NotoSansKR-Regular",
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
        inverted={true}
      />
    </View>
  ) : (
    <></>
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
  inbetweenCompo: {
    height: 24,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  recentSearch: {
    marginLeft: 23,
  },
  eraseAll: {
    height: 20,
    marginRight: 23,
  },
  historyItem: {
    height: 48,
    width: 320,
    marginLeft: 20,
    flexDirection: "row",
  },
});

export default InbetweenCompo;
