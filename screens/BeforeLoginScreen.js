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
import { auth, database } from "../firebase";

const mapseeLogoImage = require("../assets/image/mapsee_logo.png");
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
