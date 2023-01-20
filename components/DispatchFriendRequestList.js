import { useEffect, useState } from "react";
import { Pressable, SafeAreaView, Text, View } from "react-native";

const DispatchFriendRequestList = ({ approverObject }) => {
  const [approverObj, setApproverObj] = useState(
    approverObject || { id: "", firstName: "", lastName: "" }
  );
  useEffect(() => {
    if (approverObject != undefined) {
      setApproverObj(approverObject);
    }
  }, [approverObject]);
  const approverID = JSON.stringify(approverObj.id).slice(1, -1);
  const approverFirstName = JSON.stringify(approverObj.firstName).slice(1, -1);
  const approverLastName = JSON.stringify(approverObj.lastName).slice(1, -1);
  return (
    <View style={{ flex: 1, alignItems: "center", marginBottom: 40 }}>
      <View
        style={{
          width: 344,
          height: 24,
          borderRadius: 16,
          flexDirection: "row",
        }}
      >
        <Text
          style={{
            left: 16,
            top: 5,
            fontWeight: "400",
            fontSize: 14,
            lineHeight: 16,
            letterSpacing: -0.5,
          }}
        >
          <Text style={{ fontWeight: "700" }}>
            {approverLastName}
            {approverFirstName}(@{approverID})
          </Text>
          님이 친구 요청을 수락했습니다.
        </Text>
      </View>
    </View>
  );
};

export default DispatchFriendRequestList;
