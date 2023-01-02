import { Pressable, SafeAreaView, Text, View } from "react-native";
const DisplayTime = (time) => {
  const timeNow = new Date();
  const timePast = new Date(time);
  const timeDiff = timeNow.getTime() - timePast.getTime();
  if (
    timeNow.getFullYear() == timePast.getFullYear() &&
    timeNow.getMonth() == timePast.getMonth() &&
    timeNow.getDate() == timePast.getDate()
  ) {
    if (timeNow.getHours() == timePast.getHours()) {
      if (timeNow.getMinutes() == timePast.getMinutes()) {
        return <Text>{Math.floor(timeDiff / 1000)}sec</Text>;
      } else {
        return <Text>{Math.ceil(timeDiff / (1000 * 60))}min</Text>;
      }
    }
    return <Text>{Math.ceil(timeDiff / (1000 * 60 * 60))}hr</Text>;
  } else {
    return <Text>{Math.ceil(timeDiff / (1000 * 60 * 60 * 24))}days</Text>;
  }
};

const FriendRequestCard = ({
  requesterUID,
  requesterID,
  requesterFirstName,
  requesterLastName,
  time,
  acceptRequest,
  denyRequest,
}) => {
  return (
    <View style={{ flex: 1, alignItems: "center", marginBottom: 40 }}>
      <View
        style={{
          width: 344,
          height: 112,
          borderRadius: 16,
          backgroundColor: "#F4F5F9",
        }}
      >
        <View style={{ height: 72 }}>
          <Text
            style={{
              left: 16,
              top: 16,
              fontWeight: "400",
              fontSize: 14,
              lineHeight: 16,
              letterSpacing: -0.5,
            }}
          >
            <Text style={{ fontWeight: "700" }}>
              {requesterLastName}
              {requesterFirstName}(@{requesterID})
            </Text>
            님이
            <Text style={{ fontWeight: "700" }}> 친구요청</Text>을 보냈습니다.
          </Text>
          <Text
            style={{
              left: 16,
              top: 16,
              fontWeight: "700",
              fontSize: 12,
              lineHeight: 16,
              letterSpacing: -0.5,
              color: "#545766",
            }}
          >
            {DisplayTime(time)}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Pressable
            onPress={denyRequest}
            style={{
              right: 22,
              width: 128,
              height: 24,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{ fontWeight: "700", fontSize: 14, letterSpacing: 1.2 }}
            >
              거절
            </Text>
          </Pressable>
          <View
            style={{
              height: 16,
              width: 0,
              borderColor: "#DDDFE9",
              borderWidh: 1,
            }}
          />
          <Pressable
            onPress={acceptRequest}
            style={{
              left: 22,
              width: 128,
              height: 24,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{ fontWeight: "700", fontSize: 14, letterSpacing: 1.2 }}
            >
              수락
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default FriendRequestCard;
