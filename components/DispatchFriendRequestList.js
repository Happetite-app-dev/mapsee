import { Pressable, SafeAreaView, Text, View, StyleSheet } from "react-native";
import { useUserQuery } from "../queries";
import TimeDisplay from "./NoticeScreen/TimeDisplay";

const DispatchFriendRequestList = ({ approverUID, time }) => {
  const query = useUserQuery(approverUID);
  const approverID = query.data?.id;
  const approverFirstName = query.data?.firstName;
  const approverLastName = query.data?.lastName;
  if (!query.data) {
    return <></>;
  } else {
    return (
      <View style={styles.container}>
        <Text
          style={{
            ...styles.text,
            fontWeight: "400",
            fontSize: 14,
            fontFamily: "NotoSansKR-Regular",
          }}
        >
          <Text style={{ fontFamily: "NotoSansKR-Bold" }}>
            {approverLastName}
            {approverFirstName}(@{approverID})
          </Text>
          님이 친구 요청을 수락했습니다.
        </Text>
        <Text style={styles.time}>
          <TimeDisplay time={time} />
        </Text>
      </View>
    );
  }
};

export default DispatchFriendRequestList;

const styles = StyleSheet.create({
  container: {
    width: 344,
    alignSelf: "center",
    flexDirection: "row",
    marginBottom: 40,
  },
  text: {
    alignSelf: "center",
    lineHeight: 16,
    letterSpacing: -0.5,
    fontFamily: "NotoSansKR-Regular",
  },
  time: {
    alignSelf: "center",
    lineHeight: 16,
    letterSpacing: -0.5,
    fontFamily: "NotoSansKR-Bold",
    fontSize: 12,
    color: "#545766",
    left: 5,
  },
});
