import { useEffect, useState } from "react";
import { Pressable, SafeAreaView, Text, View, StyleSheet } from "react-native";
import { useUserQuery } from "../queries";
import TimeDisplay from "./NoticeScreen/TimeDisplay";

const ReceptFriendRequestList = ({ requesterUID, time }) => {
  const query = useUserQuery(requesterUID);
  const requesterID = query.data?.id
  const requesterFirstName = query.data?.firstName
  const requesterLastName = query.data?.lastName
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
