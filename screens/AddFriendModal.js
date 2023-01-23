import { useIsFocused } from "@react-navigation/native";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  DataSnapshot,
} from "firebase/database";
import React, { useEffect, useId, useState, useContext } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  TextInput,
} from "react-native";

import AppContext from "../components/AppContext";
import SendPushNotification from "../modules/SendPushNotification";

const db = getDatabase();

const getFriendUID = (newFriend, handleFriendUID, handleFriendName) => {
  onValue(ref(db, "/users/"), (snapshot) => {
    snapshot.forEach((datasnapshot) => {
      if (datasnapshot.child("id").val() == newFriend) {
        handleFriendUID(datasnapshot.key);
        const friendName =
          datasnapshot.child("lastName").val() +
          datasnapshot.child("firstName").val();
        handleFriendName(friendName);
      }
    });
  });
};

const callFriendRequest = (friendUID, myUID, myID, myFirstName, myLastName) => {
  if (friendUID != undefined) {
    const timeNow = new Date();
    const reference = ref(db, "/notices/" + friendUID);
    push(reference, {
      //db에 mUID, 요청 시각, type: "newfriend"가 적힌 obj가 friendUID/request에 새롭게 적힘}
      type: "recept_friend_request",
      requesterUID: myUID,
      time: timeNow.getTime(),
    });
    SendPushNotification({
      receiverUID: friendUID,
      title_: "친구추가타이틀",
      body_: "친구추가바디",
    });
  } else {
    console.log("no such uid");
  }
};

const AddFriendModal = ({
  modalVisible,
  modalHandler,
  friendList,
  onToggleSnackBar,
  setRequestSent,
  setRequestInfo,
}) => {
  const myContext = useContext(AppContext);
  const myUID = myContext.myUID;
  const myID = myContext.myID;
  const myFirstName = myContext.myFirstName;
  const myLastName = myContext.myLastName;
  const [newFriend, setNewFriend] = useState("");
  const [friendUID, setFriendUID] = useState(undefined);
  const [friendName, setFriendName] = useState(undefined);
  const handleFriendUID = (uid) => {
    setFriendUID(uid);
  };
  const handleFriendName = (name) => {
    setFriendName(name);
  };
  const containsUID = (friendUID) => {
    const newArray = friendList.filter((item) => item.userID == friendUID);
    if (newArray.length >= 1) return true;
    else return false;
  };
  useEffect(() => {
    if (friendUID !== undefined) {
      console.log(friendList.includes(friendUID));
      if (containsUID(friendUID)) {
        setRequestSent(false);
        onToggleSnackBar();
        console.log("true");
      } else {
        callFriendRequest(friendUID, myUID, myID, myFirstName, myLastName);
        setRequestSent(true);
        setRequestInfo([newFriend, friendName]); // newFriend: friend ID
        onToggleSnackBar();
      }
      setFriendUID(undefined);
    }
  }, [friendUID]);

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="none"
        transparent
        visible={modalVisible}
        onRequestClose={() => {
          //추후에 없앨 필요 있을 수도(ios)
          Alert.alert("Modal has been closed.");
          modalHandler(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View
              style={{
                marginTop: 16,
                width: 312,
                height: 48,
                alignItems: "center",
                borderBottomWidth: 1,
                borderBottomColor: "gray",
              }}
            >
              <TextInput
                placeholder="친구 요청을 보낼 아이디를 입력해주세요"
                value={newFriend}
                onChangeText={(txt) => setNewFriend(txt)}
                style={styles.textStyle}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: 300,
                height: 48,
              }}
            >
              <Pressable
                style={{
                  marginTop: 8,
                  ...styles.button,
                  ...styles.buttonClose,
                }}
                onPress={() => modalHandler(!modalVisible)}
              >
                <Text style={styles.modalText}>취소</Text>
              </Pressable>
              <Pressable
                style={{
                  marginTop: 8,
                  ...styles.button,
                  ...styles.buttonClose,
                }}
                onPress={() => {
                  getFriendUID(newFriend, handleFriendUID, handleFriendName);
                  modalHandler(!modalVisible);
                }}
              >
                <Text style={styles.modalText}>요청</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 16,
    alignItems: "center",
    width: 344,
    height: 112,
  },
  button: {
    width: 128,
    height: 24,
  },
  buttonOpen: {
    backgroundColor: "#FFFFFF",
  },
  buttonClose: {
    backgroundColor: "#FFFFFF",
  },
  textStyle: {
    width: 312,
    height: 16,
    marginTop: 16,
    fontSize: 14,
    lineHeight: 0,
    letterSpacing: -0.5,
    fontWeight: "400",
  },
  modalText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 24,
    letterSpacing: 1.2,
    alignSelf: "center",
    fontWeight: "700",
  },
});

export default AddFriendModal;
