import { useIsFocused } from "@react-navigation/native";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  remove,
  off,
} from "firebase/database";
import { useContext, useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";

import AppContext from "../components/AppContext";

const goBackImage = require("../assets/image/goBack.png");

const db = getDatabase();

const gotoMakeFolderBottomSheetScreen = ({ navigation }) => {
  navigation.pop();
};

const InviteFriendScreen = ({ navigation, route }) => {
  const { folderUserIDs, onChangeFolderUserIDs, originalFolderUserIDs } =
    route.params;

  const myContext = useContext(AppContext);
  const myUID = myContext.myUID;
  const [folderUserNameIDs, setFolderUserNameIDs] = useState([]);
  useEffect(() => {
    const db = getDatabase();
    folderUserIDs.map((userID) => {
      onValue(ref(db, "/users/" + userID), (snapshot) => {
        setFolderUserNameIDs((prev) => [
          ...prev,
          {
            userID,
            name:
              snapshot.child("lastName").val() +
              snapshot.child("firstName").val(),
          },
        ]);
      });
    });
  }, []);

  const [friendIDNameList, setFriendIDNameList] = useState([]);
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      setFriendIDNameList([]);
      onValue(ref(db, "/users/" + myUID + "/friendUIDs"), (snapshot) => {
        //console.log(snapshot.val())
        if (snapshot.val() != null) {
          //한 user가 folder를 갖고 있지 않을 수 있어!!
          Object.keys(snapshot.val()).map((friendUID) => {
            //console.log(friendUID)
            onValue(ref(db, "/users/" + friendUID), (snapshot2) => {
              if (
                !friendIDNameList.includes({
                  userID: friendUID,
                  id: snapshot2.child("id").val(),
                  name:
                    snapshot2.child("lastName").val() +
                    snapshot2.child("firstName").val(),
                })
              ) {
                setFriendIDNameList((prev) => [
                  ...prev,
                  {
                    userID: friendUID,
                    id: snapshot2.child("id").val(),
                    name:
                      snapshot2.child("lastName").val() +
                      snapshot2.child("firstName").val(),
                  },
                ]);
              }
            });
          });
        }
      });
    }
  }, []);

  const IndividualFriend = ({ userID, id, name }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (!folderUserNameIDs.some((item) => item.userID === userID)) {
            setFolderUserNameIDs((prev) => [...prev, { userID, name }]);
          }
        }}
        style={{
          alignSelf: "center",
          width: "100%",
          height: 75,
          paddingVertical: 12,
          paddingHorizontal: 24,
          flexDirection: "row",
        }}
      >
        <View
          style={{
            flex: 0.5,
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: "bold", top: 5 }}>
            {name}
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "400",
              color: "gray",
              bottom: 5,
            }}
          >
            {id}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFriendList = ({ item }) => (
    <IndividualFriend userID={item.userID} id={item.id} name={item.name} />
  );
  const renderFolderUser = ({ item }) => {
    //이미 폴더에 속해있는 친구인 경우 -띄우지 않는다, 새로 추가되는 친구이름만 -띄운다
    //새 폴더 생성인 경우에는 내 이름을 -띄우지 않고, 기존 폴더에 멤버 추가인 경우에는 기존 멤버를 띄우지 않는다
    if (
      item.userID === myUID ||
      (originalFolderUserIDs != null &&
        originalFolderUserIDs.includes(item.userID))
    ) {
      return (
        <View
          style={{
            height: 32,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 16,
            marginHorizontal: 8,
            marginVertical: 20,
            backgroundColor: "#F4F5F9",
            flexDirection: "row",
          }}
        >
          <Text
            style={{
              //width: 58,
              height: 24,
              fontWeight: "500",
              fontSize: 16,
              letterSpacing: -0.5,
              color: "black",
            }}
          >
            {item.name}
          </Text>
        </View>
      );
    } else {
      return (
        <View
          style={{
            height: 32,
            paddingLeft: 16,
            paddingRight: 4,
            paddingVertical: 8,
            borderRadius: 16,
            marginHorizontal: 8,
            marginVertical: 20,
            backgroundColor: "#F4F5F9",
            flexDirection: "row",
          }}
        >
          <Text
            style={{
              //width: 58,
              height: 24,
              fontWeight: "500",
              fontSize: 16,
              letterSpacing: -0.5,
              color: "black",
            }}
          >
            {item.name}
          </Text>
          <TouchableOpacity
            onPress={() => {
              setFolderUserNameIDs(
                folderUserNameIDs.filter(
                  (folderUserNameID) => folderUserNameID.userID !== item.userID
                )
              );
            }}
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#DDDFE9",
              backgroundColor: "#FFFFFF",
              marginLeft: 8,
              justifyContent: "center",
              alignSelf: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                borderWidth: 2,
                width: 12,
                borderColor: "#5ED3CC",
                borderRadius: 1,
              }}
            />
          </TouchableOpacity>
        </View>
      );
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          position: "absolute",
          width: "100%",
          height: 60,
          top: 45,
          flexDirection: "row",
          paddingTop: 20,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            onChangeFolderUserIDs(
              folderUserNameIDs.map(({ userID }) => userID)
            );
            gotoMakeFolderBottomSheetScreen({ navigation });
          }}
          style={{
            left: 21,
            width: 20,
            alignItems: "center",
            height: 20,
            justifyContent: "center",
          }}
        >
          <Image source={goBackImage} style={{ tintColor: "black" }} />
        </TouchableOpacity>
        <View style={{ left: 50, width: 260, height: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>친구초대</Text>
        </View>
      </View>
      <View
        style={{ position: "absolute", width: "100%", height: 60, top: 90 }}
      >
        <FlatList
          data={folderUserNameIDs}
          renderItem={renderFolderUser}
          keyExtractor={(item) => item.userID}
          horizontal
          style={{
            height: 48,
          }}
        />
      </View>
      <View
        style={{ position: "absolute", width: "100%", height: 740, top: 160 }}
      >
        <FlatList
          data={friendIDNameList}
          renderItem={renderFriendList}
          keyExtractor={(item) => item.userID}
          horizontal={false}
          style={{
            flex: 1,
          }}
        />
      </View>
    </SafeAreaView>
  );
};
export default InviteFriendScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
});
