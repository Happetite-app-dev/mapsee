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
} from "react-native";

import AppContext from "../components/AppContext";
import { auth, database } from "../firebase";
import GoBackHeader from "../components/GoBackHeader";
import BottomButton from "../components/BottomButton";
import SnackBar from "../components/SnackBar";

const saveUser = async ({ uid, email, id, firstName, lastName }) => {
  const db = database;
  const reference1 = ref(db, "/users/" + uid);
  set(reference1, {
    id,
    email,
    firstName,
    lastName,
  });
  const referenceFolder = ref(db, "/folders"); //folders에 push
  const now = new Date();
  const newFolderID = push(referenceFolder, {
    initFolderName: "기본 폴더",
    initFolderColor: "#EB7A7C",
    updateDate: now.toString(),
  }).key;
  const reference2 = ref(db, `/folders/${newFolderID}/folderName/${uid}`); //folderName 개인화
  set(reference2, "기본 폴더");
  const reference3 = ref(db, `/folders/${newFolderID}/folderColor/${uid}`); //folderColor 개인화
  set(reference3, "#EB7A7C");
  const reference4 = ref(db, `/folders/${newFolderID}/userIDs/${uid}`); //folders/newfolderID/userIDs에 userID:true를 넣기
  set(reference4, true);
  const reference5 = ref(db, `users/${uid}/folderIDs/${newFolderID}`); //user에 folderID를 넣고
  set(reference5, true);
};
const gotoApp = ({
  initMyUID,
  initMyID,
  initMyFirstName,
  initMyLastName,
  initMyEmail,
  startTutorial,
  navigation,
}) => {
  console.log("init start");

  initMyUID();
  initMyID();
  initMyFirstName();
  initMyLastName();
  initMyEmail();
  console.log("init end");
  navigation.navigate("Tabs");
  //startTutorial 이 true라면 afterScreen.js로 이동필요
};

const regex = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]+$/;
const RegisterScreen3 = ({ navigation, route }) => {
  const { uid, email } = route.params;

  const [id, setId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [valid, setValid] = useState(false);
  const [visible, setVisible] = useState(false);
  const [validFirst, setValidFirst] = useState(false);
  const [validLast, setValidLast] = useState(false);
  const [validID, setValidID] = useState(false);

  useEffect(() => {
    setValidFirst(regex.test(firstName));
  }, [validFirst]);
  useEffect(() => {
    setValidFirst(regex.test(lastName));
  }, [validLast]);
  useEffect(() => {
    setValidFirst(regex.test(firstName));
  }, [validID]);

  useEffect(() => {
    if (
      id.length >= 0 &&
      id.length <= 20 &&
      firstName.length >= 0 &&
      firstName.length <= 10 &&
      lastName.length >= 0 &&
      lastName.length <= 10
    )
      setValid(true); // length validness
  }, [id | firstName | lastName]);
  const myContext = useContext(AppContext);
  const startTutorial = false;
  const initMyUID = () => {
    myContext.initMyUID(uid);
  };
  const initMyID = () => {
    myContext.initMyID(id);
  };
  const initMyFirstName = () => {
    myContext.initMyFirstName(firstName);
  };
  const initMyLastName = () => {
    myContext.initMyLastName(lastName);
  };
  const initMyEmail = () => {
    myContext.initMyEmail(email);
  };

  const handleSignUp = async () => {
    console.log("handleSignUp");
    await saveUser({ uid, email, id, firstName, lastName }).then(() => {
      console.log("init start");
      initMyUID();
      initMyID();
      initMyFirstName();
      initMyLastName();
      initMyEmail();
      console.log("init end");
      navigation.navigate("Tabs");
    });
  };

  return (
    <View style={styles.container}>
      <GoBackHeader
        text={"회원가입"}
        rightButton="none"
        goBackFunction={() => navigation.pop()}
      />
      <Text style={styles.textContainer}>아이디를 입력해주세요</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="mapsee"
          value={id}
          onChangeText={(text) => setId(text)}
          style={{ width: 344, ...styles.input }}
        />
      </View>
      <Text style={styles.textContainer}>이름을 입력해주세요</Text>
      <View
        style={{
          flexDirection: "row",
          height: 48,
          width: 344,
        }}
      >
        <View style={styles.inputContainer1}>
          <TextInput
            placeholder="성"
            value={lastName}
            onChangeText={(text) => setLastName(text)}
            style={{ marginRight: 24, width: 80, ...styles.input }}
          />
        </View>
        <View style={styles.inputContainer2}>
          <TextInput
            placeholder="이름"
            value={firstName}
            onChangeText={(text) => setFirstName(text)}
            style={{ width: 152, ...styles.input }}
          />
        </View>
      </View>

      <BottomButton
        text={"회원가입"}
        onPressFunction={() => {
          console.log("bottombutton", valid);
          if (valid) handleSignUp();
          else setVisible(true);
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
        text={`이름을 10자리 이내로 입력해주세요.`}
      />
    </View>
  );
};

export default RegisterScreen3;

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
  inputContainer1: {
    marginTop: 16,
    marginLeft: 23,
    width: 80,
    height: 48,
    borderBottomColor: "#ADB1C5",
    borderBottomWidth: 1,
    flexDirection: "row",
  },
  inputContainer2: {
    marginTop: 16,
    marginLeft: 23,
    width: 152,
    height: 48,
    borderBottomColor: "#ADB1C5",
    borderBottomWidth: 1,
    flexDirection: "row",
  },

  input: {
    backgroundColor: "white",
    borderRadius: 10,
    fontFamily: "NotoSansKR-Regular",
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
