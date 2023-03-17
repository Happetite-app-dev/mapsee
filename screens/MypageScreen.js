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
import * as Clipboard from "expo-clipboard";
import * as Linking from "expo-linking";
import * as StoreReview from "react-native-store-review";
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

const openInstagram = () => {
  Linking.openURL("https://www.instagram.com/mapsee_happetite/");
};

const gotoSuggestScreen = ({ navigation }) => {
  navigation.navigate("SuggestScreen");
};
const MypageScreen = ({ navigation }) => {
  const myContext = useContext(AppContext);
  const myID = myContext.myID;
  const myName = myContext.myLastName + myContext.myFirstName;

  const copyToClipboard = async (string) => {
    await Clipboard.setStringAsync(string);
  };

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
          <Text
            style={{
              top: 20,
              left: 23,
              fontSize: 16,
              fontFamily: "NotoSansKR-Medium",
            }}
          >
            {myName}
          </Text>
          <View style={{ flexDirection: "row", top: 30, left: 23 }}>
            <Text
              style={{
                fontSize: 14,
                lineHeight: 24,
                color: "#ADB1C5",
                height: 24,
                fontFamily: "NotoSansKR-Regular",
              }}
            >
              {myID}
            </Text>
            <TouchableOpacity
              onPress={() => copyToClipboard(myID)}
              style={{ left: 16 }}
            >
              <Copy />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => gotoProfileScreen({ navigation })}
          style={{ height: 20, width: 50, left: 352.5 }}
        >
          <Arrow />
        </TouchableOpacity>
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
            <Text
              style={{
                fontSize: 14,
                left: 14,
                top: 3,
                fontFamily: "NotoSansKR-Medium",
              }}
            >
              친구 목록
            </Text>
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
            <Text
              style={{
                fontSize: 14,
                left: 14,
                top: 3,
                fontFamily: "NotoSansKR-Medium",
              }}
            >
              알림
            </Text>
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
              console.log("store review");
              if (StoreReview.isAvailable) {
                StoreReview.requestReview();
              }
            }}
          >
            <Rate />
            <Text
              style={{
                fontSize: 14,
                left: 14,
                top: 3,
                fontFamily: "NotoSansKR-Medium",
              }}
            >
              별점주기
            </Text>
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
              openInstagram();
            }}
          >
            <SNS />
            <Text
              style={{
                fontSize: 14,
                left: 14,
                top: 3,
                fontFamily: "NotoSansKR-Medium",
              }}
            >
              인스타그램
            </Text>
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
            <Text
              style={{ fontSize: 14, top: 3, fontFamily: "NotoSansKR-Regular" }}
            >
              로그아웃
            </Text>
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
            fontFamily: "NotoSansKR-Regular",
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
        <Text
          style={{
            left: 37,
            color: "#5ED3CC",
            fontSize: 14,
            fontFamily: "NotoSansKR-Medium",
          }}
        >
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
    flexDirection: "column",
  },
  screenTitle: { fontFamily: "NotoSansKR-Bold", fontSize: 16, left: 23 },
  screenTitleView: {
    flexDirection: "row",
    height: 33,
    marginBottom: 20,
    alignItems: "center",
  },
});
