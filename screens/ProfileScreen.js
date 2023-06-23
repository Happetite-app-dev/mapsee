import { useContext, useState } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import SnackBar from "../components/SnackBar";
import AppContext from "../components/AppContext";
import GoBackHeader from "../components/GoBackHeader";
import BottomButton from "../components/BottomButton";
import Copy from "../assets/image/Copy.svg";
import { database, auth } from "../firebase";
import { ref, set } from "firebase/database";
import { QueryClient, useQueryClient } from "react-query";
import { updateEmail } from "firebase/auth";
import WritingImage from "../assets/icons/Edit.svg";
import Upload from "../assets/icons/Upload.svg";

const ProfileScreen = ({ navigation }) => {
  const user = auth.currentUser;

  const myContext = useContext(AppContext);
  const myID = myContext.myID;
  const myEmail = myContext.myEmail;
  const [visible, setVisible] = useState(false);
  const [editable, setEditable] = useState(false);

  const [lastName, setLastName] = useState(myContext.myLastName);
  const [firstName, setFirstName] = useState(myContext.myFirstName);
  const [id, setID] = useState(myContext.myID);
  const [email, setEmail] = useState(myContext.myEmail);

  const queryClient = useQueryClient();

  const copyToClipboard = async (string) => {
    await Clipboard.setStringAsync(string);
  };

  return (
    <View style={styles.container}>
      <GoBackHeader navigation={navigation} text="프로필" rightButton="none" />
      <TouchableOpacity
        style={{
          position: "absolute",
          top: 48,
          height: 24,
          justifyContent: "center",
          right: 24,
        }}
        onPress={() => {
          if (!editable) setEditable(true);
          else {
            myContext.initMyID(id);
            myContext.initMyFirstName(firstName);
            myContext.initMyLastName(lastName);
            myContext.initMyEmail(email);

            updateEmail(user, email).then(() => {
              console.log("email updated");
            });

            const idRef = ref(database, `users/${myContext.myUID}/id`);
            const firstNameRef = ref(
              database,
              `users/${myContext.myUID}/firstName`
            );
            const lastNameRef = ref(
              database,
              `users/${myContext.myUID}/lastName`
            );
            const emailRef = ref(database, `users/${myContext.myUID}/email`);

            set(idRef, id);
            set(firstNameRef, firstName);
            set(lastNameRef, lastName);
            set(emailRef, email);

            queryClient.invalidateQueries(["users", myContext.myUID]);
            setEditable(false);
          }
        }}
      >
        {!editable ? <WritingImage /> : <Upload />}
      </TouchableOpacity>
      <View
        style={{
          position: "absolute",
          top: 105,
          width: "100%",
          height: 24,
          marginTop: 24,
          flexDirection: "column",
        }}
      >
        <Text
          style={{
            marginLeft: 24,
            fontSize: 14,
            fontFamily: "NotoSansKR-Medium",
          }}
        >
          이름
        </Text>
        <View
          style={{
            flexDirection: "row",
            top: 16,
            height: 48,
            left: "100%",
            width: 344,
          }}
        >
          <View
            style={{
              borderBottomColor: "#ADB1C5",
              borderBottomWidth: 1,
              width: 80,
            }}
          >
            <TextInput
              editable={editable}
              style={{
                ...styles.TextInput,
                height: 48,
                color: "#000000",
              }}
              defaultValue={myContext.myLastName}
              onChangeText={(text) => {
                setLastName(text);
              }}
            />
          </View>
          <View
            style={{
              borderBottomColor: "#ADB1C5",
              borderBottomWidth: 1,
              width: 152,
              marginLeft: 24,
            }}
          >
            <TextInput
              editable={editable}
              style={{
                ...styles.TextInput,
                height: 48,
                color: "#000000",
              }}
              defaultValue={myContext.myFirstName}
              onChangeText={(text) => {
                setFirstName(text);
              }}
            />
          </View>
        </View>
      </View>
      <View
        style={{
          position: "absolute",
          top: 241,
          width: "100%",
          height: 24,
          flexDirection: "row",
        }}
      >
        <Text
          style={{
            marginLeft: 24,
            fontSize: 14,
            fontFamily: "NotoSansKR-Medium",
            lineHeight: 24,
            height: 24,
          }}
        >
          아이디
        </Text>
        <View
          style={{
            fontWeight: "400",
            flexDirection: "row",
            fontFamily: "NotoSansKR-Regular",
          }}
        >
          <Text
            style={{
              ...styles.TextInput,
              height: 24,
              marginLeft: 24,
              color: "#000000",
            }}
            underlineColor="rgba(0,0,0,0)"
            defaultValue={myID}
            onChangeText={(text) => {
              setID(text);
            }}
          >
            {myID}
          </Text>
          <TouchableOpacity
            onPress={() => {
              copyToClipboard(myID);
              setVisible(true);
            }}
            style={{ left: 16, top: 0 }}
          >
            <Copy />
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          position: "absolute",
          top: 289,
          width: "100%",
          height: 24,
          flexDirection: "row",
        }}
      >
        <Text
          style={{
            marginLeft: 24,
            fontSize: 14,
            fontFamily: "NotoSansKR-Medium",
            lineHeight: 24,
          }}
        >
          이메일
        </Text>
        <Text
          style={{
            ...styles.TextInput,
            height: 24,
            marginLeft: 24,
            color: "#000000",
          }}
          defaultValue={myEmail}
          onChangeText={(text) => {
            setEmail(text);
          }}
        >
          {myEmail}
        </Text>
      </View>

      <SnackBar
        visible={visible}
        onDismissSnackBar={() => {
          setVisible(false);
        }}
        text={`아이디(@${myID})가 복사되었습니다.`}
      />
      {editable ? (
        <TouchableOpacity // 탈퇴
          style={{
            width: "100%",
            flexDirection: "row",
            bottom: 0,
            position: "absolute",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => {
            navigation.navigate("WithdrawalScreen");
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: "NotoSansKR-Regular",
              lineHeight: 24,
              color: "#ADB1C5",
              height: 24,
              bottom: 40,
            }}
          >
            회원탈퇴
          </Text>
        </TouchableOpacity>
      ) : (
        <></>
      )}
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  TextInput: {
    fontFamily: "NotoSansKR-Regular",
    fontSize: 14,
    backgroundColor: "rgba(0, 0, 0, 0)",
    height: 24,
  },
});
