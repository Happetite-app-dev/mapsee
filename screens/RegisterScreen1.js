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
import GoBackHeader from "../components/GoBackHeader";
import BottomButton from "../components/BottomButton";
const handleSignUp = ({ navigation, email }) => {
  navigation.navigate("RegisterScreen2", email);
};
const validate = (text) => {
  const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
  return reg.test(text);
};
const RegisterScreen1 = ({ navigation }) => {
  const [email, setEmail] = useState("");

  return (
    <View style={styles.container}>
      <GoBackHeader
        text={"회원가입"}
        rightButton="none"
        goBackFunction={() => navigation.pop()}
      />
      <Text style={styles.textContainer}>이메일을 입력해주세요</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="mapsee@happetite.com"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
        />
      </View>
      <BottomButton
        text={"계속하기"}
        onPressFunction={() => handleSignUp({ navigation, email })}
        style={{ position: "absolute", bottom: 40 }}
      />
    </View>
  );
};

export default RegisterScreen1;

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
