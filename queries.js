import { useQuery } from "react-query";

import {
  fetchFolder,
  fetchUser,
  fetchRecord,
  fetchAllFolder,
  fetchAllRecord,
} from "./actions";

export const useUserQuery = (UID) =>
  useQuery(["users", UID], () => fetchUser(UID));

export const useFolderQuery = (folderID) =>
  useQuery(["folders", folderID], () => fetchFolder(folderID));

export const useRecordQuery = (recordID) =>
  useQuery(["records", recordID], () => fetchRecord(recordID));

export const useAllFolderQuery = () =>
  useQuery(["all-Folders"], () => fetchAllFolder());

export const useAllRecordQuery = () =>
  useQuery(["all-records"], () => fetchAllRecord());
