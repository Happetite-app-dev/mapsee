import { ref, onValue, set, push, remove, off } from "firebase/database";
import React, { useEffect, useContext } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
} from "react-native";

import AppContext from "../components/AppContext";
import BottomButton from "../components/BottomButton";
import { auth, database } from "../firebase";
import Mapsee from "../assets/image/Mapsee.svg";
import { SafeAreaView } from "react-native-safe-area-context";
const { height } = Dimensions.get("window");

const db = database;
const gotoApp = ({
  myUID_,
  initMyUID,
  initMyID,
  initMyFirstName,
  initMyLastName,
  initMyEmail,
  startTutorial,
  navigation,
}) => {
  initMyUID(myUID_);
  onValue(ref(db, "/users/" + myUID_), (snapshot) => {
    initMyID(snapshot.child("id").val());
    initMyFirstName(snapshot.child("firstName").val());
    initMyLastName(snapshot.child("lastName").val());
    initMyEmail(snapshot.child("email").val());
  });
  if (!startTutorial) {
    navigation.navigate("Tabs");
  }
};

const BeforeLoginScreen = ({ navigation }) => {
  const myContext = useContext(AppContext);
  const startTutorial = false;
  const initMyUID = (uid) => {
    myContext.initMyUID(uid);
  };
  const initMyID = (id) => {
    myContext.initMyID(id);
  };
  const initMyFirstName = (firstname) => {
    myContext.initMyFirstName(firstname);
  };
  const initMyLastName = (lastname) => {
    myContext.initMyLastName(lastname);
  };
  const initMyEmail = (email) => {
    myContext.initMyEmail(email);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        gotoApp({
          myUID_: user.uid,
          initMyUID,
          initMyID,
          initMyFirstName,
          initMyLastName,
          initMyEmail,
          startTutorial,
          navigation,
        });
      }
    });

    return unsubscribe;
  }, []);

  const gotoEmailScreen = () => {
    navigation.navigate("LoginScreen");
  };
  const gotoRegisterScreen = () => {
    navigation.navigate("RegisterScreen1");
  };

  return (
    <SafeAreaView
      style={{
        height,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View style={{ padding: height * 0.3, marginBottom: height * 0.2 }}>
        <Mapsee />
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => gotoRegisterScreen()}
      >
        <Text style={styles.buttonText}>이메일로 계속하기</Text>
      </TouchableOpacity>
      <View style={{ flexDirection: "row", marginBottom: 48 }}>
        <Text
          style={{ fontFamily: "NotoSansKR-Bold", size: 12, color: "#545766" }}
        >
          이미 계정이 있으신가요?
        </Text>
        <Text
          style={{ fontFamily: "NotoSansKR-Bold", size: 12, color: "#5ED3CC" }}
          onPress={() => gotoEmailScreen()}
        >
          {" 로그인"}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default BeforeLoginScreen;

const styles = StyleSheet.create({
  container: {
    height,
    justifyContent: "center",
    alignItems: "center",
  },

  button: {
    backgroundColor: "#5ED3CC",
    width: 344,
    height: 48,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },

  registerButton: {
    backgroundColor: "#F4F5F9",
    width: 344,
    height: 48,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontFamily: "NotoSansKR-Bold",
    fontSize: 16,
  },

  registerButtonText: {
    color: "black",
    fontWeight: "700",
    fontSize: 16,
    fontFamily: "NotoSansKR-Bold",
  },
});
