import { ref } from "@firebase/database";
import { useState } from "react";
import { useQuery, useQueries } from "react-query";
import { fetchFolder, fetchUser, fetchRecord, fetchAllNotice } from "./actions";

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

export const useRecordQueries = (folderIDList) => {
  const folderQueries = useFolderQueries(folderIDList);
  const recordIDList = folderIDList.reduce((acc, curr, idx) => {
    const folderObj = folderQueries[idx].data;
    const newRecordID = folderObj?.placeRecords
      ? Object.values(folderObj.placeRecords).map(
          (item) => Object.keys(item)[0]
        )
      : [];
    return [...acc, ...newRecordID];
  }, new Array());

  return useQueries(
    recordIDList.map((recordID) => {
      return {
        queryKey: ["records", recordID],
        queryFn: () => fetchRecord(recordID),
      };
    })
  );
};
export const useAllNoticeQuery = (UID) =>
  useQuery(["all-notices"], () => fetchAllNotice(UID));
