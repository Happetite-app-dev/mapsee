import { ref } from "@firebase/database";
import { async } from "@firebase/util";
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
  return await onValueAsync(ref(db, "/notices/" + UID));
};

export const fetchAllUser = async () => {
  //fetchAllUser는 친구뿐만 아니라 notice에 있는 친구도 정보를 받아옴
  return await onValueAsync(ref(db, "/users/"));
};

