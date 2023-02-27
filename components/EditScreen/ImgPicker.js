import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import React, { useEffect, useState } from "react";
import {
  View,
  Button,
  Text,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import DeletePhoto from "../../assets/icons/deletePhoto.svg";
import ImageCarousel from "./ImageCarousel";
const verifyPermissionsCam = async () => {
  const result = await Permissions.askAsync(Permissions.CAMERA);
  if (result.status !== "granted") {
    Alert.alert(
      "Insufficient permissions!",
      "You need to grant camera permissions to use this app.",
      [{ text: "Okay" }]
    );
    return false;
  }
  return true;
};

const verifyPermissionsLib = async () => {
  const result = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
  if (result.status !== "granted") {
    Alert.alert(
      "Insufficient permissions!",
      "You need to grant camera permissions to use this app.",
      [{ text: "Okay" }]
    );
    return false;
  }
  return true;
};

const takeImageHandlerLib = async (setPickedImages, onImageTaken) => {
  const hasPermission = await verifyPermissionsLib();
  if (!hasPermission) {
    return;
  }

  const image = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: true,
    quality: 0.5,
  });

  if (!image.cancelled) {
    setPickedImages((images) => [...images, image.uri]);
    onImageTaken(image.uri);
  }
};

const takeImageHandlerCam = async (setPickedImages, onImageTaken) => {
  const hasPermission = await verifyPermissionsCam();
  if (!hasPermission) {
    return;
  }

  const image = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    quality: 0.5,
  });

  setPickedImages((images) => [...images, image.uri]);
  onImageTaken(image.uri);
};

const deleteImage = (image, pickedImages, setPickedImages, onImageErased) => {
  const idx = pickedImages.indexOf(image); // findIndex = find + indexOf
  pickedImages.splice(idx, 1);
  setPickedImages((prev) => prev.splice(idx, 1));
  onImageErased(pickedImages);
};

const ImgPicker = ({
  onImageTaken,
  onImageErased,
  defaultPhotos,
  IsEditable,
  onToggleSnackBar,
}) => {
  const [pickedImages, setPickedImages] = useState(defaultPhotos);
  useEffect(() => {
    if (pickedImages === undefined) setPickedImages([]);
  }, [pickedImages]);
  return (
    <View style={styles.imagePicker}>
      {IsEditable ? (
        <View>
          <View style={{ height: 148, width: 360 }}>
            <ScrollView
              showsHorizontalScrollIndicator={false}
              horizontal
              style={{ height: 148 }}
            >
              <TouchableOpacity
                onPress={() => {
                  if (pickedImages.length >= 10) onToggleSnackBar();
                  else takeImageHandlerLib(setPickedImages, onImageTaken);
                }}
                style={styles.imagePreview}
              >
                <Text style={{ fontSize: 40, color: "#5ED3CC" }}>+</Text>
              </TouchableOpacity>

              {pickedImages != null && pickedImages !== undefined ? (
                pickedImages.map((image) => {
                  return (
                    <View
                      style={{
                        position: "relative",
                        marginRight: 164,
                      }}
                    >
                      <Image style={styles.image} source={{ uri: image }} />
                      <View
                        onTouchEndCapture={() => {
                          deleteImage(
                            image,
                            pickedImages,
                            setPickedImages,
                            onImageErased
                          );
                        }}
                        style={{
                          width: 24,
                          height: 24,
                          marginTop: 8,
                          marginLeft: 116,
                          position: "absolute",
                        }}
                      >
                        <DeletePhoto />
                      </View>
                    </View>
                  );
                })
              ) : (
                <></>
              )}
            </ScrollView>
          </View>
        </View>
      ) : pickedImages.length === 0 ? (
        <></>
      ) : (
        <View style={{ height: 148, width: 360 }}>
          <ImageCarousel images={Object.values(pickedImages)} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  imagePicker: {
    alignItems: "center",
    marginBottom: 15,
    flexDirection: "row",
    paddingLeft: 10,
  },
  imagePreview: {
    width: 148,
    height: 148,
    borderRadius: 10,
    //marginBottom:10,
    marginRight: 15,
    backgroundColor: "#F4F5F9",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 0,
  },
  image: {
    width: 148,
    height: 148,
    borderRadius: 8,
    //marginBottom:10,
    marginRight: 15,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 0,
    position: "absolute",
  },
});

export default ImgPicker;
