import { ref, onValue, set, push, get, remove } from "firebase/database";
import { useContext, useState } from "react";
import { useQueryClient } from "react-query";
import AppContext from "../components/AppContext";
import SendPushNotification from "../modules/SendPushNotification";
import DispatchFolderInviteRequestList from "./DispatchFolderInviteRequestList";
import DispatchFriendRequestList from "./DispatchFriendRequestList";
import FolderInviteRequestCard from "./FolderInviteRequestCard";
import FriendRequestCard from "./FriendRequestCard";
import ReceptFolderInviteRequestList from "./ReceptFolderInviteRequestList";
import ReceptFriendRequestList from "./ReceptFriendRequestList";
import ReceptRecordAddDoneList from "./ReceptRecordAddDoneList";
//NoticeRenderer에서는 각 내부 알림을 그 type에 따라 분류하여 알맞은 모양의 컴포넌트를 return한다
//이때, 이 컴포넌트가 수행해야되는 함수 또한 여기서 처리한다
//ID를 UID에서 갖고 오는 식으로 바꿔야 될수도

import { database } from "../firebase";
import { useUserQuery, useFolderQuery } from "../queries";

const db = database;
const acceptFriendRequest = async ({ myUID, noticeKey, requesterUID }) => {
  // set(
  //   ref(db, "/notices/" + myUID + "/" + noticeKey + "/type/"), //remove할지 추후에 고려 필요
  //   "recept_friend_request_accept_inact"
  // );
  remove(ref(db, "/notices/" + myUID + "/" + noticeKey));
  push(ref(db, "/notices/" + myUID), {
    type: "recept_friend_request_accept_act",
    requesterUID,
    time: new Date().getTime(),
  });
  push(ref(db, "/notices/" + requesterUID), {
    type: "dispatch_friend_request_accept_act",
    approverUID: myUID,
    time: new Date().getTime(),
  });
  set(ref(db, "/users/" + myUID + "/friendUIDs/" + requesterUID), true);
  set(ref(db, "/users/" + requesterUID + "/friendUIDs/" + myUID), true);
};
const acceptFolderInviteRequest = async ({
  myUID,
  noticeKey,
  requesterUID,
  folderID,
  myContext,
  folderData,
}) => {
  onValue(ref(db, `/folders/${folderID}/initFolderName`), (snapshot1) => {
    const folderName = snapshot1.val();
    onValue(ref(db, `/folders/${folderID}/initFolderColor`), (snapshot2) => {
      const folderColor = snapshot2.val();
      const reference1 = ref(db, `/folders/${folderID}/folderName/${myUID}`); //folderName 개인화
      set(reference1, folderName);
      const reference2 = ref(db, `/folders/${folderID}/folderColor/${myUID}`); //folderColor 개인화
      set(reference2, folderColor);
    });
  });
  const reference3 = ref(db, `/folders/${folderID}/userIDs/${myUID}`); //folders/newfolderID/userIDs에 userID:true를 넣기
  set(reference3, true);
  const reference4 = ref(db, `users/${myUID}/folderIDs/${folderID}`); //user에 folderID를 넣고
  set(reference4, true);
  //초대한 사람에게 폴더 초대 수락했다고 알림보내기(push, 내부)
  SendPushNotification({
    receiverUID: requesterUID,
    title_: "mapsee 맵시", // 폴더 초대 수락 알림
    body_: `${myContext.myLastName + myContext.myFirstName}(@${
      myContext.myID
    })님이 폴더[${
      folderData?.folderName[myUID] || folderData.initFolderName
    }] 초대를 수락했습니다.`, // ~~님이 ~~폴더에 초대를 수락하였습니다.
  });
  push(ref(db, "/notices/" + myUID), {
    type: "recept_folderInvite_request_accept_act",
    requesterUID,
    folderID,
    time: new Date().getTime(),
  });
  push(ref(db, "/notices/" + requesterUID), {
    type: "dispatch_folderInvite_request_accept_act",
    approverUID: myUID,
    folderID,
    time: new Date().getTime(),
  });
  //notice/myUID/noticeKey에 접근해서 type 바꾸기 -> remove 할지 추후에 고려 필요
  // set(
  //   ref(db, "/notices/" + myUID + "/" + noticeKey + "/type/"), //remove할지 추후에 고려 필요
  //   "recept_folderInvite_request_accept_inact"
  // );
  remove(ref(db, "/notices/" + myUID + "/" + noticeKey));
};

const denyFriendRequest = async ({ myUID, noticeKey, onToggleSnackBar }) => {
  // set(
  //   ref(db, "/notices/" + myUID + "/" + noticeKey + "/type/"),
  //   "recept_friend_request_deny_inact"
  // );
  remove(ref(db, "/notices/" + myUID + "/" + noticeKey));
  onToggleSnackBar();
};

const denyFolderInviteRequest = async ({
  myUID,
  noticeKey,
  onToggleSnackBar,
}) => {
  // set(
  //   ref(db, "/notices/" + myUID + "/" + noticeKey + "/type/"),
  //   "recept_folderInvite_request_deny_inact"
  // );
  remove(ref(db, "/notices/" + myUID + "/" + noticeKey));
  onToggleSnackBar();
};

const NoticeRenderer = ({ navigation, item, onToggleSnackBar }) => {
  const myContext = useContext(AppContext);
  const myUID = myContext.myUID;
  const queryClient = useQueryClient();
  const requesterData = useUserQuery(["users", item.val.requesterUID]).data;
  const folderData = useFolderQuery(item.val.folderID).data;

  switch (item.val.type) {
    case "recept_friend_request": //친구 요청 수신 - 수락 거절 안 한 활성화된 새로운 알림
      return (
        <FriendRequestCard
          requesterUID={item.val.requesterUID}
          time={item.val.time}
          acceptRequest={async () =>
            await acceptFriendRequest({
              myUID,
              noticeKey: item.key,
              requesterUID: item.val.requesterUID,
            }).then(() => {
              queryClient.invalidateQueries(["all-notices"]);
            })
          }
          denyRequest={async () =>
            await denyFriendRequest({
              myUID,
              noticeKey: item.key,
              onToggleSnackBar,
            }).then(() => {
              queryClient.invalidateQueries(["all-notices"]);
            })
          }
        />
      );
    case "recept_friend_request_accept_act": //친구 요청 수신 - 수락하여 활성화된 새로운 알림
      return (
        <ReceptFriendRequestList
          requesterUID={item.val.requesterUID}
          time={item.val.time}
        />
      );
    case "recept_friend_request_accept_inact": //친구 요청 수신 - 수락하여 비활성화된 알림
      return <></>;
    case "dispatch_friend_request_accept_act": //친구 요청 발신 - 수락하여 활성화된 알림
      return (
        <DispatchFriendRequestList
          approverUID={item.val.approverUID}
          time={item.val.time}
        />
      );
    case "recept_friend_request_deny_inact": //친구 요청 수신 - 거절하여 비활성화된 알림
      return <></>;
    case "recept_folderInvite_request": //공유폴더초대 요청 수신 - 수락 거절 안 한 활성화된 새로운 알림
      return (
        <FolderInviteRequestCard
          requesterUID={item.val.requesterUID}
          time={item.val.time}
          folderID={item.val.folderID}
          acceptRequest={async () => {
            await acceptFolderInviteRequest({
              myUID,
              noticeKey: item.key,
              requesterUID: item.val.requesterUID,
              folderID: item.val.folderID,
              myName: myContext.myLastName + myContext.myFirstName,
              myContext,
              folderData,
            }).then(() => {
              queryClient.invalidateQueries(["all-notices"]);
            });
          }}
          denyRequest={async () =>
            await denyFolderInviteRequest({
              myUID,
              noticeKey: item.key,
              onToggleSnackBar,
            }).then(() => {
              queryClient.invalidateQueries(["all-notices"]);
            })
          }
        />
      );
    case "recept_folderInvite_request_accept_act": //공유폴대초대 요청 수신 - 수락하여 활성화된 새로운 알림
      return (
        <ReceptFolderInviteRequestList
          requesterUID={item.val.requesterUID}
          folderID={item.val.folderID}
          navigation={navigation}
          time={item.val.time}
        />
      );
    case "dispatch_folderInvite_request_accept_act": //공유폴더초대 요청 발신 - 수락하여 활성화된 새로운 알림
      return (
        <DispatchFolderInviteRequestList
          approverUID={item.val.approverUID}
          folderID={item.val.folderID}
          navigation={navigation}
          time={item.val.time}
        />
      );
    case "recept_folderInvite_request_accept_inact": //공유폴더초대 요청 수신 - 수락하여 비활성화된 알림
      return <></>;
    case "recept_folderInvite_request_deny_inact": //공유폴더초대 요청 수신 - 거절하여 비활성화된 알림
      return <></>;
    case "recept_recordAdd_done": //기록추가 완료되었음 수신
      return (
        <ReceptRecordAddDoneList
          performerUID={item.val.performerUID}
          folderID={item.val.folderID}
          recordID={item.val.recordID}
          navigation={navigation}
          time={item.val.time}
        />
      );
    default:
      return null;
  }
};

export default NoticeRenderer;
