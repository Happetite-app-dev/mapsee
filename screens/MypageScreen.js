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
import SnackBar from "../components/SnackBar";
import * as Clipboard from "expo-clipboard";
import * as Linking from "expo-linking";
import * as StoreReview from "react-native-store-review";
import { onValue, ref, remove, listAll } from "firebase/database";

import { database, auth } from "../firebase";
import { deleteUser, updateCurrentUser } from "firebase/auth";
import Rate from "../assets/icons/Rate.svg";
import SNS from "../assets/icons/SNS.svg";
import Suggest from "../assets/icons/FolderEdit.svg";
import NoticeOn from "../assets/icons/Notice/Notice with Alarm.svg";
import SuggestBox from "../assets/image/suggestBox.svg";
import FriendList from "../assets/icons/FriendsList.svg";
import Copy from "../assets/image/Copy.svg";
import Arrow from "../assets/icons/Arrow Right.svg";
import AppContext from "../components/AppContext";
import { PopUpType1, PopUpType2 } from "../components/PopUp";
import { useQueryClient } from "react-query";

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

const MypageScreen = ({ navigation }) => {
  const user = auth.currentUser;

  const myContext = useContext(AppContext);
  const myID = myContext.myID;
  const myName = myContext.myLastName + myContext.myFirstName;
  const queryClient = useQueryClient();
  const [visible, setVisible] = useState(false);
  const [goBackModalVisible, setGoBackModalVisible] = useState(false);

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
      <TouchableOpacity
        style={{
          position: "absolute",
          width: "100%",
          height: 80,
          top: 105,
          flexDirection: "column",
        }}
        onPress={() => gotoProfileScreen({ navigation })}
      >
        <View>
          <Text
            style={{
              top: 20,
              left: 23,
              fontSize: 16,
              fontFamily: "NotoSansKR-Medium",
              lineHeight: 24,
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
              onPress={() => {
                copyToClipboard(myID);
                setVisible(true);
              }}
              style={{ left: 16, top: -1 }}
            >
              <Copy />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={{ height: 20, width: 50, left: 352.5 }}
          onPress={() => gotoProfileScreen({ navigation })}
        >
          <Arrow />
        </TouchableOpacity>
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
            style={styles.element}
          >
            <FriendList />
            <Text style={styles.elementText}>친구 목록</Text>
          </TouchableOpacity>

          <TouchableOpacity // 별점주기
            activeOpacity={0.6}
            style={styles.element}
            onPress={() => {
              StoreReview.requestReview();
            }}
          >
            <Rate />
            <Text style={styles.elementText}>별점주기</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.element}
            onPress={() => {
              openInstagram();
            }}
          >
            <SNS />
            <Text style={styles.elementText}>인스타그램</Text>
          </TouchableOpacity>

          <TouchableOpacity // 로그아웃
            activeOpacity={0.6}
            style={{
              height: 48,
              width: "100%",
              flexDirection: "row",
              paddingTop: 24,
              paddingLeft: 18,
            }}
            onPress={() => {
              setGoBackModalVisible(true);
              /**
               * myContext.initMyUID(null);
              myContext.initMyID(null);
              myContext.initMyFirstName(null);
              myContext.initMyLastName(null);
              myContext.initMyEmail(null);
              gotoBeforeLoginScreen({ navigation });
               */
            }}
          >
            <Text
              style={{
                fontSize: 14,
                top: 3,
                fontFamily: "NotoSansKR-Regular",
                lineHeight: 24,
              }}
            >
              로그아웃
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        style={styles.suggest}
        onPress={() => navigation.navigate("SuggestScreen")}
      >
        <SuggestBox style={{ position: "absolute" }} />
        <Suggest style={{ position: "relative", left: 16 }} />
        <Text style={styles.suggestText}>
          더 나은 맵시를 위해 의견을 주세요!
        </Text>
      </TouchableOpacity>
      <Text
        style={{
          fontSize: 12,
          color: "#ADB1C5",
          width: 344,
          left: 23,
          bottom: 120,
          textAlign: "center",
          fontFamily: "NotoSansKR-Regular",
          lineHeight: 24,
          position: "absolute",
          height: 24,
          backgroundColor: "white",
        }}
      >
        버전 00.00.01
      </Text>
      <SnackBar
        visible={visible}
        onDismissSnackBar={() => {
          setVisible(false);
        }}
        text={`아이디(@${myID})가 복사되었습니다.`}
        style={{ marginBottom: 70 }}
      />
      <PopUpType1
        modalVisible={goBackModalVisible}
        modalHandler={setGoBackModalVisible}
        action={() => {
          myContext.initMyUID(undefined);
          myContext.initMyID(undefined);
          myContext.initMyFirstName(undefined);
          myContext.initMyLastName(undefined);
          myContext.initMyEmail(undefined);
          gotoBeforeLoginScreen({ navigation });
          updateCurrentUser(auth, null);
        }}
        askValue="정말 로그아웃 하시겠어요?"
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
    flexDirection: "column",
  },
  screenTitle: { fontFamily: "NotoSansKR-Bold", fontSize: 16, left: 23 },
  screenTitleView: {
    flexDirection: "row",
    height: 48,
    marginBottom: 20,
    alignItems: "center",
    position: "relative",
    width: "100%",
  },
  element: {
    height: 48,
    width: "100%",
    flexDirection: "row",
    paddingTop: 24,
    paddingLeft: 18,
  },
  elementText: {
    fontSize: 14,
    left: 14,
    fontFamily: "NotoSansKR-Medium",
    lineHeight: 24,
  },
  suggestText: {
    left: 37,
    color: "#5ED3CC",
    fontSize: 14,
    fontFamily: "NotoSansKR-Medium",
  },
  suggest: {
    left: 23,
    bottom: 152,
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    width: 344,
  },
});
