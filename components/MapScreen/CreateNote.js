import { View, Animated } from "react-native";
import CreateNote_back from "../../assets/image/CreateNote_back.svg";
import CreateNote_front from "../../assets/image/CreateNote_front.svg";
import { Easing } from "react-native-reanimated";
import { useEffect } from "react";
import { useIsFetching } from "react-query";
import { useIsFocused } from "@react-navigation/native";

const rotateValueHolder = new Animated.Value(0);

const CurrentRotate = (isFocused) => {
  if (isFocused) {
    rotateValueHolder.setValue(0);
    Animated.loop(
      Animated.timing(rotateValueHolder, {
        toValue: 1,
        duration: 5000,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
      { iteration: 4 }
    ).start();
  }
};

export const CreateNote = ({
  navigation,
  style,
  isFocused,
  onTouchFunction,
  pop,
  placeID,
  placeName,
  address,
  lctn,
}) => {
  const RotateData = rotateValueHolder.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  useEffect(() => {
    CurrentRotate(isFocused); //나중에 혹시나 수정 필요
  });

  return (
    <View
      style={style}
      onTouchEndCapture={() => {
        if (pop) navigation.pop();
        navigation.push("EditScreen", {
          recordID: undefined,
          placeID,
          placeName,
          address,
          lctn,
        });
      }}
    >
      <Animated.View
        style={{
          position: "absolute",
          transform: [{ rotate: RotateData }],
          width: 48,
          height: 48,
        }}
        onTouchEndCapture={onTouchFunction}
      >
        <CreateNote_back style={{ position: "absolute" }} />
      </Animated.View>
      <CreateNote_front style={{ left: 15, top: 15 }} />
    </View>
  );
};
