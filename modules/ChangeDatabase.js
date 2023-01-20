import { getDatabase, onValue, push, ref, set } from "@firebase/database";

import SendPushNotification from "./SendPushNotification";

const AcceptFolderInviteRequest = ({
  myUID,
  noticeKey,
  requesterUID,
  folderID,
}) => {
  const db = getDatabase();
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
    title_: "폴더초대수락타이틀",
    body_: "폴더초대수락바디",
  });
  push(ref(db, "/notices/" + myUID), {
    type: "recept_folderInvite_request_accept_act",
    requesterUID,
    folderID,
  });
  push(ref(db, "/notices/" + requesterUID), {
    type: "dispatch_folderInvite_request_accept_act",
    approverUID: myUID,
    folderID,
  });
  //notice/myUID/noticeKey에 접근해서 type 바꾸기 -> remove 할지 추후에 고려 필요
  set(
    ref(db, "/notices/" + myUID + "/" + noticeKey + "/type/"), //remove할지 추후에 고려 필요
    "recept_folderInvite_request_accept_inact"
  );
};
export default AcceptFolderInviteRequest;
