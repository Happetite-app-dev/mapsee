import { ref } from "@firebase/database";
import { useEffect, useState } from "react";
import { useQuery, useQueries, useQueryClient } from "react-query";
import {
  fetchFolder,
  fetchUser,
  fetchRecord,
  fetchAllNotice,
  fetchRecordIDList,
} from "./actions";



export const useUserQuery = (UID) =>
  useQuery(["users", UID], () => fetchUser(UID));

export const useFolderQuery = (folderID) =>
  useQuery(["folders", folderID], () => fetchFolder(folderID));

export const useFolderQueries = (folderIDList) =>
  useQueries(
    folderIDList.map((folderID) => {
      return {
        queryKey: ["folders", folderID],
        queryFn: () => fetchFolder(folderID),
      };
    })
  );

export const useRecordQuery = (recordID) =>
  useQuery(["records", recordID], () => fetchRecord(recordID));

export const useRecordQueries = (recordIDList) => {
  return useQueries(recordIDList.map((recordID) => {
    return {
      queryKey: ["records", recordID],
      queryFn: () => fetchRecord(recordID)
    }
  }))
}

export const useRecordIDListQuery = (folderIDList, condition) => {
  const folderQueries = useFolderQueries(folderIDList)
  //const loadingFinishAll = !folderQueries.some((result) => result.isLoading)
  //const isFetched = folderQueries[folderIDList.length - 1] ? folderQueries[folderIDList.length - 1]?.isFetchedAfterMount : false
  // const queryClient = useQueryClient()
  return useQuery(["recordIDList", condition], () => {
    return fetchRecordIDList(folderIDList, folderQueries)
  })
}

export const useAllNoticeQuery = (UID) =>
  useQuery(["all-notices"], () => fetchAllNotice(UID));
