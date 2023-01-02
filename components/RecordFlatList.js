import {
  FlatList,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";

const RecordFlatList = ({ recordDataSource, stackNavigation }) => {
  //console.log(recordDataSource.length)
  const gotoEditScreen = (item) => {
    stackNavigation.navigate("EditScreen", {
      recordID: item.recordID,
      ...item.recordData,
    });
  };
  const IndividualRecord = ({ item }) => (
    <View style={styles.item}>
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() => gotoEditScreen(item)}
      >
        <Text style={styles.title}>{item.recordData.title}</Text>
        <Text style={styles.title}>{item.recordData.placeName}</Text>
        <Text
          style={styles.title}
        >{`${item.recordData.date.year}.${item.recordData.date.month}.${item.recordData.date.day}`}</Text>
      </TouchableOpacity>
    </View>
  );
  const renderItem = ({ item }) => <IndividualRecord item={item} />;
  return (
    <FlatList
      data={recordDataSource}
      renderItem={renderItem}
      keyExtractor={(item) => item.recordID}
      numColumns={2}
      initialNumToRender={6}
      style={{
        flex: 1,
        left: 10,
      }}
    />
  );
};

export default RecordFlatList;

const styles = StyleSheet.create({
  item: {
    flex: 0.5,
    borderColor: "grey",
    borderRadius: 8,
    borderWidth: 1,
    padding: 0,
    height: 224,
    maxWidth: 160,
    marginVertical: 8,
    marginHorizontal: 12,
  },
});
