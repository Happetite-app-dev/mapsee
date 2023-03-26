import { TouchableOpacity, Text } from "react-native";

const BottomButton = ({ onPressFunction, text, style, fontColor }) => {
  return (
    <TouchableOpacity
      onPress={onPressFunction}
      style={{
        width: 344,
        height: 48,
        alignSelf: "center",
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F4F5F9",
        ...style,
      }}
    >
      {fontColor === undefined ? (
        <Text style={{ fontSize: 14, fontFamily: "NotoSansKR-Bold" }}>
          {text}
        </Text>
      ) : (
        <Text
          style={{
            fontSize: 14,
            fontFamily: "NotoSansKR-Bold",
            color: fontColor,
          }}
        >
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default BottomButton;
