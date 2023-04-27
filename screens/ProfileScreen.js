import { useContext, useState } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import SnackBar from "../components/SnackBar";
import AppContext from "../components/AppContext";
import GoBackHeader from "../components/GoBackHeader";
import Copy from "../assets/image/Copy.svg";

const ProfileScreen = ({ navigation }) => {
  const myContext = useContext(AppContext);
  const myName = myContext.myLastName + myContext.myFirstName;
  const myID = myContext.myID;
  const myEmail = myContext.myEmail;
  const [visible, setVisible] = useState(false);

  const copyToClipboard = async (string) => {
    await Clipboard.setStringAsync(string);
  };

  return (
    <View style={styles.container}>
      <GoBackHeader navigation={navigation} text="프로필" rightButton="none" />

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
            left: 23,
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
            <Text
              style={{
                fontWeight: "400",
                fontFamily: "NotoSansKR-Regular",
                top: 12,
                height: 36,
              }}
            >
              {myContext.myLastName}
            </Text>
          </View>
          <View
            style={{
              borderBottomColor: "#ADB1C5",
              borderBottomWidth: 1,
              width: 152,
              marginLeft: 24,
            }}
          >
            <Text
              style={{
                fontWeight: "400",
                fontFamily: "NotoSansKR-Regular",
                top: 12,
                height: 36,
              }}
            >
              {myContext.myFirstName}
            </Text>
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
          }}
        >
          아이디
        </Text>
        <View
          style={{
            marginLeft: 24,
            fontWeight: "400",
            flexDirection: "row",
            fontFamily: "NotoSansKR-Regular",
          }}
        >
          <Text>{myID}</Text>
          <TouchableOpacity
            onPress={() => {
              copyToClipboard(myID);
              setVisible(true);
            }}
            style={{ left: 16, top: -4 }}
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
          }}
        >
          이메일
        </Text>
        <Text
          style={{
            marginLeft: 24,
            fontFamily: "NotoSansKR-Regular",
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
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
});
