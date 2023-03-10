import { ref } from "@firebase/database";
import { useQuery, useQueries } from "react-query";
import {
  fetchFolder,
  fetchUser,
  fetchRecord,
  fetchAllRecord,
  fetchAllNotice,
} from "./actions";


export const useUserQuery = (UID) =>
  useQuery(["users", UID], () => fetchUser(UID));

export const useFolderQuery = (folderID) =>
  useQuery(["folders", folderID], () => fetchFolder(folderID));

export const useFolderQueries = (folderIDList) =>
  useQueries(folderIDList.map((folderID) => {
    return {
      queryKey: ["folders", folderID],
      queryFn: () => fetchFolder(folderID)
    }
  }))

export const useRecordQuery = (recordID) =>
  useQuery(["records", recordID], () => fetchRecord(recordID));

export const useAllRecordQuery = () =>
  useQuery(["all-records"], () => fetchAllRecord());

export const useAllNoticeQuery = (UID) =>
  useQuery(["all-notices"], () => fetchAllNotice(UID));

