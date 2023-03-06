import { useContext } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import * as Clipboard from "expo-clipboard";

import AppContext from "../components/AppContext";
import GoBackHeader from "../components/GoBackHeader";
import Copy from "../assets/icons/Friend.svg";

const ProfileScreen = ({ navigation }) => {
  const myContext = useContext(AppContext);
  const myName = myContext.myLastName + myContext.myFirstName;
  const myID = myContext.myID;
  const myEmail = myContext.myEmail;

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
          flexDirection: "row",
        }}
      >
        <Text style={{ marginLeft: 24, fontSize: 14, fontWeight: "bold" }}>
          이름
        </Text>
        <Text style={{ marginLeft: 24, fontWeight: "400" }}>{myName}</Text>
      </View>
      <View
        style={{
          position: "absolute",
          top: 177,
          width: "100%",
          height: 24,
          flexDirection: "row",
        }}
      >
        <Text style={{ marginLeft: 24, fontSize: 14, fontWeight: "bold" }}>
          아이디
        </Text>
        <View
          style={{
            marginLeft: 24,
            fontWeight: "400",
            flexDirection: "row",
          }}
        >
          <Text>{myID}</Text>
          <TouchableOpacity
            onPress={() => copyToClipboard(myID)}
            style={{ left: 16 }}
          >
            <Copy />
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          position: "absolute",
          top: 225,
          width: "100%",
          height: 24,
          flexDirection: "row",
        }}
      >
        <Text style={{ marginLeft: 24, fontSize: 14, fontWeight: "bold" }}>
          이메일
        </Text>
        <Text style={{ marginLeft: 24, fontWeight: "400" }}>{myEmail}</Text>
      </View>
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
