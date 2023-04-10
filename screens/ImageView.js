import {
  Image,
  StyleSheet,
  View,
  SafeAreaView,
  Button,
  Animated,
  TouchableOpacity,
  Text,
} from "react-native";
import Close from "../assets/icons/Close.svg";

const ImageView = ({ navigation, route }) => {
  return (
    <SafeAreaView
      style={{
        backgroundColor: "#fff",
        flex: 1,
        alignItems: "center",
      }}
    >
      <View
        onTouchEndCapture={() => {
          navigation.goBack();
        }}
        style={styles.goHome}
      >
        <Close height={24} />
      </View>
      <Image
        source={{ uri: route.params }}
        style={{ width: 344, height: 344, borderRadius: 8, top: 164.5 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  goHome: {
    width: 24,
    height: 24,
    left: 27.5,
    top: 45,
    position: "absolute",
  },
});
export default ImageView;
