import { getDatabase, ref } from "@firebase/database";
import { async } from "@firebase/util";

import { onValueAsync } from "./utils";
const db = getDatabase();

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
  return await onValueAsync(ref(db, "/folders/"));
};
