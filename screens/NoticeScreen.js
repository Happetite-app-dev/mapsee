import {
  Database,
  getDatabase,
  ref,
  onValue,
  set,
  push,
} from "firebase/database";
import { useEffect, useState, useContext } from "react";
import { SafeAreaView, Text, View, FlatList } from "react-native";
import { Snackbar } from "react-native-paper";

import AppContext from "../components/AppContext";
import NoticeRenderer from "../components/NoticeRenderer";

const NoticeScreen = () => {
  const myContext = useContext(AppContext);
  const myUID = myContext.myUID;
  const [noticeList, setNoticeList] = useState([]);

  const [visible, setVisible] = useState(false); // Snackbar
  const onToggleSnackBar = () => setVisible(!visible); // SnackbarButton -> 나중에는 없애기
  const onDismissSnackBar = () => setVisible(false); // Snackbar

  const db = getDatabase();
  useEffect(() => {
    setNoticeList([]);
    onValue(ref(db, "/notices/" + myUID), (snapshot) => {
      snapshot.forEach((datasnapshot) => {
        setNoticeList((prev) => [
          ...prev,
          { key: datasnapshot.key, val: datasnapshot.val() },
        ]);
      });
    });
  }, []);

  const renderNotice = ({ item }) => (
    <NoticeRenderer item={item} onToggleSnackBar={onToggleSnackBar} />
  );

  return (
    <SafeAreaView style={{ backgroundColor: "white" }}>
      <View
        style={{
          flexDirection: "row",
          height: 40,
          marginBottom: 20,
          alignItems: "center",
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 16, left: 20 }}>알림</Text>
      </View>
      <View style={{ alignItems: "center", height: "90%" }}>
        <FlatList
          data={noticeList}
          renderItem={renderNotice}
          keyExtractor={(item) => item.time}
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
