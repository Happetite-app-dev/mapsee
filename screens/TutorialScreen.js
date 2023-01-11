import LottieView from "lottie-react-native";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

const TutorialScreen = ({ navigation, route }) => {
  const { onChangeGetPermissions } = route.params;
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
        <LottieView
          source={require("../assets/tutorial01.json")}
          autoPlay
          loop
        />
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
        <LottieView
          source={require("../assets/tutorial002.json")}
          autoPlay
          loop
        />
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
        <LottieView
          source={require("../assets/tutorial003.json")}
          autoPlay
          loop
        />
      </View>
    );
  }

  if (tuto4) {
    return (
      <View
        style={styles.container}
        onTouchEndCapture={() => {
          navigation.goBack();
          onChangeGetPermissions(true);
        }}
      >
        <LottieView
          source={require("../assets/animation.json")}
          autoPlay
          loop
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "stretch",
    justifyContent: "center",
  },
});

export default TutorialScreen;
