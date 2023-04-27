import { View, TextInput, Text, Linking } from "react-native";
import BottomButton from "../components/BottomButton";
import qs from "qs";
import GoBackHeader from "../components/GoBackHeader";

async function sendEmail(to, subject, body, options = {}) {
  const { cc, bcc } = options;

  let url = `mailto:${to}`;

  // Create email link query
  const query = qs.stringify({
    subject: subject,
    body: body,
    cc: cc,
    bcc: bcc,
  });

  if (query.length) {
    url += `?${query}`;
  }

  // check if we can use this link
  const canOpen = await Linking.canOpenURL(url);

  if (!canOpen) {
    throw new Error("Provided URL can not be handled");
  }

  return Linking.openURL(url);
}

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
      <BottomButton
        text={"의견 보내기"}
        style={{ top: 592 }}
        onPressFunction={() => {
          sendEmail("parkjeong02@gmail.com", "mapsee", "this is dmmm").then();
        }}
      />
    </View>
  );
};

export default SuggestScreen;
