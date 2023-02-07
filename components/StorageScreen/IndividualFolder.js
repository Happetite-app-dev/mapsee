import { useContext } from "react";
import { Image, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { useFolderQuery } from "../../queries";
import AppContext from "../AppContext";

import PinFolder from "../../assets/icons/pinFolder.svg";
import SearchData from "../../assets/icons/searchData.svg";
import ShareFolder from "../../assets/icons/shareFolder2.svg";
import SingleFolder from "../../assets/icons/singleFolder.svg";
const IndividualFolder = ({
  folderID,
  setSelectedFolderIDNameColorUserIDs,
  setLongPressedFolder,
  setModalVisible,
}) => {
  const myContext = useContext(AppContext);
  const myUID = myContext.myUID;
  const query = useFolderQuery(folderID);
  if (query.isLoading) return <Text>강해린 로딩중이다</Text>;
  else if (query.error) return <Text>강해린 이상하다</Text>;
  return (
    query.data && (
      <TouchableOpacity
        onPress={() => {
          setSelectedFolderIDNameColorUserIDs({
            folderID,
            folderName: query.data.folderName[myUID],
            folderColor: query.data.folderColor[myUID],
            folderUserIDs: query.data.userIDs
              ? Object.keys(query.data.userIDs)
              : [],
          });
          //gotoSingleFolderScreen();
        }}
        onLongPress={() => {
          setLongPressedFolder({
            folderID,
            folderName: query.data.folderName[myUID],
            folderColor: query.data.folderColor[myUID],
            folderUserIDs: query.data.userIDs,
            folderFixedDate: query.data.fixedDate?.[myUID],
          });
          setModalVisible(true);
        }}
        style={{ height: 65 }}
        activeOpacity={0.2}
      >
        <View style={{ marginLeft: 10, marginRight: 10 }}>
          <SingleFolder
            color={query.data.folderColor[myUID] || query.data.initFolderColor}
          />
          {query.data.userIDs.length > 1 ? <ShareFolder /> : <></>}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              top: 8,
              justifyContent: "center",
            }}
          >
            <Text style={{ position: "relative" }}>
              {query.data.folderName[myUID]}
            </Text>
            {query.data.fixedDate !== undefined &&
            query.data.fixedDate[myUID] !== undefined ? (
              <PinFolder style={{ position: "relative", left: 3 }} />
            ) : (
              <></>
            )}
          </View>
        </View>
      </TouchableOpacity>
    )
  );
};

export default IndividualFolder;
