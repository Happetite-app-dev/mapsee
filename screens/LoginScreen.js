import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateCurrentUser,
} from "firebase/auth";
import { ref, onValue, set, push, remove, off } from "firebase/database";
import React, { useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import BottomButton from "../components/BottomButton";
import AppContext from "../components/AppContext";
import { auth, database } from "../firebase";
import GoBackHeader from "../components/GoBackHeader";
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
const handleLogin = ({
  email,
  password,
  initMyUID,
  initMyID,
  initMyFirstName,
  initMyLastName,
  initMyEmail,
  startTutorial,
  navigation,
}) => {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredentials) => {
      const user = userCredentials.user;
      updateCurrentUser(auth, user);
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
    })
    .catch((error) => {
      const errorCode = () => {
        switch (error.code) {
          case "auth/user-not-found" || "auth/wrong-password":
            return "이메일 혹은 비밀번호가 일치하지 않습니다.";
          case "auth/email-already-in-use":
            return "이미 사용 중인 이메일입니다.";
          case "auth/weak-password":
            return "비밀번호는 6글자 이상이어야 합니다.";
          case "auth/network-request-failed":
            return "네트워크 연결에 실패 하였습니다.";
          case "auth/invalid-email":
            return "잘못된 이메일 형식입니다.";
          case "auth/internal-error":
            return "잘못된 요청입니다.";
          default:
            return "로그인에 실패 하였습니다.";
        }
      };
      Alert.alert("경고", errorCode());
    });
};
const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [valid, setValid] = useState(false);
  const [secureTextEntry2, setSecureTextEntry2] = useState(true);
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
    if (email.length !== 0) {
      if (password.length !== 0) {
        setValid(true);
      } else setValid(false);
    } else setValid(false);
  }, [email, password]);

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <GoBackHeader
          text={"로그인"}
          rightButton="none"
          goBackFunction={() => navigation.pop()}
        />

        <Text style={styles.textContainer}>이메일</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="mapsee@happetite.com"
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={styles.input}
          />
        </View>

        <Text style={styles.textContainer}>비밀번호</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            style={styles.input}
            secureTextEntry={secureTextEntry2}
          />
          <Text
            style={{
              fontFamily: "NotoSansKR-Bold",
              color: "#5ED3CC",
              size: 12,
              alignSelf: "center",
              right: 0,
              position: "absolute",
            }}
            onPress={() => {
              if (secureTextEntry2) setSecureTextEntry2(false);
              else setSecureTextEntry2(true);
            }}
          >
            표시
          </Text>
        </View>
        <BottomButton
          text={"계속하기"}
          onPressFunction={() =>
            handleLogin({
              email,
              password,
              initMyUID,
              initMyID,
              initMyFirstName,
              initMyLastName,
              initMyEmail,
              startTutorial,
              navigation,
            })
          }
          style={{
            position: "absolute",
            bottom: 40,
            backgroundColor: valid ? "#5ED3CC" : "#F4F5F9",
          }}
          fontColor={valid ? "white" : "black"}
        />
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },

  textContainer: {
    fontSize: 24,
    marginLeft: 23,
    fontFamily: "NotoSansKR-Medium",
    marginTop: 56,
  },

  inputContainer: {
    marginTop: 16,
    marginLeft: 23,
    width: 344,
    height: 48,
    justifyContent: "center",
    borderBottomColor: "#ADB1C5",
    borderBottomWidth: 1,
  },

  input: {
    backgroundColor: "white",
    borderRadius: 10,
    fontFamily: "NotoSansKR-Regular",
    width: 344,
  },

  buttonContainer: {
    width: "80%",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 100,
  },

  button: {
    backgroundColor: "#00CCBD",
    width: "100%",
    padding: 15,
    borderRadius: 10,
  },

  invalidButton: {
    backgroundColor: "white",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 1,
  },

  buttonOutline: {
    backgroundColor: "white",
    marginTop: 5,
    borderColor: "#0782F9",
    borderWidth: 2,
  },

  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },

  invalidButtonText: {
    color: "black",
    fontWeight: "700",
    fontSize: 16,
  },

  buttonOutlineText: {
    color: "#0782F9",
    fontWeight: "700",
    fontSize: 16,
  },
});
