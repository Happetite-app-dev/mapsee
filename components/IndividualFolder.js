import { useContext } from "react";
import { Image, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { useFolderQuery } from "../queries";
import AppContext from "./AppContext";

const folderImage = require("../assets/image/folder.png");
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
          //gotoSingleFolderScreen()
        }}
        onLongPress={() => {
          setLongPressedFolder({
            folderID,
            folderName: query.data.folderName[myUID],
            folderColor: query.data.folderColor[myUID],
            folderUserIDs: query.data.userIDs,
          });
          setModalVisible(true);
        }}
        style={{ height: 65 }}
        activeOpacity={0.2}
      >
        <View style={{ marginLeft: 10, marginRight: 10 }}>
          <Image
            source={folderImage}
            style={{ tintColor: query.data.folderColor[myUID] }}
          />
          {/* Image source path changes depending on fileColor */}
          {/* <Image source={} style={{width: 50, height:50}}/> */}
          <Text style={{ alignSelf: "center", top: 8 }}>
            {query.data.folderName[myUID]}
          </Text>
        </View>
      </TouchableOpacity>
    )
  );
};

export default IndividualFolder;
