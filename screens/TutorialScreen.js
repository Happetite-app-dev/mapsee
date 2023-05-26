import LottieView from "lottie-react-native";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import Tutorial1 from "../assets/tutorial/tutorial-0.svg";
import Tutorial2 from "../assets/tutorial/tutorial-1.svg";
import Tutorial3 from "../assets/tutorial/tutorial-2.svg";
import Tutorial4 from "../assets/tutorial/tutorial-3.svg";

const TutorialScreen = ({ navigation, route }) => {
  const [tuto1, setTuto1] = useState(true);
  const [tuto2, setTuto2] = useState(false);
  const [tuto3, setTuto3] = useState(false);
  const [tuto4, setTuto4] = useState(false);

  if (tuto1) {
    return (
      <View
        style={styles.container}
        onTouchEndCapture={() => {
          setTuto1(false);
          setTuto2(true);
        }}
      >
        <Tutorial1 style={{ flex: 1 }} />
      </View>
    );
  }

  if (tuto2) {
    return (
      <View
        style={styles.container}
        onTouchEndCapture={() => {
          setTuto2(false), setTuto3(true);
        }}
      >
        <Tutorial2 style={{ flex: 1 }} />
      </View>
    );
  }

  if (tuto3) {
    return (
      <View
        style={styles.container}
        onTouchEndCapture={() => {
          setTuto3(false);
          setTuto4(true);
        }}
      >
        <Tutorial3 style={{ flex: 1 }} />
      </View>
    );
  }

  if (tuto4) {
    return (
      <View
        style={styles.container}
        onTouchEndCapture={() => {
          console.log("tuto4", route.params);
          route.params.onChangeGetPermissions(true);
          navigation.goBack();
        }}
      >
        <Tutorial4 style={{ flex: 1 }} />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0)",
    alignItems: "stretch",
    justifyContent: "center",
  },
});

export default TutorialScreen;
