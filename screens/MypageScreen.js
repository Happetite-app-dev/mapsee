import { StatusBar } from "expo-status-bar";
import { useState, useContext } from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Rate from "../assets/icons/Rate.svg";
import SNS from "../assets/icons/SNS.svg";
import Suggest from "../assets/icons/folderEdit.svg";
import NoticeOn from "../assets/icons/notice_on.svg";
import SuggestBox from "../assets/icons/suggestBox.svg";
import AppContext from "../components/AppContext";
import { PopUpType1 } from "../components/PopUp";

const friendListImage = require("../assets/image/friendList.png");

const gotoProfileScreen = ({ navigation }) => {
  navigation.navigate("ProfileScreen");
};
const gotoFriendListSreen = ({ navigation }) => {
  navigation.navigate("FriendListScreen");
};

const gotoBeforeLoginScreen = ({ navigation }) => {
  navigation.navigate("BeforeLoginScreen");
};

const gotoSuggestScreen = ({ navigation }) => {
  navigation.navigate("SuggestScreen");
};
const MypageScreen = ({ navigation }) => {
  const myContext = useContext(AppContext);
  const myID = myContext.myID;
  const myName = myContext.myLastName + myContext.myFirstName;
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          position: "absolute",
          width: "100%",
          height: 60,
          top: 45,
          paddingTop: 20,
        }}
      >
        <Text style={{ left: 20, fontSize: 16, fontWeight: "bold" }}>
          마이페이지
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => gotoProfileScreen({ navigation })}
        style={{ position: "absolute", width: "100%", height: 80, top: 105 }}
      >
        <Text style={{ top: 20, left: 20, fontSize: 16, fontWeight: "bold" }}>
          {myName}
        </Text>
        <Text style={{ top: 30, left: 20, fontSize: 14, color: "#ADB1C5" }}>
          {myID}
        </Text>
      </TouchableOpacity>

      <View
        style={{
          position: "absolute",
          top: 185,
          width: "100%",
          height: 250,
          justifyContent: "space-between",
          flexDirection: "column",
        }}
      >
        <View
          style={{
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => gotoFriendListSreen({ navigation })}
            style={{
              height: 48,
              width: "100%",
              flexDirection: "row",
              paddingTop: 24,
              paddingLeft: 18,
            }}
          >
            <Image source={friendListImage} />
            <Text style={{ fontSize: 14, left: 14, top: 3 }}>친구 목록</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.6}
            style={{
              height: 48,
              width: "100%",
              flexDirection: "row",
              paddingTop: 24,
              paddingLeft: 18,
            }}
          >
            <NoticeOn />
            <Text style={{ fontSize: 14, left: 14, top: 3 }}>알림</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.6}
            style={{
              height: 48,
              width: "100%",
              flexDirection: "row",
              paddingTop: 24,
              paddingLeft: 18,
            }}
          >
            <Rate />
            <Text style={{ fontSize: 14, left: 14, top: 3 }}>별점주기</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.6}
            style={{
              height: 48,
              width: "100%",
              flexDirection: "row",
              paddingTop: 24,
              paddingLeft: 18,
            }}
          >
            <SNS />
            <Text style={{ fontSize: 14, left: 14, top: 3 }}>인스타그램</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.6}
            style={{
              height: 48,
              width: "100%",
              flexDirection: "row",
              paddingTop: 24,
              paddingLeft: 18,
            }}
          >
            <Text style={{ fontSize: 14, top: 3 }}>로그아웃</Text>
          </TouchableOpacity>
        </View>
        <Text
          style={{
            fontSize: 12,
            color: "#ADB1C5",
            width: 344,
            left: 23,
            top: 24,
            textAlign: "center",
          }}
        >
          버전 00.00.01
        </Text>
      </View>
      <TouchableOpacity
        style={{
          height: 48,
          width: "100%",
          alignItems: "center",
          flexDirection: "row",
          left: 23,
          top: 600,
        }}
        onPress={() => navigation.navigate("SuggestScreen")}
      >
        <SuggestBox style={{ position: "absolute" }} />
        <Suggest style={{ position: "relative", left: 16 }} />
        <Text style={{ left: 37, color: "#5ED3CC", fontSize: 14 }}>
          더 나은 맵시를 위해 의견을 주세요!
        </Text>
      </TouchableOpacity>

      <PopUpType1
        modalVisible={modalVisible}
        modalHandler={setModalVisible}
        action={() => gotoBeforeLoginScreen({ navigation })}
        askValue="정말 로그아웃을 하시겠어요?"
        actionValue="로그아웃"
      />
    </SafeAreaView>
  );
};

export default MypageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
