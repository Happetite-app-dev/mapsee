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
      <Text>내용</Text>
      <TextInput placeholder="이런 부분을 이렇게 고쳤으면 좋겠어요!" />
    </View>
  );
};

export default SuggestScreen;
