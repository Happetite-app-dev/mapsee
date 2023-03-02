import { View, TextInput, Text } from "react-native";

import GoBackHeader from "../components/GoBackHeader";

const SuggestScreen = ({ navigation }) => {
  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      <GoBackHeader
        navigation={navigation}
        text="의견 보내기"
        rightButton="none"
      />
      <Text style={{ top: 16, left: 26, fontSize: 12, fontWeight: "bold" }}>
        내용
      </Text>
      <View
        style={{
          top: 40,
          left: 23,
          borderBottomColor: "#ADB1C5",
          borderBottomWidth: 1,
          height: 48,
          width: 344,
        }}
      >
        <TextInput
          style={{
            height: 24,
            width: 344,
            marginTop: 12,
            fontSize: 14,
          }}
          placeholder="이런 부분을 이렇게 고쳤으면 좋겠어요!"
        />
      </View>
    </View>
  );
};

export default SuggestScreen;
