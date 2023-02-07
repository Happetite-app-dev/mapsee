import React from "react";
import {
  FlatList,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";

import NoImageRecord1 from "../../assets/image/noImageRecord1.svg";
import NoImageRecord2 from "../../assets/image/noImageRecord2.svg";

const gotoEditScreen = (stackNavigation, item) => {
  console.log("RecordFlatList", item);
  stackNavigation.navigate("EditScreen", {
    recordID: item.recordID,
  });
};

const IndividualRecord = ({ item, stackNavigation }) => {
  return (
    <View style={styles.item}>
      <TouchableOpacity onPress={() => gotoEditScreen(stackNavigation, item)}>
        <View style={{ flexDirection: "column", justifyContent: "center" }}>
          <View style={{ width: 158, height: 148, alignItems: "center" }}>
            {item.photos !== undefined &&
            Object.values(item.photos).length >= 1 ? (
              <View>
                <Image
                  style={{
                    width: 160,
                    height: 148,
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                  }}
                  source={{ uri: Object.values(item.photos)[0] }}
                />
              </View>
            ) : Math.random() < 0.5 ? (
              <NoImageRecord1
                style={{ width: 80, height: 99, marginTop: 30 }}
              />
            ) : (
              <NoImageRecord2
                style={{ width: 80, height: 99, marginTop: 30 }}
              />
            )}
          </View>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.placeName}>{item.placeName}</Text>
          <Text
            style={styles.date}
          >{`${item.date.year}.${item.date.month}.${item.date.day}`}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const RecordFlatList = ({ recordList, stackNavigation }) => {
  const renderItem = ({ item }) => (
    <IndividualRecord item={item} stackNavigation={stackNavigation} />
  );

  return (
    <FlatList
      data={
        recordList
          ? recordList.sort(function (a, b) {
              const date1 = new Date(a.date.year, a.date.month, a.date.day);
              const date2 = new Date(b.date.year, b.date.month, b.date.day);
              return date2 - date1;
            })
          : []
      }
      renderItem={renderItem}
      extraData={recordList}
      keyExtractor={(item) => item}
      numColumns={2}
      initialNumToRender={6}
      style={{
        width: "100%",
        left: 10,
      }}
    />
  );
};

export default RecordFlatList;

const styles = StyleSheet.create({
  item: {
    flex: 0.5,
    borderColor: "#DDDFE9",
    borderRadius: 8,
    borderWidth: 1,
    padding: 0,
    height: 224,
    maxWidth: 160,
    marginVertical: 8,
    marginHorizontal: 12,
  },
  title: {
    width: 136,
    height: 24,
    marginLeft: 12,
    marginTop: 8,
    fontSize: 14,
    textAlign: "center",
    fontWeight: "bold",
  },
  placeName: {
    width: 136,
    height: 16,
    marginLeft: 12,
    fontSize: 12,
    textAlign: "center",
    color: "#545766",
  },
  date: {
    width: 136,
    height: 16,
    marginLeft: 12,
    fontSize: 10,
    textAlign: "center",
    color: "#ADB1C5",
  },
});
