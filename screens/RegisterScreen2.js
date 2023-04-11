import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import BottomButton from "../components/BottomButton";
import GoBackHeader from "../components/GoBackHeader";
import SnackBar from "../components/SnackBar";

import { auth } from "../firebase";

const handleSignUp = ({ email, password, navigation }) => {
  console.log("userCredentials created");

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredentials) => {
      const user = userCredentials.user;
      console.log("userCredentials created");
      navigation.navigate("RegisterScreen3", {
        uid: user.uid,
        email: user.email,
      });
    })
    .catch((error) => alert(error.message));
};
const RegisterScreen2 = ({ navigation, route }) => {
  const email = route.params;
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [secureTextEntry1, setSecureTextEntry1] = useState(true);
  const [secureTextEntry2, setSecureTextEntry2] = useState(true);
  const [valid, setValid] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (password.length !== 0 && password.length >= 6) {
      if (password === passwordCheck) {
        setValid(true);
      } else {
        setValid(false);
      }
    } else setValid(false);
  }, [password, passwordCheck]);

  return (
    <View style={styles.container}>
      <GoBackHeader
        text={"회원가입"}
        rightButton="none"
        goBackFunction={() => navigation.pop()}
      />

      <Text style={styles.textContainer}>비밀번호 입력</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="8자리 이상, 영문 소문자와 숫자를 포함해주세요"
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={styles.input}
          secureTextEntry={secureTextEntry1}
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
            if (secureTextEntry1) setSecureTextEntry1(false);
            else setSecureTextEntry1(true);
          }}
        >
          표시
        </Text>
      </View>

      <Text style={styles.textContainer}>비밀번호 확인</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="다시 한 번 입력해주세요"
          value={passwordCheck}
          onChangeText={(text) => setPasswordCheck(text)}
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
        onPressFunction={() => {
          if (valid) handleSignUp({ email, password, navigation });
          else setVisible(true);
        }}
        style={{
          position: "absolute",
          bottom: 40,
          backgroundColor: valid ? "#5ED3CC" : "#F4F5F9",
        }}
      />
      <SnackBar
        visible={visible}
        onDismissSnackBar={() => {
          setVisible(false);
        }}
        text={`비밀번호를 다시 확인해주세요.`}
      />
    </View>
  );
};

export default RegisterScreen2;

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
    borderBottomColor: "#ADB1C5",
    borderBottomWidth: 1,
    flexDirection: "row",
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
