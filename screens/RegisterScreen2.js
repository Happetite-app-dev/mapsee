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

import { auth } from "../firebase";

const { height } = Dimensions.get("window");

const RegisterScreen2 = ({ navigation, route }) => {
  const email = route.params;
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  //const [id,setId]=useState('')
  const [valid, setValid] = useState(false);

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        //console.log(user.email);
        navigation.navigate("RegisterScreen3", {
          uid: user.uid,
          email: user.email,
        });
      })
      .catch((error) => alert(error.message));
  };

  const ContinueButton = () => {
    useEffect(() => {
      if (password.length !== 0) {
        if (password === passwordCheck) {
          setValid(true);
        } else {
          setValid(false);
        }
      } else setValid(false);
    }, [password, passwordCheck]);
    if (valid) {
      return (
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleSignUp} style={styles.button}>
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

export default RegisterScreen2;

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
