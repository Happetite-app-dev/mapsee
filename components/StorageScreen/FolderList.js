import { useContext, useEffect } from "react";
import { FlatList, Text } from "react-native";
import { useFolderQueries } from "../../queries";
import AppContext from "../AppContext";
import IndividualFolder from "./IndividualFolder";
import get from "lodash/get";

const FolderList = ({
  folderIDs,
  setSelectedFolderIDNameColorUserIDs,
  setLongPressedFolder,
  setModalVisible,
}) => {
  const myContext = useContext(AppContext);
  const myUID = myContext.myUID;

  const renderFolder = ({ item: folderID }) => (
    <IndividualFolder
      folderID={folderID}
      setSelectedFolderIDNameColorUserIDs={(tmp) =>
        setSelectedFolderIDNameColorUserIDs(tmp)
      }
      setLongPressedFolder={setLongPressedFolder}
      setModalVisible={setModalVisible}
    />
  );


  const folderQueries = useFolderQueries(folderIDs)
  const { isLoading, error } = folderQueries[folderIDs.length - 1] ? folderQueries[folderIDs.length - 1] : { isLoading: false, error: false }
  const data = Object.entries(folderIDs).map(([i, folderID]) => {
    return [folderID, folderQueries[i].data]
  })

  if (isLoading) return <Text>로딩중</Text>;
  else if (error) return <Text>에러 발생</Text>;
  return (
    data && (
      <FlatList
        data={data
          .filter(([key]) => folderIDs.includes(key))
          .sort(([, a], [, b]) => {
            const fixedDateA = get(a, ["fixedDate", myUID]);
            const fixedDateB = get(b, ["fixedDate", myUID]);
            if (fixedDateA && fixedDateB)
              return new Date(fixedDateB) - new Date(fixedDateA);
            else if (fixedDateA && !fixedDateB) return -1;
            else if (fixedDateB) return 1;
            else return new Date(b["updateDate"]) - new Date(a["updateDate"]);
          })
          .map(([key]) => key)}
        renderItem={renderFolder}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{
          flex: 1,
          marginTop: 16,
        }}
      />
    )
  );
};

export default FolderList;
