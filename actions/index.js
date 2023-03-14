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

export const fetchAllNotice = async (UID) => {
  return await onValueAsync(ref(db, "/notices/" + UID));
};

export const fetchRecordIDList = async (folderIDList, folderQueries) => {
  const recordIDList = folderIDList.reduce((acc, curr, idx) => {
    const folderObj = folderQueries[idx].data
    const newRecordID = folderObj?.placeRecords ?
      Object.values(folderObj.placeRecords).reduce((acc1, curr1, idx1) => {
        return [...acc1, ...Object.keys(curr1)]
      }, new Array)
      :
      [];
    return [...acc, ...newRecordID]
  }, new Array)
  //console.log("fetching", recordIDList)
  return recordIDList
}