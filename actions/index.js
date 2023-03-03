import { onValue, ref } from "@firebase/database";
import { pullAt } from "lodash";
import { database } from "../firebase";

import { onValueAsync } from "./utils";

const db = database;
export const fetchFolder = async (folderID) => {
  return await onValueAsync(ref(db, "/folders/" + folderID));
};

export const fetchUser = async (UID) => {
  return await onValueAsync(ref(db, "/users/" + UID));
};

export const fetchRecord = async (recordID) => {
  return await onValueAsync(ref(db, "/records/" + recordID));
};

export const fetchAllRecord = async () => {
  return await onValueAsync(ref(db, "/records/"));
};

export const fetchAllFolder = async () => {
  //fetchAllFolder는 나의 폴더뿐만 아니라 notice에 있는 추가예정인 폴더도 가져와야 됨
  return await onValueAsync(ref(db, "/folders/"));
};


export const fetchAllNotice = async (UID) => {
  // onValueAsync(ref(db, "/notices/" + UID))
  //   .then((notices) => {
  //     Object.entries(notices).map(([noticeID, noticeObj]) => {
  //       switch (noticeObj.type) {
  //         case "recept_friend_request": //친구 요청 수신 - 수락 거절 안 한 활성화된 새로운 알림
  //           const d = UserQuery(noticeObj.requesterUID)
  //         // console.log(1111)
  //         // const a = { "a": 111, "b": 222 }
  //         // const b = { "c": 333 }
  //         // let c = { ...a, ...b }
  //         //console.log(222)
  //         // return (

  //         //   {
  //         //     "requesterID": data?.id,
  //         //     "requesterFirstName": data?.firstName,
  //         //     "requesterLastName": data?.lastName
  //         //   }
  //         // )
  //       }
  //     })
  //   })
  return await onValueAsync(ref(db, "/notices/" + UID));
};

export const fetchAllUser = async (UID) => {
  onValueAsync(ref(db, "/users/" + UID + "/relatedUIDs/"))
    .then((relatedUIDs) => {
      Object.entries(relatedUIDs).forEach(([relatedUID,]) => {
        onValueAsync(ref(db, "/users/" + relatedUID)).then((userObject) => {
          relatedUIDs[relatedUID] = userObject
          //queryClient.invalidateQueries(["users"])
        })
      })
      return relatedUIDs
    })
};

