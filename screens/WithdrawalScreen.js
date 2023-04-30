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
import qs from "qs";

import { database, auth } from "../firebase";
import { deleteUser, updateCurrentUser } from "firebase/auth";
import AppContext from "../components/AppContext";
import { PopUpType1, PopUpType2 } from "../components/PopUp";
import { useQueryClient } from "react-query";
import BottomButton from "../components/BottomButton";
import GoBackHeader from "../components/GoBackHeader";
import Suggest from "../assets/icons/FolderEdit.svg";
import SuggestBox from "../assets/image/suggestBox.svg";

const gotoBeforeLoginScreen = ({ navigation }) => {
  navigation.navigate("BeforeLoginScreen");
};

const openInstagram = () => {
  Linking.openURL("https://www.instagram.com/mapsee_happetite/");
};

const withdrawalFunction = async ({
  myContext,
  navigation,
  queryClient,
  user,
}) => {
  // remove from friend's friend list
  const friendRef = ref(database, "/users/" + myContext.myUID + "/friendUIDs");

  onValue(friendRef, (snapshot) => {
    if (snapshot.exists()) {
      const friendKeys = Object.keys(snapshot.val()); // get an array of the keys in the snapshot value
      friendKeys.forEach((friendUID) => {
        // iterate over the folder keys using forEach
        const reference1 = ref(
          database,
          "/users/" + friendUID + "/friendUIDs/" + myContext.myUID
        );
        remove(reference1);
      });
    }
  });

  // remove from folder
  const folderRef = ref(database, "/users/" + myContext.myUID + "/folderIDs");

  onValue(folderRef, (snapshot) => {
    if (snapshot.exists()) {
      const folderKeys = Object.keys(snapshot.val()); // get an array of the keys in the snapshot value
      if (folderKeys.length === 1) {
        const reference1 = ref(database, "/folders/" + folderKeys[0]);
        remove(reference1);
        return;
      }
      folderKeys.forEach((folderUID) => {
        // iterate over the folder keys using forEach
        const reference1 = ref(
          database,
          "/folders/" + folderUID + "/userIDs/" + myContext.myUID
        );
        remove(reference1);

        onValue(
          ref(database, "/folders/" + folderUID + "/userIDs"),
          (snapshot) => {
            if (!snapshot.hasChildren()) {
              const reference3 = ref(database, "/folders/" + folderUID);
              remove(reference3);
            }
          }
        );
      });
    }
  });

  // remove from notices
  const noticeRef = ref(database, "/notices/" + myContext.myUID);
  remove(noticeRef);

  // remove from users
  const userRef = ref(database, "/users/" + myContext.myUID);
  remove(userRef);

  // invalidate queries
  queryClient.invalidateQueries(["all-records"]);
  queryClient.invalidateQueries(["all-notices"]);
  queryClient.invalidateQueries(["users", myContext.myUID]);

  // do same as logout
  myContext.initMyUID(undefined);
  myContext.initMyID(undefined);
  myContext.initMyFirstName(undefined);
  myContext.initMyLastName(undefined);
  myContext.initMyEmail(undefined);

  deleteUser(user).then(() => {
    updateCurrentUser(auth, null);

    console.log("user deleted");
  });

  gotoBeforeLoginScreen({ navigation });
};

async function sendEmail(to, subject, body, options = {}) {
  const { cc, bcc } = options;

  let url = `mailto:${to}`;

  // Create email link query
  const query = qs.stringify({
    subject: subject,
    body: body,
    cc: cc,
    bcc: bcc,
  });

  if (query.length) {
    url += `?${query}`;
  }

  // check if we can use this link
  const canOpen = await Linking.canOpenURL(url);

  if (!canOpen) {
    throw new Error("Provided URL can not be handled");
  }

  return Linking.openURL(url);
}

const WithdrawalScreen = ({ navigation }) => {
  const user = auth.currentUser;

  const myContext = useContext(AppContext);
  const myID = myContext.myID;
  const myName = myContext.myLastName + myContext.myFirstName;
  const queryClient = useQueryClient();
  const [valid, setValid] = useState(false);
  const [visible, setVisible] = useState(false);
  const [goBackModalVisible, setGoBackModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <GoBackHeader text="회원탈퇴" navigation={navigation} />

      <Text
        style={{
          fontSize: 14,
          lineHeight: 24,
          fontFamily: "NotoSansKR-Medium",
          left: 23,
          top: 16,
          height: 48,
        }}
      >
        정말 탈퇴하시겠습니까? {"\n"}삭제된 기록은 복구되지 않습니다.
      </Text>
      <TouchableOpacity
        style={styles.suggest}
        onPress={() => {
          console.log("send email");
          sendEmail("happetite23@gmail.com", "mapsee 탈퇴", "").then();
        }}
      >
        <SuggestBox style={{ position: "absolute" }} />
        <Suggest style={{ position: "relative", left: 16 }} />
        <Text style={styles.suggestText}>탈퇴 사유를 입력해 주세요</Text>
      </TouchableOpacity>
      <BottomButton
        text="탈퇴하기"
        onPressFunction={() => setGoBackModalVisible(true)}
        style={{
          backgroundcolor: valid ? "#5ED3CC" : "#F4F5F9",
          bottom: 40,
          position: "absolute",
        }}
      />
      <PopUpType1
        modalVisible={goBackModalVisible}
        modalHandler={setGoBackModalVisible}
        action={() =>
          withdrawalFunction({
            myContext,
            navigation,
            queryClient,
            user,
          })
        }
        askValue="정말 탈퇴하시겠어요?"
        actionValue="탈퇴하기"
      />
    </View>
  );
};

export default WithdrawalScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
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
    top: 3,
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
    top: 48,
    flexDirection: "row",
    alignItems: "center",
  },
});
