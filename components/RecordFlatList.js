import { FlatList, StyleSheet, View, Text, TouchableOpacity } from "react-native";

const RecordFlatList = ({recordDataSource, stackNavigation}) => {
    const gotoEditScreen = (item) => {
      stackNavigation.navigate("EditScreen",{placeName: item.recordData.placeName, placeID: item.recordData.placeID, address: item.recordData.address, lctn: item.recordData.lctn})
    }
    const IndividualRecord = ({ item }) => (
        <View style={styles.item}>
          <TouchableOpacity style={{flex:1}} onPress={()=>gotoEditScreen(item)}>
            <Text style={styles.title}>{item.recordData.title}</Text>
            <Text style={styles.title}>{item.recordData.placeName}</Text>
            <Text style={styles.title}>{`${item.recordData.date.year}.${item.recordData.date.month}.${item.recordData.date.day}`}</Text>
          </TouchableOpacity>
        </View>
      );
    const renderItem = ({ item }) => (
        <IndividualRecord
          item={item}
        />
      );
    return(
        <FlatList
            data={recordDataSource}
            renderItem={renderItem}
            keyExtractor={item => '_'+item.id}
            key={'_'}
            numColumns={2}
            style={{
            flex:1,
            left: 10
            }}
         />
    )
}

export default RecordFlatList;

const styles = StyleSheet.create({
    item: {
      flex: 0.5,
      borderColor: 'grey',
      borderRadius: 8,
      borderWidth: 1,
      padding: 0,
      height: 224,
      maxWidth: 160,
      marginVertical: 8,  
      marginHorizontal: 12,
    
    },
  });
  