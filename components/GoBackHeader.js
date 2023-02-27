import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";

import AddFriend from "../assets/icons/addFriend.svg";
import Close from "../assets/icons/close.svg";
import DeleteFolder from "../assets/icons/delete.svg";
import EditFolder from "../assets/icons/folderEdit.svg";
import GoBack from "../assets/icons/goBack.svg";
import ShareFolder from "../assets/icons/shareFolder.svg";

const folder2Image = require("../assets/image/folder2.png");

const GoBackHeader = ({
  navigation,
  goBackFunction,
  text,
  folderColor,
  isShareFolder,
  rightButton,
  rightButtonFunction,
  rightButtonFunction2,
}) => {
  return (
    <View
      style={{
        height: 88,
        width: "100%",
        paddingTop: 32,
        backgroundColor: "white",
      }}
    >
      <View style={styles.buttons}>
        <View
          onTouchEndCapture={() => {
            console.log("back through header");
            if (goBackFunction === undefined) navigation.goBack();
            else goBackFunction();
          }}
          style={styles.goBack}
        >
          <GoBack height={24} />
        </View>
        <View
          style={styles.title}
          onTouchEndCapture={() => {
            console.log("title");
          }}
        >
          {folderColor !== undefined ? (
            <Image
              source={folder2Image}
              style={{ tintColor: folderColor, marginRight: 11, top: 3 }}
            />
          ) : (
            <></>
          )}
          <Text style={styles.titleText}>{text}</Text>
          {isShareFolder !== undefined && isShareFolder ? (
            <ShareFolder style={{ marginLeft: 5 }} />
          ) : (
            <></>
          )}
        </View>
        {rightButton === "goHome" ? (
          <View
            onTouchEndCapture={() => {
              navigation.navigate("Map");
            }}
            style={styles.goHome}
          >
            <Close height={24} />
          </View>
        ) : rightButton === "edit" ? (
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() => rightButtonFunction()}
              style={{
                left: 305,
                width: 20,
                height: 20,
              }}
            >
              <EditFolder />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => rightButtonFunction2()}
              style={{
                width: 20,
                height: 20,
                left: 330,
              }}
            >
              <DeleteFolder />
            </TouchableOpacity>
          </View>
        ) : rightButton === "addFriend" ? (
          <TouchableOpacity
            onPress={() => rightButtonFunction()}
            style={{
              left: 340,
              width: 20,
              alignItems: "center",
              height: 20,
              justifyContent: "center",
            }}
          >
            <AddFriend />
          </TouchableOpacity>
        ) : rightButton === "none" ? (
          <></>
        ) : (
          <></>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttons: {
    height: 56,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
  },
  goBack: {
    width: 32,
    height: 24,
    position: "absolute",
    left: 31,
    backgroundColor: "red",
  },
  title: {
    width: 280,
    height: 24,
    left: 63,
    position: "absolute",
    flexDirection: "row",
    backgroundColor: "grey",
  },
  titleText: {
    fontSize: 16,
    lineHeight: 25,
    fontWeight: "bold",
  },
  goHome: {
    width: 24,
    height: 24,
    right: 18.5,
    position: "absolute",
  },
});

export default GoBackHeader;

/**
 * 
      <View
        onTouchEndCapture={() => {
          navigation.goBack();
        }}
        style={styles.goBack}
      >
        <GoBack style={{ position: "relative" }} />
      </View>
      <View style={styles.title}>
        <Text style={styles.titleText}>{text}</Text>
      </View>
      {RightButton === "goHome" ? (
        <GoHome navigation={navigation} />
      ) : RightButton === "none" ? (
        <></>
      ) : RightButton === "edit" ? (
        <></>
      ) : RightButton === "addFriend" ? (
        <></>
      ) : (
        <></>
      )}
 */
