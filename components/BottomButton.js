import { TouchableOpacity, Text } from "react-native";

const BottomButton = ({ onPressFunction, text }) => {
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
      }}
    >
      <Text style={{ fontSize: 14, fontWeight: "bold" }}>{text}</Text>
    </TouchableOpacity>
  );
};

export default BottomButton;
