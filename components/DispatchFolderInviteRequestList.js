import { Pressable, SafeAreaView, Text, View } from "react-native";

const DispatchFolderInviteRequestList = ({
  approverID,
  approverFirstName,
  approverLastName,
  folderName,
}) => {
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
          님이
          <Text style={{ fontWeight: "700" }}> {folderName} </Text>
          초대를 수락했습니다.
        </Text>
      </View>
    </View>
  );
};

export default DispatchFolderInviteRequestList;
