import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  remove,
  off,
} from "firebase/database";
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
import { auth } from "../firebase";

const mapseeLogoImage = require("../assets/image/mapsee_logo.png");
const { height } = Dimensions.get("window");

const firebaseConfig = {
  apiKey: "AIzaSyDBq4tZ1QLm1R7iPH8O4dTvebVGWgkRPks",
  authDomain: "mapseedemo1.firebaseapp.com",
  projectId: "mapseedemo1",
  storageBucket: "mapseedemo1.appspot.com",
  messagingSenderId: "839335870793",
  appId: "1:839335870793:web:75004c5d43270610411a98",
  measurementId: "G-8L1MD1CGN2",
};
const app = initializeApp(firebaseConfig);
const db = getDatabase();

const BeforeLoginScreen = ({ navigation }) => {
  const myContext = useContext(AppContext);
  const startTutorial = false;
  const gotoApp = (myUID_) => {
    myContext.initMyUID(myUID_);
    onValue(ref(db, "/users/" + myUID_), (snapshot) => {
      myContext.initMyID(snapshot.child("id").val());
      myContext.initMyFirstName(snapshot.child("firstName").val());
      myContext.initMyLastName(snapshot.child("lastName").val());
      myContext.initMyEmail(snapshot.child("email").val());
    });
    if (!startTutorial) {
      navigation.navigate("Tabs");
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        gotoApp(user.uid);
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
    <View
      style={{
        height,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View style={{ padding: height * 0.3, marginBottom: height * 0.2 }}>
        <Image
          style={{ alignItems: "center", justifyContent: "center" }}
          source={mapseeLogoImage}
        />
      </View>
      <TouchableOpacity onPress={() => gotoEmailScreen()} style={styles.button}>
        <Text style={styles.buttonText}>로그인</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => gotoRegisterScreen()}
        style={styles.registerButton}
      >
        <Text style={styles.registerButtonText}>이메일로 회원가입</Text>
      </TouchableOpacity>
    </View>
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
    backgroundColor: "#00CCBD",
    width: "90%",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15,
  },

  registerButton: {
    backgroundColor: "white",
    width: "90%",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    borderColor: "black",
    borderWidth: 1,
    marginTop: 15,
  },

  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },

  registerButtonText: {
    color: "black",
    fontWeight: "700",
    fontSize: 16,
  },
});
