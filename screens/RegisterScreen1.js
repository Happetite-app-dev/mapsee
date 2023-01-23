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

const { height } = Dimensions.get("window");
const handleSignUp = ({ navigation, email }) => {
  navigation.navigate("RegisterScreen2", email);
};
const validate = (text) => {
  const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
  //console.log(text, reg.test(text));
  return reg.test(text);
};
const RegisterScreen1 = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [valid, setValid] = useState(false);

  const ContinueButton = () => {
    useEffect(() => {
      const whetherValid = validate(email);
      if (whetherValid) {
        setValid(true);
        //console.log("correct")
      } else {
        setValid(false);
        //console.log("wrong")
      }
    }, [email]);
    if (valid) {
      return (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => handleSignUp({ navigation, email })}
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
        <Text style={styles.textContainer}>이메일을 입력해주세요</Text>
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
      </View>
      <ContinueButton />
    </View>
  );
};

export default RegisterScreen1;

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
