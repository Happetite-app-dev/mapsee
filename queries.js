import { ref } from "@firebase/database";
import { useState } from "react";
import { useQuery, useQueries } from "react-query";
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
  useQueries(folderIDList.map((folderID) => {
    return {
      queryKey: ["folders", folderID],
      queryFn: () => fetchFolder(folderID)
    }
  }))

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

export const useRecordIDListQuery = (folderIDList) => {
  const folderQueries = useFolderQueries(folderIDList)
  //console.log("query", folderQueries[0]?.data ? folderQueries[0].data : "none")
  // console.log("query2", folderQueries[0]?.data ? folderQueries[0].data : "none"); 
  return useQuery(["recordIDList"], () => fetchRecordIDList(folderIDList, folderQueries))
}


export const useAllNoticeQuery = (UID) =>
  useQuery(["all-notices"], () => fetchAllNotice(UID));

