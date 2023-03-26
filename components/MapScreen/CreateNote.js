import { StyleSheet, View, Animated } from "react-native";
import CreateNote_back from "../../assets/image/CreateNote_back";
import CreateNote_front from "../../assets/image/CreateNote_front";
import { Easing } from "react-native-reanimated";
import { useEffect } from "react";

const rotateValueHolder = new Animated.Value(0);

const CurrentRotate = (isFocused) => {
  if (isFocused) {
    rotateValueHolder.setValue(0);
    Animated.loop(
      Animated.timing(rotateValueHolder, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
      { iteration: 4 }
    ).start();
  }
};

export const CreateNote = ({ navigation, isFocused }) => {
  const RotateData = rotateValueHolder.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  useEffect(() => {
    CurrentRotate(isFocused); //나중에 혹시나 수정 필요
  });

  return (
    <View
      style={styles.createNote}
      onTouchEndCapture={() => {
        navigation.navigate("EditScreen", 0);
      }}
    >
      <Animated.View
        style={{
          position: "absolute",
          transform: [{ rotate: RotateData }],
          width: 48,
          height: 48,
        }}
      >
        <CreateNote_back style={{ position: "absolute" }} />
      </Animated.View>
      <CreateNote_front style={{ left: 15, top: 15 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  createNote: {
    position: "relative",
    width: 48,
    height: 48,
    borderRadius: 24,
    left: 319,
    bottom: 112,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.5,
  },
});
