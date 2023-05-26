import { useIsFocused } from "@react-navigation/native";
import { ref, onValue, set, push, DataSnapshot } from "firebase/database";
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

import { database } from "../firebase";
const db = database;

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

const callFriendRequest = (friendUID, myUID, myName, myID) => {
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
      title_: "mapsee 맵시", // 친구 추가 알림
      body_: `${myName}(@${myID})님이 친구 요청을 보냈습니다.`, // ~~님이 친구 요청을 보냈습니다.
    });
  } else {
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
  const myName = myContext.myLastName + myContext.myFirstName;
  const myUID = myContext.myUID;
  const myID = myContext.myID;
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
    return friendUID in friendList;
  };
  useEffect(() => {
    if (friendUID !== undefined) {
      if (containsUID(friendUID)) {
        setRequestSent(false);
        onToggleSnackBar();
      } else {
        callFriendRequest(friendUID, myUID, myName, myID);
        setRequestSent(true);
        setRequestInfo([newFriend, friendName]); // newFriend: friend ID
        onToggleSnackBar();
      }
    }
  }, [friendUID]);

  return (
    <View style={styles.container}>
      {modalVisible ? (
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
              <Text style={styles.titleText}>아이디로 친구추가</Text>
              <View
                style={{
                  width: 312,
                  height: 48,
                  alignItems: "center",
                  borderBottomWidth: 1,
                  borderBottomColor: "#ADB1C5",
                  marginTop: 8,
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
                    marginTop: 16,
                    ...styles.button,
                    ...styles.buttonClose,
                  }}
                  onPress={() => modalHandler(!modalVisible)}
                >
                  <Text style={styles.modalText}>취소</Text>
                </Pressable>
                <Pressable
                  style={{
                    marginTop: 16,
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
      ) : (
        <View style={{ width: 0, height: 0 }}></View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  titleText: {
    marginTop: 24,
    marginLeft: 16,
    fontFamily: "NotoSansKR-Medium",
    alignSelf: "baseline",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 16,
    alignItems: "center",
    width: 344,
    height: 152,
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
    fontSize: 14,
    letterSpacing: -0.5,
    fontFamily: "NotoSansKR-Regular",
    top: 16,
  },
  modalText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 24,
    letterSpacing: 1.2,
    alignSelf: "center",
    fontFamily: "NotoSansKR-Bold",
  },
});

export default AddFriendModal;
