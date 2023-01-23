import { View, TextInput, Text, StyleSheet } from "react-native";

import GoBackHeader from "../components/GoBackHeader";

const SuggestScreen = ({ navigation }) => {
  return (
    <View
      style={{ backgroundColor: "white", flex: 1, flexDirection: "column" }}
    >
      <GoBackHeader
        navigation={navigation}
        text="의견 보내기"
        rightButton="none"
      />
      <Text style={styles.contents}>내용</Text>
      <TextInput
        placeholder="이런 부분을 이렇게 고쳤으면 좋겠어요!"
        style={styles.textInput}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  contents: {
    top: 16,
    left: 26,
    lineHeight: 16,
    fontSize: 12,
    fontWeight: "bold",
  },
  textInput: { top: 20, left: 26 },
});

export default SuggestScreen;
