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
import AddFriendModal from "./AddFriendModal";

const addFriendImage = require("../assets/image/addFriend.png");
const goBackImage = require("../assets/image/goBack.png");

const db = getDatabase();

const gotoMypageScreen = ({ navigation }) => {
  navigation.pop();
};

const deleteFriendPopUp = (myUID, friendUID) => {
  return Alert.alert(
    "정말 차단하시겠습니까?",
    "",
    [
      { text: "취소" },
      {
        text: "삭제",
        onPress: () => deleteFriend(myUID, friendUID),
        style: "default",
      },
    ],
    {
      cancelable: false,
    }
  );
};
const deleteFriend = async (myUID, friendUID) => {
  const reference1 = ref(db, "/users/" + myUID + "/friendUIDs/" + friendUID);
  await remove(reference1).then(() => {
    const reference2 = ref(db, "/users/" + friendUID + "/friendUIDs/" + myUID);
    remove(reference2);
  });
};

const IndividualFriend = ({ myUID, userID, id, name }) => {
  return (
    <View
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
        <Text style={{ fontSize: 14, fontWeight: "bold", top: 5 }}>{name}</Text>
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
      <View style={{ flex: 0.5, justifyContent: "center" }}>
        <TouchableOpacity
          onPress={() => deleteFriendPopUp(myUID, userID)}
          style={{
            position: "absolute",
            right: 0,
            width: 40,
            height: 30,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: "500", color: "#5ED3CC" }}>
            차단
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const FriendListScreen = ({ navigation }) => {
  const myContext = useContext(AppContext);
  const myUID = myContext.myUID;

  const [friendIDNameList, setFriendIDNameList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const modalHandler = (isVisible) => {
    setModalVisible(isVisible);
  };
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
  const renderFriendList = ({ item }) => (
    <IndividualFriend
      myUID={myUID}
      userID={item.userID}
      id={item.id}
      name={item.name}
    />
  );
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
          onPress={() => gotoMypageScreen({ navigation })}
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
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>친구목록</Text>
        </View>
        <TouchableOpacity
          onPress={() => modalHandler(true)}
          style={{
            left: 65,
            width: 20,
            alignItems: "center",
            height: 20,
            justifyContent: "center",
          }}
        >
          <Image source={addFriendImage} />
        </TouchableOpacity>
      </View>
      <View
        style={{ position: "absolute", width: "100%", height: 740, top: 105 }}
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
      <AddFriendModal modalVisible={modalVisible} modalHandler={modalHandler} />
    </SafeAreaView>
  );
};

export default FriendListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
