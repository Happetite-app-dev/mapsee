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


/** 
 * relatedUIDs에 속한 각 UID들에 대한 정보를 트리로 만들어 저장
 * useAllUserQuery에 대해 invalidate 실행 시 useUserQuery에 대해 invalidate 모두 실행
 * or setQueryData 실행
 */
export const useAllUserQuery = (UID) =>
  useQuery(["all-users"], () => fetchAllUser(UID));

