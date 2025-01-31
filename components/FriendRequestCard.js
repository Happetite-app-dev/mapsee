import { Pressable, SafeAreaView, Text, View, StyleSheet } from "react-native";
import { useUserQuery } from "../queries";
import TimeDisplay from "./NoticeScreen/TimeDisplay";

//오로지 display만을 위한 함수
const FriendRequestCard = ({
  requesterUID,
  time,
  acceptRequest,
  denyRequest,
}) => {
  const query = useUserQuery(requesterUID);
  const requesterID = query.data?.id;
  const requesterFirstName = query.data?.firstName;
  const requesterLastName = query.data?.lastName;

  if (!query.data) {
    return <></>;
  } else {
    return (
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text
            style={{
              ...styles.text,
              fontSize: 14,
              fontWeight: "400",
              fontFamily: "NotoSansKR-Regular",
            }}
          >
            <Text style={{ fontFamily: "NotoSansKR-Bold", fontWeight: "700" }}>
              {requesterLastName}
              {requesterFirstName}(@{requesterID})
            </Text>
            님이
            <Text style={{ fontFamily: "NotoSansKR-Bold", fontWeight: "700" }}>
              {" "}
              친구요청
            </Text>
            을 보냈습니다.{"  "}
            <Text style={styles.time}>
              <TimeDisplay time={time} />
            </Text>
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <Pressable
            onPress={denyRequest}
            style={{ ...styles.button, right: 22 }}
          >
            <Text style={styles.buttonText}>거절</Text>
          </Pressable>
          <View style={styles.buttonBorder} />
          <Pressable
            onPress={acceptRequest}
            style={{ ...styles.button, left: 22 }}
          >
            <Text style={styles.buttonText}>수락</Text>
          </Pressable>
        </View>
      </View>
    );
  }
};

export default FriendRequestCard;
const styles = StyleSheet.create({
  container: {
    width: 344,
    borderRadius: 16,
    backgroundColor: "#F4F5F9",
    alignSelf: "center",
    flex: 1,
    marginBottom: 40,
  },
  textContainer: {
    top: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "flex-start", // 컨테이너 상단에 정렬
    width: 312,
    marginHorizontal: 16,
  },
  text: {
    alignSelf: "center",
    lineHeight: 20,
    letterSpacing: -0.5,
    fontFamily: "NotoSansKR-Regular",
  },
  time: {
    lineHeight: 16,
    letterSpacing: -0.5,
    fontFamily: "NotoSansKR-Bold",
    fontSize: 12,
    color: "#545766",
    left: 5,
    bottom: 0,
    height: 16,
    position: "absolute",
    fontWeight: "700",
  },
  buttonContainer: {
    height: 24,
    marginTop: 16,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 128,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontFamily: "NotoSansKR-Bold",
    fontSize: 14,
    letterSpacing: 1.2,
    fontWeight: "700",
  },
  buttonBorder: {
    height: 16,
    width: 0,
    borderColor: "#DDDFE9",
    borderWidth: 1,
  },
});
