import { useEffect, useState } from "react";
import { Pressable, SafeAreaView, Text, View, StyleSheet } from "react-native";
import { useUserQuery } from "../queries";
import TimeDisplay from "./NoticeScreen/TimeDisplay";

const DispatchFriendRequestList = ({ approverUID, time }) => {
  const query = useUserQuery(approverUID);
  const approverID = query.data?.id
  const approverFirstName = query.data?.firstName
  const approverLastName = query.data?.lastName
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
          {approverLastName}
          {approverFirstName}(@{approverID})
        </Text>
        님이 친구 요청을 수락했습니다.
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
  },
});