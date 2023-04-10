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
  stackNavigation.navigate("EditScreen", {
    recordID: item[0],
  });
};

const IndividualRecord = ({ item, stackNavigation }) => {
  //console.log("item", item);
  return (
    <View style={styles.item}>
      <TouchableOpacity onPress={() => gotoEditScreen(stackNavigation, item)}>
        <View style={{ flexDirection: "column", justifyContent: "center" }}>
          <View
            style={{
              width: 158,
              height: 148,
              alignItems: "center",
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
            }}
          >
            {item[1].photos !== undefined &&
            item[1].photos !== null &&
            Object.values(item[1].photos).length >= 1 ? (
              <View>
                <Image
                  style={{
                    width: 158,
                    height: 148,
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                  }}
                  source={{ uri: Object.values(item[1].photos)[0] }}
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
          <Text style={styles.title}>{item[1].title}</Text>
          <Text style={styles.placeName}>{item[1].placeName}</Text>
          <Text
            style={styles.date}
          >{`${item[1].date.year}.${item[1].date.month}.${item[1].date.day}`}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const RecordFlatList = ({
  recordList,
  stackNavigation,
  style,
  ListHeaderComponent,
  onRefresh,
  refreshing,
}) => {
  const renderItem = ({ item }) => (
    <IndividualRecord item={item} stackNavigation={stackNavigation} />
  );

  return (
    <FlatList
      data={
        recordList
          ? recordList.sort(function (a, b) {
              const date1 = new Date(
                a[1].date.year,
                a[1].date.month,
                a[1].date.day
              );
              const date2 = new Date(
                b[1].date.year,
                b[1].date.month,
                b[1].date.day
              );
              return date2 - date1;
            })
          : []
      }
      renderItem={renderItem}
      extraData={recordList}
      keyExtractor={(item) => item}
      numColumns={2}
      initialNumToRender={6}
      ListHeaderComponent={ListHeaderComponent}
      onRefresh={onRefresh}
      refreshing={refreshing}
      style={{
        width: "100%",
        ...style,
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
    left: 10,
  },
  title: {
    width: 136,
    height: 24,
    marginLeft: 12,
    marginTop: 8,
    fontSize: 14,
    textAlign: "center",
    fontFamily: "NotoSansKR-Medium",
  },
  placeName: {
    width: 136,
    height: 16,
    marginLeft: 12,
    fontSize: 12,
    textAlign: "center",
    color: "#545766",
    fontFamily: "NotoSansKR-Regular",
  },
  date: {
    width: 136,
    height: 16,
    marginLeft: 12,
    fontSize: 10,
    textAlign: "center",
    color: "#ADB1C5",
    fontFamily: "NotoSansKR-Light",
    marginTop: 4,
  },
});
