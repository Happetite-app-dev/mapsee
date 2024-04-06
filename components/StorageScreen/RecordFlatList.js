import { React, useContext } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import AppContext from "../AppContext";

import NoImageRecord1 from "../../assets/image/noImageRecord3.svg";
import NoImageRecord2 from "../../assets/image/noImageRecord4.svg";
import ShareFolder from "../../assets/icons/Share copy.svg";
import NewRecord_corner from "../../assets/image/newRecord_corner.svg";
import N from "../../assets/image/N.svg";
import Monotone from "../../assets/image/Monotone.svg";

import FolderList from "./FolderList";

const gotoEditScreen = (stackNavigation, item) => {
  stackNavigation.navigate("EditScreen", {
    recordID: item[0],
  });
};

const IndividualRecord = ({ item, stackNavigation, myUID }) => {
  const recordDate = new Date(
    item[1]?.writeDate?.year,
    item[1]?.writeDate?.month - 1,
    item[1]?.writeDate?.day,
    item[1]?.writeDate?.hour,
    item[1]?.writeDate?.minute
  );
  const currentDate = new Date();
  const dayDiff = (currentDate - recordDate) / (1000 * 60 * 60 * 24);
  const IsNewRecord = dayDiff <= 3 ? true : false;
  return (
    <View style={styles.item}>
      <TouchableOpacity onPress={() => gotoEditScreen(stackNavigation, item)}>
        {IsNewRecord ? (
          <NewRecord_corner
            style={{ position: "absolute", top: -1, left: -1 }}
          />
        ) : (
          <></>
        )}
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
                    width: IsNewRecord ? 156 : 158,
                    height: IsNewRecord ? 146 : 148,
                    borderTopLeftRadius: IsNewRecord ? 6 : 7,
                    borderTopRightRadius: IsNewRecord ? 6 : 7,
                    top: IsNewRecord ? 1 : 0,
                  }}
                  source={{ uri: Object.values(item[1].photos)[0] }}
                />
                {item[1].userID != myUID ? (
                  <ShareFolder
                    style={{
                      position: "absolute",
                      marginTop: 116,
                      marginLeft: 128,
                    }}
                    color="white"
                  />
                ) : (
                  <></>
                )}
              </View>
            ) : Math.random() < 0.5 ? (
              <View
                style={{
                  width: 158,
                  height: 148,
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                }}
              >
                <NoImageRecord1
                  style={{
                    width: 80,
                    height: 96,
                    marginTop: 30,
                    marginLeft: 40,
                  }}
                />
                {item[1].userID != myUID ? (
                  <ShareFolder
                    style={{
                      position: "absolute",
                      marginTop: 116,
                      marginLeft: 128,
                    }}
                    color="#ADB1C5"
                  />
                ) : (
                  <></>
                )}
              </View>
            ) : (
              <View
                style={{
                  width: 158,
                  height: 148,
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                }}
              >
                <NoImageRecord2
                  style={{
                    width: 80,
                    height: 99,
                    marginTop: 30,
                    marginLeft: 40,
                  }}
                />
                {item[1].userID != myUID ? (
                  <ShareFolder
                    style={{
                      position: "absolute",
                      marginTop: 116,
                      marginLeft: 128,
                    }}
                    color="#ADB1C5"
                  />
                ) : (
                  <></>
                )}
              </View>
            )}
          </View>
          <Text style={styles.title}>
            {item[1].title}
            {IsNewRecord ? <N style={{ marginLeft: 5 }} /> : <></>}
          </Text>
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
  userQuery,
  setSelectedFolderIDNameColorUserIDs,
  setLongPressedFolder,
  setModalVisible,
  storageScreen,
}) => {
  const myContext = useContext(AppContext);
  const myUID = myContext.myUID;

  const renderItem = ({ item }) => (
    <IndividualRecord
      item={item}
      stackNavigation={stackNavigation}
      myUID={myUID}
    />
  );

  return (
    <FlatList
      data={
        recordList
          ? recordList.sort(function (a, b) {
              const date1 = new Date(
                a[1].writeDate.year,
                a[1].writeDate.month,
                a[1].writeDate.day,
                a[1].writeDate.hour,
                a[1].writeDate.minute
              );
              const date2 = new Date(
                b[1].writeDate.year,
                b[1].writeDate.month,
                b[1].writeDate.day,
                b[1].writeDate.hour,
                b[1].writeDate.minute
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
      ListEmptyComponent={
        <View
          style={{
            position: "absolute",
            justifyContent: "center",
            flexDirection: "column",
            alignContent: "center",
            alignItems: "center",
            alignSelf: "center",
            top: 280,
          }}
        >
          <Monotone />
          <Text
            color="#545766"
            style={{ fontFamily: "NotoSansKR-Regular", fontSize: 14, top: 19 }}
          >
            아직 기록이 없습니다.
          </Text>
        </View>
      }
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
    justifyContent: "center",
    flexDirection: "row",
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
