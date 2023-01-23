import { getStorage, ref, getDownloadURL } from "firebase/storage";
import React, { useState, useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";

import NoImageRecord1 from "../assets/image/noImageRecord1.svg";
import NoImageRecord2 from "../assets/image/noImageRecord2.svg";

const gotoEditScreen = (stackNavigation, item) => {
  stackNavigation.navigate("EditScreen", {
    recordID: item.recordID,
    ...item.recordData,
  });
};

const IndividualRecord = ({ item, stackNavigation }) => {
  return (
    <View style={styles.item}>
      <TouchableOpacity onPress={() => gotoEditScreen(stackNavigation, item)}>
        <View style={{ flexDirection: "column", justifyContent: "center" }}>
          <View style={{ width: 158, height: 148, alignItems: "center" }}>
            {item.recordData.photos !== undefined &&
            Object.values(item.recordData.photos).length >= 1 ? (
              <View>
                <Image
                  style={{
                    width: 160,
                    height: 148,
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                  }}
                  source={{ uri: Object.values(item.recordData.photos)[0] }}
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
          <Text style={styles.title}>{item.recordData.title}</Text>
          <Text style={styles.placeName}>{item.recordData.placeName}</Text>
          <Text
            style={styles.date}
          >{`${item.recordData.date.year}.${item.recordData.date.month}.${item.recordData.date.day}`}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const RecordFlatList = ({ recordDataSource, stackNavigation }) => {
  const renderItem = ({ item }) => (
    <IndividualRecord item={item} stackNavigation={stackNavigation} />
  );

  return (
    <FlatList
      data={Object.values(recordDataSource)}
      renderItem={renderItem}
      extraData={recordDataSource}
      keyExtractor={(item) => item.recordID}
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
