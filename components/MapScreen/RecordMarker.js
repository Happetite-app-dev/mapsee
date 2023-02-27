import { Image } from "react-native";
import { Marker } from "react-native-maps";

import Marker1 from "../../assets/markers/marker#4F92D9.svg";
import NewMarker from "../../assets/markers/newMarker.svg";
import { useAllFolderQuery } from "../../queries";
import get from "lodash/get";
import { useContext } from "react";
import AppContext from "../AppContext";

const now = new Date();
const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

const RecordMarker = ({ recordData, origin }) => {
  const myContext = useContext(AppContext);
  const myUID = myContext.myUID;
  const { isLoading, error, data } = useAllFolderQuery();
  return recordData == null || recordData === undefined ? (
    <></>
  ) : (
    recordData.map(([key, record]) => {
      const showMarker = Math.random();
      const recordDate = new Date(
        record?.date?.year,
        record?.date?.month - 1,
        record?.date?.day
      );
      const dayDiff = (recordDate - currentDate) / (1000 * 60 * 60 * 24);
      const color =
        get(data, [record.folderID, "folderColor", myUID]) ||
        get(data, [record.folderID, "initFoldercolor"]);

      return (
        <Marker
          key={key}
          coordinate={record.lctn}
          opacity={origin.latitudeDelta < 0.01 || showMarker > 0.5 ? 100 : 0}
          style={{ zIndex: Math.round(dayDiff * 1000) }}
        >
          {dayDiff <= 3 ? <NewMarker /> : <Marker1 color={color} />}
        </Marker>
      );
    })
  );
};

export default RecordMarker;
