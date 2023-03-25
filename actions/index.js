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

export const fetchAllFolderObject = async (UID) => {
  return await onValueAsync(ref(db, "/users/" + UID + "/folderIDs"))
}

export const fetchAllFolder = async () => {
  return await onValueAsync(ref(db, "/folders/"));
};



export const fetchAllNotice = async (UID) => {
  return await onValueAsync(ref(db, "/notices/" + UID));
};