import {
  Database,
  getDatabase,
  ref,
  onValue,
  set,
  push,
} from "firebase/database";
import { useContext } from "react";

import AppContext from "../components/AppContext";
import FriendRequestCard from "./FriendRequestCard";
import FriendRequestList from "./FriendRequestList";
const acceptRequest = ({
  myUID,
  noticeKey,
  requesterUID,
  requesterID,
  requesterFirstName,
  requesterLastName,
}) => {
  const db = getDatabase();
  set(
    ref(db, "/notices/" + myUID + "/" + noticeKey + "/type/"), //remove할지 추후에 고려 필요
    "recept_friend_request_accept_inact"
  );
  push(ref(db, "/notices/" + myUID), {
    type: "recept_friend_request_accept_act",
    requesterUID,
    requesterID,
    requesterFirstName,
    requesterLastName,
  });
  set(ref(db, "/users/" + myUID + "/friendUIDs/" + requesterUID), true);
  set(ref(db, "/users/" + requesterUID + "/friendUIDs/" + myUID), true);
};

const denyRequest = ({ myUID, noticeKey, onToggleSnackBar }) => {
  const db = getDatabase();
  set(
    ref(db, "/notices/" + myUID + "/" + noticeKey + "/type/"),
    "recept_friend_request_deny_inact"
  );
  onToggleSnackBar();
};

const NoticeRenderer = ({ item, onToggleSnackBar }) => {
  const myContext = useContext(AppContext);
  const myUID = myContext.myUID;

  switch (item.val.type) {
    case "recept_friend_request": //친구요청 - 수락 거절 안 한 활성 상태
      return (
        <FriendRequestCard
          requesterUID={item.val.requesterUID}
          requesterID={item.val.requesterID}
          requesterFirstName={item.val.requesterFirstName}
          requesterLastName={item.val.requesterLastName}
          time={item.val.time}
          acceptRequest={() =>
            acceptRequest({
              myUID,
              noticeKey: item.key,
              requesterUID: item.val.requesterUID,
              requesterID: item.val.requesterID,
              requesterFirstName: item.val.requesterFirstName,
              requesterLastName: item.val.requesterLastName,
            })
          }
          denyRequest={() =>
            denyRequest({
              myUID,
              noticeKey: item.key,
              onToggleSnackBar,
            })
          }
        />
      );
    case "recept_friend_request_accept_act": //친구요청 - 수락하여 활성화된 새로운 알림
      return (
        <FriendRequestList
          requesterUID={item.val.requesterUID}
          requesterID={item.val.requesterID}
          requesterFirstName={item.val.requesterFirstName}
          requesterLastName={item.val.requesterLastName}
        />
      );
    case "recept_friend_request_accept_inact": //친구요청 - 수락하여 비활성화된 알림
      return <></>;
    case "recept_friend_request_deny_inact": //친구요청 - 거절하여 비활성화된 알림
      return <></>;

    default:
      return null;
  }
};

export default NoticeRenderer;
