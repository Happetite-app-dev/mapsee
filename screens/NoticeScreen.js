import { ref, onValue, set, push } from "firebase/database";
import { useEffect, useState, useContext } from "react";
import { SafeAreaView, Text, View, FlatList, StyleSheet } from "react-native";
import { Snackbar } from "react-native-paper";
import { useQueryClient } from "react-query";
import AppContext from "../components/AppContext";
import NoticeRenderer from "../components/NoticeRenderer";
import { database } from "../firebase";
import { useAllNoticeQuery } from "../queries";

const NoticeScreen = ({ navigation }) => {
  const myContext = useContext(AppContext);
  const myUID = myContext.myUID;
  const query = useAllNoticeQuery(myUID);
  const query_modified = Object.entries(query.data || []).map((item) => {
    return { key: item[0], val: item[1] };
  });
  const queryClient = useQueryClient();
  const [visible, setVisible] = useState(false); // Snackbar
  const onToggleSnackBar = () => setVisible(!visible); // SnackbarButton -> 나중에는 없애기
  const onDismissSnackBar = () => setVisible(false); // Snackbar

  const renderNotice = ({ item }) => (
    <NoticeRenderer
      navigation={navigation}
      item={item}
      onToggleSnackBar={onToggleSnackBar}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.screenTitleView}>
        <Text style={styles.screenTitle}>알림</Text>
      </View>
      <View style={{ alignItems: "center", height: "90%" }}>
        <FlatList
          onRefresh={() => {
            queryClient.invalidateQueries(["all-notices"]);
          }} // fetch로 데이터 호출
          refreshing={query.isLoading} // state
          data={query_modified}
          renderItem={renderNotice}
          numColumns={1}
          initialNumToRender={6}
          style={{
            width: "100%",
          }}
        />

        <Snackbar
          visible={visible}
          onDismiss={onDismissSnackBar}
          action={{
            label: "Undo", // 옆에 취소표시
            onPress: () => {
              onDismissSnackBar;
            },
          }}
          style={{
            backgroundColor: "#545766",
            borderRadius: 8,
            fontSize: 12,
            lineHeight: 16,
            letterSpacing: -0.5,
          }}
        >
          Hi there! I'm Snackbar.
        </Snackbar>
      </View>
    </SafeAreaView>
  );
};

export default NoticeScreen;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "89.5%",
    backgroundColor: "white",
  },
  screenTitle: { fontWeight: "bold", fontSize: 16, left: 23 },
  screenTitleView: {
    flexDirection: "row",
    height: 33,
    marginBottom: 20,
    alignItems: "center",
  },
});
