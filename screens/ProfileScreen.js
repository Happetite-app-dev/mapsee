import { useContext } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import { RotateOutUpLeft } from "react-native-reanimated";

import AppContext from "../components/AppContext";
import GoBackHeader from "../components/GoBackHeader";

const goBackImage = require("../assets/image/goBack.png");

const gotoMypageScreen = ({ navigation }) => {
  navigation.pop();
};
const ProfileScreen = ({ navigation }) => {
  const myContext = useContext(AppContext);
  const myName = myContext.myLastName + myContext.myFirstName;
  const myID = myContext.myID;
  const myEmail = myContext.myEmail;

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
        <Text style={{ marginLeft: 24, fontWeight: "400" }}>{myID}</Text>
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
