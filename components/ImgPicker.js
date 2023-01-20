import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { getDatabase, ref, remove } from "firebase/database";
import {
  ref as ref_storage,
  uploadBytes,
  getDownloadURL,
  child,
  deleteObject,
} from "firebase/storage";
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

import { storage } from "../firebase";
import ImageCarousel from "./ImageCarousel";

function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}

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

const deleteImage = (
  image,
  fullPhotoData,
  pickedImages,
  setPickedImages,
  onImageErased,
  recordID
) => {
  const key = Object.entries(fullPhotoData).find(
    ([key, val]) => val === image
  )[0];
  const idx = pickedImages.indexOf(image); // findIndex = find + indexOf

  setPickedImages((prev) => prev.splice(idx, 1));
  onImageErased(pickedImages);

  const imageRef = ref_storage(storage, `images/${recordID}/${key}`);

  deleteObject(imageRef)
    .then(() => {})
    .catch((err) => {
      console.log(err);
    });
};

const ImgPicker = ({
  onImageTaken,
  onImageErased,
  defaultPhotos,
  fullPhotoData,
  IsEditable,
  recordID,
}) => {
  const [pickedImages, setPickedImages] = useState(defaultPhotos);
  return (
    <View style={styles.imagePicker}>
      {IsEditable ? (
        <View>
          <View style={{ height: 110, width: 360 }}>
            <ScrollView
              showsHorizontalScrollIndicator={false}
              horizontal
              style={{ height: 148 }}
            >
              <TouchableOpacity
                onPress={() => {
                  takeImageHandlerLib(setPickedImages, onImageTaken);
                }}
                style={styles.imagePreview}
              >
                <Text style={{ fontSize: 35, color: "grey" }}>+</Text>
              </TouchableOpacity>
              {Object.values(pickedImages).map((image) => {
                return (
                  <View style={{ position: "relative" }}>
                    <Image style={styles.image} source={{ uri: image }} />
                    <Button
                      title="누ㄹ러"
                      onPress={() => {
                        deleteImage(
                          image,
                          fullPhotoData,
                          pickedImages,
                          setPickedImages,
                          onImageErased,
                          recordID
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
                      <></>
                    </Button>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
      ) : (
        <View style={{ height: 148, width: 360 }}>
          {pickedImages.length === 0 ? (
            <Text style={{ fontSize: 35, color: "grey" }}>
              저장된 사진이 없습니다
            </Text>
          ) : (
            <ImageCarousel images={Object.values(pickedImages)} />
          )}
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
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
  },
  image: {
    width: 148,
    height: 148,
    borderRadius: 10,
    //marginBottom:10,
    marginRight: 15,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    position: "absolute",
  },
});

export default ImgPicker;
