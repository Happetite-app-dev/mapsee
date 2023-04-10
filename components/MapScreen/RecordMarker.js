import { Image } from "react-native";
import { Marker } from "react-native-maps";

import Marker1 from "../../assets/markers/marker#4F92D9.svg";
import NewMarker from "../../assets/markers/newMarker.svg";
import { useFolderQueries, useUserQuery } from "../../queries";
import get from "lodash/get";
import { useContext } from "react";
import AppContext from "../AppContext";

const now = new Date();
const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

const RecordMarker = ({ recordData, origin }) => {
  const myContext = useContext(AppContext);
  const myUID = myContext.myUID;
  const userQuery = useUserQuery(myUID);
  const folderIDList =
    userQuery.data?.folderIDs !== undefined
      ? Object.keys(userQuery.data?.folderIDs)
      : [];

  const folderQueries = useFolderQueries(folderIDList);

  const data = folderIDList.reduce((acc, curr, idx) => {
    return { ...acc, [curr]: folderQueries[idx].data };
  }, new Object());

  return recordData == null || recordData === undefined ? (
    <></>
  ) : (
    recordData.map(([key, record]) => {
      const recordDate = new Date(
        record?.writeDate?.year,
        record?.writeDate?.month - 1,
        record?.writeDate?.day,
        record?.writeDate?.hour,
        record?.writeDate?.minute
      );
      const dayDiff = (currentDate - recordDate) / (1000 * 60 * 60 * 24);
      const color =
        get(data, [record.folderID, "folderColor", myUID]) ||
        get(data, [record.folderID, "initFoldercolor"]);
      return (
        <Marker
          key={key}
          coordinate={record.lctn}
          opacity={100}
          style={{ zIndex: Math.round(-dayDiff * 100000) }}
        >
          {dayDiff <= 3 ? (
            <NewMarker color={color} />
          ) : (
            <Marker1 color={color} />
          )}
        </Marker>
      );
    })
  );
};

export default RecordMarker;
