import { StyleSheet, Text, View } from "react-native";
import SearchHistory from "../../assets/icons/searchPlace.svg";

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
            }}
          >
            <Text style={{ fontSize: 14, fontFamily: "NotoSansKR-Medium" }}>
              {data.structured_formatting.main_text}
            </Text>
          </View>

          <View style={styles.descriptionType}>
            <Text
              style={{
                fontSize: 10,
                color: "#ADB1C5",
                fontFamily: "NotoSansKR-Light",
              }}
            >
              기타
            </Text>
          </View>
        </View>

        <View style={styles.descriptionSecondaryText}>
          <Text
            style={{
              fontSize: 12,
              color: "#545766",
              fontFamily: "NotoSansKR-Regular",
            }}
          >
            {data.structured_formatting.secondary_text}
          </Text>
        </View>
      </View>
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

export default renderDescription;
