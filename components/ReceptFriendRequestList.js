import { useEffect, useState } from "react";
import { Pressable, SafeAreaView, Text, View, StyleSheet } from "react-native";
import TimeDisplay from "./NoticeScreen/TimeDisplay";

const ReceptFriendRequestList = ({ requesterObject, time }) => {
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
    <View style={styles.container}>
      <Text
        style={{
          ...styles.text,
          fontWeight: "400",
          fontSize: 14,
        }}
      >
        <Text style={{ fontWeight: "700" }}>
          {requesterLastName}
          {requesterFirstName}(@{requesterID})
        </Text>
        님과 친구가 되었습니다.
      </Text>
      <Text
        style={{
          ...styles.text,
          fontWeight: "700",
          fontSize: 12,
          color: "#545766",
        }}
      >
        <TimeDisplay time={time} />
      </Text>
    </View>
  );
};

export default ReceptFriendRequestList;

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
  },
});
