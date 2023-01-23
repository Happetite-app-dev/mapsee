import { useState, View, Button, Text } from "react-native";
import { Snackbar } from "react-native-paper"; // Snackbar -> 요거 다운로드

// 이만큼 그 screen 함수(?) 안에
import Close from "../assets/icons/closeWhite.svg";

const SnackBar = ({ visible, onDismissSnackBar, text }) => {
  return (
    <Snackbar
      visible={visible}
      onDismiss={onDismissSnackBar}
      style={{
        backgroundColor: "#545766",
        borderRadius: 8,
        fontSize: 14,
        lineHeight: 24,
        letterSpacing: -0.5,
      }}
      children={
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#545766",
          }}
          onTouchEndCapture={onDismissSnackBar}
        >
          <Close color="#FFFFFF" />
          <Text
            style={{ fontSize: 14, lineHeight: 24, color: "white", left: 20.5 }}
          >
            {text}
          </Text>
        </View>
      }
    />
  );
};
//<Button onPress={onToggleSnackBar} title = "Snackbar"></Button>

export default SnackBar;
