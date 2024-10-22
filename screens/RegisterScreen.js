import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from "react-native";

import AppContext from "../components/AppContext";
import { auth } from "../firebase";

const { height } = Dimensions.get("window");
const gotoApp = ({ myID_, initMyID, startTutorial, navigation }) => {
  initMyID(myID_);
  if (!startTutorial) {
    navigation.navigate("Tabs");
  }
};
const handleSignUp = ({
  email,
  password,
  initMyID,
  startTutorial,
  navigation,
}) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredentials) => {
      const user = userCredentials.user;
      gotoApp({ myID_: user.uid, initMyID, startTutorial, navigation });
      //navigation.navigate("AfterLoginScreen", user.uid)
    })
    .catch((error) => alert(error.message));
};
const RegisterScreen = ({ navigation }) => {
  const myContext = useContext(AppContext);
  const startTutorial = false;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [id, setId] = useState("");
  const [valid, setValid] = useState(false);
  const initMyID = (id) => {
    myContext.initMyID(id);
  };
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        //navigation.replace("Home")
      }
    });

    return unsubscribe;
  }, []);

  const ContinueButton = () => {
    useEffect(() => {
      if (id.length !== 0) {
        if (password === passwordCheck) {
          setValid(true);
        } else {
          setValid(false);
        }
      } else setValid(false);
    }, [id, password, passwordCheck]);
    if (valid) {
      return (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() =>
              handleSignUp(email, password, initMyID, startTutorial, navigation)
            }
            style={styles.button}
          >
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Text style={styles.buttonText}>계속하기</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.invalidButton}>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Text style={styles.invalidButtonText}>계속하기</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ width: "100%", marginBottom: 10 }}>
        <Text style={styles.textContainer}>개인정보를 입력해주세요</Text>
      </View>
      <View style={styles.inputContainer}>
        <Text style={{ fontSize: 13, marginLeft: 14 }}>이메일</Text>
        <View
          style={{
            borderBottomColor: "#ADB1C5",
            borderBottomWidth: 1,
            marginTop: 5,
            paddingVertical: 10,
            marginHorizontal: 10,
          }}
        >
          <TextInput
            placeholder="mapsee@happetite.com"
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={styles.input}
          />
        </View>

        <Text style={{ fontSize: 13, marginLeft: 14, marginTop: 20 }}>
          아이디
        </Text>
        <View
          style={{
            borderBottomColor: "#ADB1C5",
            borderBottomWidth: 1,
            marginTop: 5,
            paddingVertical: 10,
            marginHorizontal: 10,
          }}
        >
          <TextInput
            placeholder="mapsee"
            value={id}
            onChangeText={(text) => setId(text)}
            style={styles.input}
          />
        </View>
        <Text style={{ fontSize: 13, marginLeft: 14, marginTop: 20 }}>
          비밀번호
        </Text>
        <View
          style={{
            borderBottomColor: "#ADB1C5",
            borderBottomWidth: 1,
            marginTop: 5,
            paddingVertical: 10,
            marginHorizontal: 10,
          }}
        >
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            style={styles.input}
            secureTextEntry
          />
        </View>
        <Text style={{ fontSize: 13, marginLeft: 14, marginTop: 20 }}>
          비밀번호 확인
        </Text>
        <View
          style={{
            borderBottomColor: "#ADB1C5",
            borderBottomWidth: 1,
            marginTop: 5,
            paddingVertical: 10,
            marginHorizontal: 10,
          }}
        >
          <TextInput
            placeholder="Password Check"
            value={passwordCheck}
            onChangeText={(text) => setPasswordCheck(text)}
            style={styles.input}
            secureTextEntry
          />
        </View>
      </View>
      <ContinueButton />
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    height: height * 1.1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },

  textContainer: {
    fontWeight: "600",
    fontSize: 20,
    marginBottom: 20,
    alignItems: "flex-start",
    marginLeft: 30,
  },

  inputContainer: {
    flex: 0.7,
    width: "90%",
  },

  input: {
    backgroundColor: "white",
    borderRadius: 10,
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
