import { useIsFocused } from "@react-navigation/native";
import { ref, onValue, set, push, remove, off, query } from "firebase/database";
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
import GoBackHeader from "../components/GoBackHeader";
import { PopUpType1 } from "../components/PopUp";
import SnackBar from "../components/SnackBar";
import { database } from "../firebase";
import AddFriendModal from "./AddFriendModal";
import { useQueryClient } from "react-query";
import { useAllUserQuery, useUserQuery } from "../queries";

const db = database;

const deleteFriend = async (myUID, friendUID, queryClient) => {
  console.log(myUID, friendUID);
  const reference1 = ref(db, "/users/" + myUID + "/friendUIDs/" + friendUID);
  await remove(reference1).then(() => {
    const reference2 = ref(db, "/users/" + friendUID + "/friendUIDs/" + myUID);
    remove(reference2).then(() => {
      queryClient.invalidateQueries(["users", myUID]);
      queryClient.invalidateQueries(["all-users"]);
      console.log("deleted");
    });
  });
};

const IndividualFriend = ({
  userID,
  id,
  name,
  setDelFriendUID,
  setDelModalVisible,
}) => {
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
        <Text
          style={{
            fontSize: 14,
            fontWeight: "bold",
            top: 5,
            fontFamily: "NotoSansKR-Regular",
          }}
        >
          {name}
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#ADB1C5",
            bottom: 5,
            fontFamily: "NotoSansKR-Regular",
          }}
        >
          {id}
        </Text>
      </View>
      <View style={{ flex: 0.5, justifyContent: "center" }}>
        <TouchableOpacity
          onPress={() => {
            setDelFriendUID(userID);
            setDelModalVisible(true);
          }}
          style={{
            position: "absolute",
            right: 0,
            width: 40,
            height: 30,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              color: "#5ED3CC",
              fontFamily: "NotoSansKR-Regular",
            }}
          >
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
  const queryClient = useQueryClient();

  const [friendIDNameList, setFriendIDNameList] = useState({});
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [delModalVisible, setDelModalVisible] = useState(false);
  const [delFriendUID, setDelFriendUID] = useState(undefined);
  const isFocused = useIsFocused();
  const [refreshing, setRefreshing] = useState(false);

  const [requestSent, setRequestSent] = useState(false);
  const [requestInfo, setRequestInfo] = useState([]);

  const [visible, setVisible] = useState(false); // Snackbar
  const onToggleSnackBar = () => setVisible(!visible); // SnackbarButton -> 나중에는 없애기
  const onDismissSnackBar = () => setVisible(false); // Snackbar

  const userQuery = useUserQuery(myUID);
  const allUserQuery = useAllUserQuery();
  console.log(userQuery.data);

  useEffect(() => {
    if (isFocused || !refreshing) {
      setRefreshing(true);
      if (userQuery.data && allUserQuery.data) {
        console.log("changing");
        setFriendIDNameList({});
        for (const friendUID in userQuery.data.friendUIDs) {
          const friendData = allUserQuery.data[friendUID];
          setFriendIDNameList((prev) => ({
            ...prev,
            [friendUID]: {
              id: friendData.id,
              name: friendData.lastName + friendData.firstName,
            },
          }));
        }
      }
      /*setFriendIDNameList([]);
      onValue(ref(db, "/users/" + myUID + "/friendUIDs"), (snapshot) => {
        if (snapshot.val() != null) {
          //한 user가 folder를 갖고 있지 않을 수 있어!!
          Object.keys(snapshot.val()).map((friendUID) => {
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
    }*/
    }
  }, [isFocused, userQuery.isLoading, allUserQuery.isLoading, refreshing]);

  const renderFriendList = ({ item }) => {
    return (
      <IndividualFriend
        userID={item.uid}
        id={item.id}
        name={item.name}
        setDelFriendUID={setDelFriendUID}
        setDelModalVisible={setDelModalVisible}
      />
    );
  };
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <GoBackHeader
        navigation={navigation}
        text="친구목록"
        rightButton="addFriend"
        rightButtonFunction={() => setAddModalVisible(true)}
      />
      <AddFriendModal
        modalVisible={addModalVisible}
        modalHandler={setAddModalVisible}
        friendList={friendIDNameList}
        onToggleSnackBar={onToggleSnackBar}
        setRequestSent={(bool) => setRequestSent(bool)}
        setRequestInfo={(info) => setRequestInfo(info)}
      />
      <PopUpType1
        modalVisible={delModalVisible}
        modalHandler={setDelModalVisible}
        action={() => {
          deleteFriend(myUID, delFriendUID, queryClient);
        }}
        askValue="정말 차단하시겠어요?"
        actionValue="차단"
      />
      <View
        style={{
          position: "absolute",
          width: "100%",
          height: 740,
          top: 105,
        }}
      >
        <FlatList
          data={
            friendIDNameList !== undefined
              ? Object.entries(friendIDNameList).map(([uid, { id, name }]) => ({
                  uid: uid,
                  id: id,
                  name: name,
                }))
              : []
          }
          renderItem={renderFriendList}
          keyExtractor={(item) => item.id}
          horizontal={false}
          style={{
            flex: 1,
            width: "100%",
            height: "100%",
          }}
          extraData={friendIDNameList}
          refreshing={userQuery.isFetching || allUserQuery.isFetching}
          onRefresh={() => {
            queryClient.invalidateQueries(["users", myUID]);
            queryClient.invalidateQueries(["all-users"]).then(() => {
              console.log("all-users invalidated");
            });
            setRefreshing(false);
          }}
        />
      </View>
      <SnackBar
        onDismissSnackBar={onDismissSnackBar}
        text={
          requestSent
            ? requestInfo[1] +
              "(@" +
              requestInfo[0] +
              ")님께 친구 요청을 전달했습니다!"
            : "이미 추가된 친구입니다."
        }
        visible={visible}
      />
    </View>
  );
};

export default FriendListScreen;
