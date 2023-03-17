import { View, TextInput, Text } from "react-native";
import BottomButton from "../components/BottomButton";

import GoBackHeader from "../components/GoBackHeader";

const SuggestScreen = ({ navigation }) => {
  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      <GoBackHeader
        navigation={navigation}
        text="의견 보내기"
        rightButton="none"
      />
      <Text
        style={{
          top: 16,
          left: 26,
          fontSize: 12,
          fontFamily: "NotoSansKR-Bold",
        }}
      >
        내용
      </Text>
      <View
        style={{
          top: 24,
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
            fontFamily: "NotoSansKR-Medium",
          }}
          placeholder="이런 부분을 이렇게 고쳤으면 좋겠어요!"
        />
      </View>
      <BottomButton text={"의견 보내기"} style={{ top: 592 }} />
    </View>
  );
};

export default SuggestScreen;
