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
import FriendList from "../assets/icons/friendsList.svg";
import Copy from "../assets/icons/Friend.svg";
import Arrow from "../assets/icons/Arrow.svg";
import AppContext from "../components/AppContext";

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

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ width: "100%", height: 88 }}>
        <View style={styles.screenTitleView}>
          <Text style={styles.screenTitle}>마이페이지</Text>
        </View>
      </View>
      <View
        style={{
          position: "absolute",
          width: "100%",
          height: 80,
          top: 105,
          flexDirection: "column",
        }}
      >
        <View>
          <Text style={{ top: 20, left: 23, fontSize: 16, fontWeight: "bold" }}>
            {myName}
          </Text>
          <View style={{ flexDirection: "row", top: 30, left: 23 }}>
            <Text
              style={{
                fontSize: 14,
                lineHeight: 24,
                color: "#ADB1C5",
                height: 24,
              }}
            >
              {myID}
            </Text>
            <Copy onPress={() => {}} style={{ left: 16 }} />
          </View>
        </View>
        <Arrow
          onPress={() => gotoProfileScreen({ navigation })}
          style={{ left: 352.5 }}
        />
      </View>

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
            <FriendList />
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
            onPress={() => {
              gotoBeforeLoginScreen({ navigation });
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
          top: 550,
        }}
        onPress={() => navigation.navigate("SuggestScreen")}
      >
        <SuggestBox style={{ position: "absolute" }} />
        <Suggest style={{ position: "relative", left: 16 }} />
        <Text style={{ left: 37, color: "#5ED3CC", fontSize: 14 }}>
          더 나은 맵시를 위해 의견을 주세요!
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default MypageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  screenTitle: { fontWeight: "bold", fontSize: 16, left: 23 },
  screenTitleView: {
    flexDirection: "row",
    height: 56,
    marginBottom: 20,
    alignItems: "center",
  },
});
