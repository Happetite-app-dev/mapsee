import { useEffect, useState } from "react";
import { Pressable, SafeAreaView, Text, View, StyleSheet } from "react-native";
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
//오로지 display만을 위한 함수
const FriendRequestCard = ({
  requesterObject,
  time,
  acceptRequest,
  denyRequest,
}) => {
  const [requesterObj, setRequesterObj] = useState(
    requesterObject || { id: "", firstName: "", lastName: "" }
  );
  useEffect(() => {
    if (requesterObject != undefined) {
      setRequesterObj(requesterObject);
    }
  }, [requesterObject]);
  const requesterID = JSON.stringify(requesterObj.id).slice(1, -1);
  const requesterFirstName = JSON.stringify(requesterObj.firstName).slice(
    1,
    -1
  );
  const requesterLastName = JSON.stringify(requesterObj.lastName).slice(1, -1);

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
const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "89.5%",
    backgroundColor: "white",
  },
  screenTitle: { fontWeight: "bold", fontSize: 16, left: 23 },
  screenTitleView: {
    flexDirection: "row",
    height: 56,
    marginBottom: 20,
    alignItems: "center",
  },
  item: {
    flex: 0.5,
    borderColor: "grey",
    borderRadius: 8,
    borderWidth: 1,
    padding: 0,
    height: 224,
    maxWidth: 160,
    marginVertical: 8,
    marginHorizontal: 12,
  },
  title: {
    fontSize: 16,
  },
  twoRightButtons: {
    position: "absolute",
    right: 0,
    width: 86,
    height: 30,
    flexDirection: "row",
    alignItems: "center",
  },
  firstButton: {
    width: 30,
    height: 30,
  },
  secondButton: {
    width: 30,
    height: 30,
    left: 10,
  },
});