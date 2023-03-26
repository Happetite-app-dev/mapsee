import {
  Animated,
  Text,
  View,
  TouchableOpacity,
  Button,
  SafeAreaView,
  FlatList,
} from "react-native";
import { ScrollView, Switch, TextInput } from "react-native-gesture-handler";
import BottomButton from "../BottomButton";
import Arrow from "../../assets/icons/Arrow.svg";
const BottomSheetTitle = ({ IsNewRecord }) => {
  return (
    <View
      style={{ top: 24, width: 61, height: 24, left: 23, marginBottom: 24 }}
    >
      {IsNewRecord ? (
        <Text style={{ fontSize: 16, fontFamily: "NotoSansKR-Medium" }}>
          폴더 추가
        </Text>
      ) : (
        <Text style={{ fontSize: 16, fontFamily: "NotoSansKR-Medium" }}>
          폴더 수정
        </Text>
      )}
    </View>
  );
};

const BottomSheetName = ({ newFolderName, setNewFolderName }) => {
  return (
    <View
      style={{
        top: 26,
        width: 344,
        height: 48,
        left: 23,
        marginBottom: 24,
        borderBottomColor: "black",
        borderBottomWidth: 1,
        justifyContent: "center",
      }}
    >
      <TextInput
        style={{
          fontSize: 14,
          fontFamily: "NotoSansKR-Regular",
          lineHeight: 0,
        }}
        value={newFolderName}
        onChangeText={(fdr) => setNewFolderName(fdr)}
        placeholder={"폴더 이름"}
        placeholderTextColor="#000000"
      />
    </View>
  );
};

const BottomSheetColor = ({ newFolderColor, setNewFolderColor }) => {
  return (
    <View
      style={{ top: 24, width: 390, height: 128, left: 23, marginBottom: 24 }}
    >
      <Text style={{ fontSize: 14, fontFamily: "NotoSansKR-Medium" }}>
        폴더 색상
      </Text>
      <View style={{ top: 24, flexDirection: "column" }}>
        <View style={{ top: 0, flexDirection: "row", paddingBottom: 16 }}>
          <TouchableOpacity
            onPress={() => setNewFolderColor("#EB7A7C")}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: "#EB7A7C",
              justifyContent: "center",
              marginRight: 31,
            }}
          >
            <View
              style={{
                width: 16,
                height: 16,
                borderRadius: 8,
                backgroundColor:
                  newFolderColor == "#EB7A7C" ? "#EB7A7C" : "white",
                alignSelf: "center",
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setNewFolderColor("#EFB4AC")}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: "#EFB4AC",
              justifyContent: "center",
              marginRight: 31,
            }}
          >
            <View
              style={{
                width: 16,
                height: 16,
                borderRadius: 8,
                backgroundColor:
                  newFolderColor == "#EFB4AC" ? "#EFB4AC" : "white",
                alignSelf: "center",
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setNewFolderColor("#9BC97E")}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: "#9BC97E",
              justifyContent: "center",
              marginRight: 31,
            }}
          >
            <View
              style={{
                width: 16,
                height: 16,
                borderRadius: 8,
                backgroundColor:
                  newFolderColor == "#9BC97E" ? "#9BC97E" : "white",
                alignSelf: "center",
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setNewFolderColor("#F3D17A")}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: "#F3D17A",
              justifyContent: "center",
              marginRight: 31,
            }}
          >
            <View
              style={{
                width: 16,
                height: 16,
                borderRadius: 8,
                backgroundColor:
                  newFolderColor == "#F3D17A" ? "#F3D17A" : "white",
                alignSelf: "center",
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setNewFolderColor("#F09F83")}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: "#F09F83",
              justifyContent: "center",
              marginRight: 31,
            }}
          >
            <View
              style={{
                width: 16,
                height: 16,
                borderRadius: 8,
                backgroundColor:
                  newFolderColor == "#F09F83" ? "#F09F83" : "white",
                alignSelf: "center",
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setNewFolderColor("#545766")}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: "#545766",
              justifyContent: "center",
              marginRight: 31,
            }}
          >
            <View
              style={{
                width: 16,
                height: 16,
                borderRadius: 8,
                backgroundColor:
                  newFolderColor == "#545766" ? "#545766" : "white",
                alignSelf: "center",
              }}
            />
          </TouchableOpacity>
        </View>
        <View style={{ top: 0, flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() => setNewFolderColor("#8E86C4")}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: "#8E86C4",
              justifyContent: "center",
              marginRight: 31,
            }}
          >
            <View
              style={{
                width: 16,
                height: 16,
                borderRadius: 8,
                backgroundColor:
                  newFolderColor == "#8E86C4" ? "#8E86C4" : "white",
                alignSelf: "center",
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setNewFolderColor("#B8B0DA")}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: "#B8B0DA",
              justifyContent: "center",
              marginRight: 31,
            }}
          >
            <View
              style={{
                width: 16,
                height: 16,
                borderRadius: 8,
                backgroundColor:
                  newFolderColor == "#B8B0DA" ? "#B8B0DA" : "white",
                alignSelf: "center",
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setNewFolderColor("#6DB8B8")}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: "#6DB8B8",
              justifyContent: "center",
              marginRight: 31,
            }}
          >
            <View
              style={{
                width: 16,
                height: 16,
                borderRadius: 8,
                backgroundColor:
                  newFolderColor == "#6DB8B8" ? "#6DB8B8" : "white",
                alignSelf: "center",
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setNewFolderColor("#A0D3CB")}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: "#A0D3CB",
              justifyContent: "center",
              marginRight: 31,
            }}
          >
            <View
              style={{
                width: 16,
                height: 16,
                borderRadius: 8,
                backgroundColor:
                  newFolderColor == "#A0D3CB" ? "#A0D3CB" : "white",
                alignSelf: "center",
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setNewFolderColor("#4F92D9")}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: "#4F92D9",
              justifyContent: "center",
              marginRight: 31,
            }}
          >
            <View
              style={{
                width: 16,
                height: 16,
                borderRadius: 8,
                backgroundColor:
                  newFolderColor == "#4F92D9" ? "#4F92D9" : "white",
                alignSelf: "center",
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setNewFolderColor("#82B0DB")}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: "#82B0DB",
              justifyContent: "center",
              marginRight: 31,
            }}
          >
            <View
              style={{
                width: 16,
                height: 16,
                borderRadius: 8,
                backgroundColor:
                  newFolderColor == "#82B0DB" ? "#82B0DB" : "white",
                alignSelf: "center",
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const BottomSheetSave = ({ onPressFunction, IsNewRecord }) => {
  return (
    <BottomButton
      onPressFunction={onPressFunction}
      text={IsNewRecord ? "추가" : "수정"}
      style={{ bottom: 40 }}
    />
  );
};

const gotoInviteFriendScreen = ({
  stackNavigation,
  newFolderUserIDs,
  onChangeNewFolderUserIDs,
  folderUserIDs_,
}) => {
  stackNavigation.navigate("InviteFriendScreen", {
    folderUserIDs: newFolderUserIDs,
    onChangeFolderUserIDs: onChangeNewFolderUserIDs,
    originalFolderUserIDs: folderUserIDs_,
  });
};

const BottomSheetInvite = ({
  stackNavigation,
  newFolderUserIDs,
  onChangeNewFolderUserIDs,
  folderUserIDs_,
}) => {
  return (
    <View
      style={{
        top: 30,
        width: 344,
        height: 24,
        left: 23,
        marginBottom: 24,
        flexDirection: "row",
      }}
    >
      <Text style={{ fontSize: 14, fontFamily: "NotoSansKR-Regular" }}>
        친구초대
      </Text>
      <View>
        <TouchableOpacity
          onPress={() => {
            gotoInviteFriendScreen({
              stackNavigation,
              newFolderUserIDs,
              onChangeNewFolderUserIDs,
              folderUserIDs_,
            });
          }}
          style={{
            marginLeft: 20,
            height: 20,
            width: 50,
          }}
        >
          <Arrow />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const renderFolderUser = ({ item }) => {
  return (
    <View
      style={{
        height: 32,
        paddingHorizontal: 16,
        paddingVertical: 4,
        borderRadius: 16,
        marginHorizontal: 8,
        marginVertical: 20,
        backgroundColor: "#F4F5F9",
      }}
    >
      <Text
        style={{
          height: 24,
          fontFamily: "NotoSansKR-Medium",
          fontSize: 16,
          letterSpacing: -0.5,
        }}
      >
        {item.name}
      </Text>
    </View>
  );
};

const DefaultFolderBottomSheet = ({
  IsNewRecord,
  newFolderName,
  setNewFolderName,
  newFolderColor,
  setNewFolderColor,
  newFolderUserNameIDs,
  onPressFunction,
  stackNavigation,
  newFolderUserIDs,
  onChangeNewFolderUserIDs,
  folderUserIDs_,
}) => {
  console.log("newFolderColor", newFolderColor);

  return (
    <View style={{ width: "100%", height: "100%" }}>
      <BottomSheetTitle IsNewRecord={IsNewRecord} />
      <BottomSheetName
        newFolderName={newFolderName}
        setNewFolderName={setNewFolderName}
      />
      <BottomSheetColor
        newFolderColor={newFolderColor}
        setNewFolderColor={setNewFolderColor}
      />
      <BottomSheetInvite
        stackNavigation={stackNavigation}
        newFolderUserIDs={newFolderUserIDs}
        onChangeNewFolderUserIDs={onChangeNewFolderUserIDs}
        folderUserIDs_={folderUserIDs_}
      />
      <FlatList
        data={newFolderUserNameIDs}
        renderItem={renderFolderUser}
        keyExtractor={(item) => item.userID}
        horizontal={false}
        numColumns={3}
        style={{
          width: "100%",
          height: 100,
          marginLeft: 7,
        }}
      />
      <BottomSheetSave
        onPressFunction={onPressFunction}
        IsNewRecord={IsNewRecord}
      />
    </View>
  );
};

export default DefaultFolderBottomSheet;
