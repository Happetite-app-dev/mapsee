import { useQuery } from "react-query";

import {
  fetchFolder,
  fetchUser,
  fetchRecord,
  fetchAllFolder,
  fetchAllRecord,
  fetchAllNotice,
  fetchAllUser,
} from "./actions";

export const useUserQuery = (UID) =>
  useQuery(["users", UID], () => fetchUser(UID));

export const useFolderQuery = (folderID) =>
  useQuery(["folders", folderID], () => fetchFolder(folderID));

export const useRecordQuery = (recordID) =>
  useQuery(["records", recordID], () => fetchRecord(recordID));

export const useAllFolderQuery = () =>
  useQuery(["all-folders"], () => fetchAllFolder());

export const useAllRecordQuery = () =>
  useQuery(["all-records"], () => fetchAllRecord());

export const useAllNoticeQuery = (UID) =>
  useQuery(["all-notices"], () => fetchAllNotice(UID));

export const useAllUserQuery = () =>
  useQuery(["all-users"], () => fetchAllUser());
