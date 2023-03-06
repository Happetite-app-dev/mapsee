import { ref } from "@firebase/database";
import { useQuery } from "react-query";
import {
  fetchFolder,
  fetchUser,
  fetchRecord,
  fetchAllFolder,
  fetchAllRecord,
  fetchAllNotice,
  fetchAllFolderObject,
} from "./actions";
import { database } from "./firebase";

const db = database

export const useUserQuery = (UID) =>
  useQuery(["users", UID], () => fetchUser(UID));

export const useFolderQuery = (folderID) =>
  useQuery(["folders", folderID], () => fetchFolder(folderID));

export const useRecordQuery = (recordID) =>
  useQuery(["records", recordID], () => fetchRecord(recordID));


export const useAllFolderQuery2 = (UID) => {
  useQuery(["all-folders"], () => {

    fetchAllFolder()
  });
}

export const useAllFolderQuery = () =>
  useQuery(["all-folders"], () => fetchAllFolder());


export const useAllRecordQuery = () =>
  useQuery(["all-records"], () => fetchAllRecord());

export const useAllNoticeQuery = (UID) =>
  useQuery(["all-notices"], () => fetchAllNotice(UID));

