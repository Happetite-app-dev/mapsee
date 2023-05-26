import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateCurrentUser,
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
  Alert,
} from "react-native";
import BottomButton from "../components/BottomButton";
import GoBackHeader from "../components/GoBackHeader";
import SnackBar from "../components/SnackBar";

import { auth } from "../firebase";
import { set } from "firebase/database";

const handleSignUp = ({
  email,
  password,
  navigation,
  setVisible,
  setSnackbarText,
}) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredentials) => {
      const user = userCredentials.user;
      updateCurrentUser(auth, user);
      navigation.navigate("RegisterScreen3", {
        uid: user.uid,
        email: user.email,
      });
    })
    .catch((error) => {
      // 에러 코드에 대한 안내 문구 반환하기
      // 사전 유효성 검증 여부 등을 고려해 발생 빈도 순으로 분기처리하는게 좋다.
      switch (error.code) {
        case "auth/user-not-found" || "auth/wrong-password":
          setSnackbarText("이메일 혹은 비밀번호가 일치하지 않습니다.");
          setVisible(true);
          return "이메일 혹은 비밀번호가 일치하지 않습니다.";
        case "auth/email-already-in-use":
          setSnackbarText("이미 사용 중인 이메일입니다.");
          setVisible(true);
          return "이미 사용 중인 이메일입니다.";
        case "auth/weak-password":
          setSnackbarText("비밀번호를 6글자 이상 설정해 주세요.");
          setVisible(true);
          return "비밀번호는 6글자 이상이어야 합니다.";
        case "auth/invalid-email":
          setSnackbarText("잘못된 이메일 형식입니다.");
          setVisible(true);
          return "잘못된 이메일 형식입니다.";

        case "auth/network-request-failed":
          setSnackbarText("네트워크 연결에 실패하였습니다.");
          setVisible(true);
          return "네트워크 연결에 실패하였습니다.";
        case "auth/internal-error":
          setSnackbarText("잘못된 요청입니다.");
          setVisible(true);
          return "잘못된 요청입니다.";
        case "auth/too-many-requests":
          setSnackbarText(
            "너무 많은 로그인 시도로 인해이 계정이 비활성화되었습니다. 나중에 다시 시도하세요."
          );
          setVisible(true);
          return "너무 많은 로그인 시도로 인해이 계정이 비활성화되었습니다. 나중에 다시 시도하십시오.";
        default:
          setSnackbarText("로그인에 실패하였습니다.");
          setVisible(true);
          return "로그인에 실패 하였습니다.";
      }
      // Alert.alert("경고", errorCode());
    });
};
const RegisterScreen2 = ({ navigation, route }) => {
  const email = route.params;
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [secureTextEntry1, setSecureTextEntry1] = useState(true);
  const [secureTextEntry2, setSecureTextEntry2] = useState(true);
  const [valid, setValid] = useState(false);
  const [visible, setVisible] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");
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
          placeholder="6자리 이상 비밀번호를 입력해 주세요"
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
          if (valid)
            handleSignUp({
              email,
              password,
              navigation,
              setVisible,
              setSnackbarText,
            });
          else {
            setVisible(true);
            setSnackbarText("비밀번호를 다시 확인해주세요.");
          }
        }}
        style={{
          position: "absolute",
          bottom: 40,
          backgroundColor: valid ? "#5ED3CC" : "#F4F5F9",
        }}
        fontColor={valid ? "white" : "black"}
      />
      <SnackBar
        visible={visible}
        onDismissSnackBar={() => {
          setVisible(false);
        }}
        text={snackbarText}
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
