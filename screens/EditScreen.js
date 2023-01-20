import { useIsFocused } from "@react-navigation/native";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  remove,
  off,
} from "firebase/database";
import {
  ref as ref_storage,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import React, { useContext, createFactory, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Button,
  Image,
  SafeAreaView,
  TouchableHighlight,
  Alert,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import AppContext from "../components/AppContext";
import DatePicker from "../components/DatePicker";
import FolderBottomSheet from "../components/FolderBottomSheet";
import ImgPicker from "../components/ImgPicker";
import { storage, auth } from "../firebase";
import SendPushNotification from "../modules/SendPushNotification";

const RecordDateImage = require("../assets/image/RecordDate.png");
const RecordFolderImage = require("../assets/image/RecordFolder.png");
const RecordFolderNameImage = require("../assets/image/RecordFolderName.png");
const RecordLocationImage = require("../assets/image/RecordLocation.png");
const RecordPhotoImage = require("../assets/image/RecordPhoto.png");
const RecordTextImage = require("../assets/image/RecordText.png");
const editImage = require("../assets/image/edit.png");
const goBackImage = require("../assets/image/goBack.png");
const trashcanImage = require("../assets/image/trashcan.png");

const defaultFolderID = "-NB6gdHZgh_liXbnuOLr";
const defaultFolderName = "폴더1";

const uploadImage = async (image, imageName, newRecordID) => {
  const imageRef = ref_storage(storage, `images/${newRecordID}/${imageName}`);
  // `images === 참조값이름(폴더이름), / 뒤에는 파일이름 어떻게 지을지
  const blob = await new Promise((resolve, reject) => {
    // image 불러오기 위한 XML 만든다
    const xhr = new XMLHttpRequest();
    // imagePicker통해 선택된 사진을 blob형태로 가져온다
    xhr.open("GET", image, true);
    xhr.responseType = "blob";
    // XML 상태 확인
    xhr.onload = function () {
      // 성공하면 Promise의 값으로 xhr.response 반환
      resolve(xhr.response);
    };
    xhr.onerror = function () {
      // 실패하면 Promise의 값으로 Error 반환
      reject(new TypeError("Network request failed"));
    };
    // "GET" 인 경우에는 서버에 데이터를 보낼 필요 없음
    xhr.send(null);
  });

  await uploadBytes(imageRef, blob, {
    connectType: "image/png",
  }).then((snapshot) => {});

  blob.close();
  return await getDownloadURL(imageRef);
};

const uploadImages = (imageArray, imageNameArray, newRecordID) => {
  imageArray.map(async (image, index) => {
    const imageName = imageNameArray[index];
    console.log("image Name", index, imageName);
    const imageRef = ref_storage(storage, `images/${newRecordID}/${imageName}`);
    // `images === 참조값이름(폴더이름), / 뒤에는 파일이름 어떻게 지을지
    const blob = await new Promise((resolve, reject) => {
      // image 불러오기 위한 XML 만든다
      const xhr = new XMLHttpRequest();
      // imagePicker통해 선택된 사진을 blob형태로 가져온다
      xhr.open("GET", image, true);
      xhr.responseType = "blob";
      // XML 상태 확인
      xhr.onload = function () {
        // 성공하면 Promise의 값으로 xhr.response 반환
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        // 실패하면 Promise의 값으로 Error 반환
        reject(new TypeError("Network request failed"));
      };
      // "GET" 인 경우에는 서버에 데이터를 보낼 필요 없음
      xhr.send(null);
    });

    await uploadBytes(imageRef, blob, {
      connectType: "image/png",
    }).then((snapshot) => {});

    blob.close();
  });
};

const saveData = async (
  myUID,
  myID,
  myFirstName,
  myLastName,
  title,
  place,
  placeID,
  address,
  lctn,
  date,
  folderID,
  folderName,
  selectedPhotos,
  text,
  writeDate_,
  recordID,
  originalfolderID
) => {
  const timeNow = new Date();
  const writeDate = writeDate_ || {
    year: timeNow.getFullYear(),
    month: timeNow.getMonth() + 1,
    day: timeNow.getDate(),
    hour: timeNow.getHours(),
    minute: timeNow.getMinutes(),
  };
  const db = getDatabase();
  if (recordID == undefined) {
    //새 기록이라면
    const reference1 = ref(db, "/records");
    const newRecordID = push(reference1, {
      // records에 push
      folderID,
      placeID,
      address,
      lctn,
      userID: myUID,
      writeDate,
      title:
        title === undefined
          ? `${timeNow.getFullYear().toString()}_${(
              timeNow.getMonth() + 1
            ).toString()}_${timeNow.getDay().toString()}_기록`
          : title,
      placeName: place,
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
      },
      folderName,
      text,
    }).key;
    const reference2 = ref(
      db,
      `/folders/${folderID}/placeRecords/${placeID}/${newRecordID}`
    ); //folder에 recordID를 넣고
    set(reference2, true); //////// 여기에 사진 저장 함수 넣기
    selectedPhotos.map(async (image) => {
      const referenceImage = ref(db, "/records/" + newRecordID + "/photos");
      const imageID = push(referenceImage, image).key;

      const url = await uploadImage(image, imageID, newRecordID);
      const referenceUrl = ref(
        db,
        "/records/" + newRecordID + "/photos/" + imageID
      );
      set(referenceUrl, url);
    });

    //uploadImages(selectedPhotos, imageIDs, newRecordID);
    //push 알림과 내부 알림 보내기(나에게는 스낵바만 띄우기)
    onValue(ref(db, `/folders/${folderID}/userIDs`), (snapshot) => {
      console.log(snapshot);
      const folderUserIDs = Object.keys(snapshot.val());
      folderUserIDs.map((folderUserID) => {
        if (folderUserID != myUID) {
          const reference = ref(db, "/notices/" + folderUserID);
          push(reference, {
            type: "recept_recordAdd_done",
            performerUID: myUID,
            performerID: myID, //-->수정 필요
            performerFirstName: myFirstName,
            performerLastName: myLastName,
            time: timeNow.getTime(),
            //여기서 부턴 "recept_recordAdd_done" type 알림만의 정보
            folderID,
            recordID: newRecordID,
          });
          SendPushNotification({
            receiverUID: folderUserID,
            title_: "기록추가타이틀",
            body_: "기록추가바디",
          });
        }
      });
    });
  } //새 기록이 아니라면
  else {
    const reference1 = ref(db, "/records/" + recordID);
    set(reference1, {
      // records에 push
      folderID,
      placeID,
      address,
      lctn,
      userID: myUID,
      writeDate,
      title:
        title == undefined
          ? `${timeNow.getFullYear().toString()}_${(
              timeNow.getMonth() + 1
            ).toString()}_${timeNow.getDay().toString()}_기록`
          : title, //나중에 modify할 때 default title을 어떻게 할지를 기획한테 물어보기
      placeName: place,
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
      },
      folderName,
      photos: selectedPhotos,
      text,
    });
    if (folderID != originalfolderID) {
      const reference2 = ref(
        db,
        `/folders/${originalfolderID}/placeRecords/${placeID}/${recordID}`
      );
      await remove(reference2).then(
        onValue(
          ref(db, "/folders/" + originalfolderID + "/placeRecords/" + placeID),
          (snapshot) => {
            if (!snapshot.hasChildren()) {
              const reference3 = ref(
                db,
                "/folders/" + originalfolderID + "/placeRecords/" + placeID
              );
              remove(reference3);
            }
          }
        )
      );
      const reference4 = ref(
        db,
        `/folders/${folderID}/placeRecords/${placeID}/${recordID}`
      ); //folder에 recordID를 넣고
      set(reference4, true);

      selectedPhotos.map(async (image) => {
        const referenceImage = ref(db, "/records/" + recordID + "/photos");
        const imageID = push(referenceImage, image).key;

        const url = await uploadImage(image, imageID, recordID);
        const referenceUrl = ref(
          db,
          "/records/" + recordID + "/photos/" + imageID
        );
        set(referenceUrl, url);
      });

      //기존 기록의 수정이나 삭제는 알림 없어도 됨.
    }
  }
};
const storeRecord = async ({
  navigation,
  myUID,
  myID,
  myFirstName,
  myLastName,
  title_,
  place,
  placeID,
  address,
  lctn,
  date_,
  folderID_,
  folderName_,
  selectedPhotos,
  text_,
  writeDate,
  recordID,
  originalfolderID,
  IsNewRecord,
}) => {
  await saveData(
    myUID,
    myID,
    myFirstName,
    myLastName,
    title_,
    place,
    placeID,
    address,
    lctn,
    date_,
    folderID_,
    folderName_,
    selectedPhotos,
    text_,
    writeDate,
    recordID,
    originalfolderID
  ).then(() => {
    IsNewRecord ? navigation.pop() : navigation.navigate("Storage"); //realtimeDataBase가 모두 업데이트 된후
  });
};
const removeData = async ({ recordID, folderID, placeID }) => {
  const db = getDatabase();
  const reference1 = ref(db, "/records/" + recordID);
  await remove(reference1)
    .then(() => {
      const reference2 = ref(
        db,
        "/folders/" + folderID + "/placeRecords/" + placeID + "/" + recordID
      );
      remove(reference2);
    })
    .then(
      onValue(
        ref(db, "/folders/" + folderID + "/placeRecords/" + placeID),
        (snapshot) => {
          if (!snapshot.hasChildren()) {
            const reference3 = ref(
              db,
              "/folders/" + folderID + "/placeRecords/" + placeID
            );
            remove(reference3);
          }
        }
      )
    );
};

const removeRecord = async ({ navigation, recordID, folderID_, placeID }) => {
  await removeData({ recordID, folderID_, placeID }).then(
    () => navigation.navigate("Storage") //realtimeDataBase가 모두 업데이트 된후
  );
};

const removeRecordPopUp = ({ navigation, recordID, folderID_, placeID }) => {
  return Alert.alert(
    "정말 삭제하시겠습니까?",
    "",
    [
      { text: "취소" },
      {
        text: "삭제",
        onPress: () =>
          removeRecord({ navigation, recordID, folderID_, placeID }),
        style: "default",
      },
    ],
    {
      cancelable: false,
    }
  );
};

const EditScreen = ({ navigation, route }) => {
  const myContext = useContext(AppContext);
  const myUID = myContext.myUID;
  const myID = myContext.myID;
  const myFirstName = myContext.myFirstName;
  const myLastName = myContext.myLastName;

  const timeNow2 = new Date();

  const {
    recordID,
    folderID,
    placeID,
    address,
    lctn,
    userID,
    writeDate,
    title,
    placeName,
    date,
    folderName,
    photos,
    text,
  } = route.params;

  const IsNewRecord = title === undefined; //지금 사용자가 작성하고 있는 record가 새로 만드는 record인지 기존에 있던 record인지를 알려주는 bool
  const IsRecordOwner = userID === myUID; //기존의 기록인 경우, 그것이 자신의 기록인지 확인하는 bool
  const [isEditable, setIsEditable] = useState(IsNewRecord); //이거는 IsNewRecord이거나, IsRecordOwner이고 토글을 눌렀을 때 true가 됨

  const [title_, setTitle_] = useState(title || undefined);

  const [place, setPlace] = useState(placeName);

  const [date_, setDate_] = useState(
    date === undefined
      ? new Date()
      : new Date(date.year, date.month - 1, date.day)
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  const originalfolderID = folderID; //만약 IsnewRecord가 아니라면 기존에 저장되어 있을 folderID를 받는다. IsNewRecord라면
  const [folderID_, setFolderID_] = useState(folderID || defaultFolderID);
  const [folderName_, setFolderName_] = useState(
    folderName || defaultFolderName
  );
  const [showFolderBottomSheet, setShowFolderBottomSheet] = useState(false);

  const [selectedPhotos, setSelectedPhotos] = useState(photos || []);
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    console.log("selectedPhotos", selectedPhotos);
    Object.values(selectedPhotos).map(async (photo) => {
      const name = photo.split("/").at(-1);
      //console.log("photo updating", `images/${recordID}/${name}`);

      const url = await getDownloadURL(
        ref_storage(storage, `images/${recordID}/${name}`)
      );
      //console.log("url", url);
      setImageUrls([...imageUrls, url]);
      //console.log("imageUrls changed");
    });
  }, [selectedPhotos]);

  useEffect(() => {
    //console.log("imageUrls", imageUrls);
  }, [imageUrls]);

  const [text_, setText_] = useState(text || "");

  return (
    <SafeAreaView
      style={{ width: "100%", height: "100%", position: "absolute", top: 20 }}
    >
      <View
        style={{
          height: "8%",
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={{ left: 7, width: 20, height: 30, justifyContent: "center" }}
          onPress={() => navigation.pop()}
        >
          <Image source={goBackImage} />
        </TouchableOpacity>
        <TextInput
          editable={isEditable}
          selectTextOnFocus={isEditable}
          style={{
            fontSize: 17,
            fontWeight: "bold",
            top: 7,
            left: 1,
            ...styles.textInput,
            width: 280,
          }}
          onChangeText={(tle) => setTitle_(tle)}
          value={title_}
          placeholder={`${timeNow2.getFullYear().toString()}_${(
            timeNow2.getMonth() + 1
          ).toString()}_${timeNow2.getDate().toString()}_기록`}
          placeholderTextColor="grey"
        />
        {IsRecordOwner && !isEditable && (
          <View
            style={{
              position: "absolute",
              right: 11,
              width: 70,
              height: 30,
            }}
          >
            <TouchableHighlight
              style={{ left: 0, position: "absolute", width: 18, height: 18 }}
              underlayColor="none"
              onPress={() => setIsEditable(true)}
            >
              <Image source={editImage} />
            </TouchableHighlight>
            <TouchableHighlight
              style={{ right: 14, position: "absolute", width: 18, height: 18 }}
              onPress={() =>
                removeRecordPopUp({ navigation, recordID, folderID_, placeID })
              }
            >
              <Image source={trashcanImage} />
            </TouchableHighlight>
          </View>
        )}
      </View>
      <ScrollView
        style={{ height: "90%", width: "100%" }}
        showsVerticalScrollIndicator={false}
        scrollEnabled
      >
        <View style={{ height: 210, ...styles.item }}>
          {/* <Image source={RecordPhotoImage} /> */}
          <ImgPicker
            onImageTaken={(photo) => {
              setSelectedPhotos((selectedPhotos) => [...selectedPhotos, photo]);
            }}
            defaultPhotos={selectedPhotos}
            IsEditable={isEditable}
          />
        </View>
        <View
          onTouchEndCapture={() => {
            showFolderBottomSheet && setShowFolderBottomSheet(false);
          }}
          style={{ height: 50, ...styles.item }}
        >
          <Image source={RecordLocationImage} />
          <TextInput
            editable={isEditable}
            selectTextOnFocus={isEditable}
            style={{ fontSize: 15, ...styles.textInput }}
            onChangeText={(plc) => setPlace(plc)}
            value={place}
          />
        </View>
        <View
          onTouchEndCapture={() => {
            showFolderBottomSheet && setShowFolderBottomSheet(false);
          }}
          style={{
            width: 350,
            height: showDatePicker ? 266 : 50,
            ...styles.item,
          }}
        >
          <Image source={RecordDateImage} />
          <DatePicker
            date1={date_}
            setDate1={(date1) => setDate_(date1)}
            show={showDatePicker}
            setShow={(show1) => setShowDatePicker(show1)}
            IsEditable={isEditable}
          />
        </View>
        <View style={{ height: 50, ...styles.item }}>
          <Image source={RecordFolderImage} />
          <TouchableOpacity
            onPress={() => {
              isEditable && setShowFolderBottomSheet(!showFolderBottomSheet);
            }}
            style={{
              width: 76,
              height: 32,
              borderRadius: 16,
              left: 10,
              bottom: 7,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              backgroundColor: "grey",
            }}
          >
            <Image source={RecordFolderNameImage} />
            <Text> {folderName_}</Text>
          </TouchableOpacity>
          <View
            onTouchEndCapture={() => {
              showFolderBottomSheet && setShowFolderBottomSheet(false);
            }}
            style={{ flex: 1 }}
          />
        </View>
        <View style={{ ...styles.item }}>
          <Image source={RecordTextImage} />
          <TextInput
            editable={isEditable}
            selectTextOnFocus={isEditable}
            style={styles.record}
            onChangeText={(txt) => setText_(txt)}
            value={text_}
            multiline
            placeholder="내용을 입력해주세요"
            placeholderTextColor="grey"
          />
        </View>
        {isEditable && (
          <View style={{ ...styles.button }}>
            <TouchableOpacity
              onPress={() => {
                IsNewRecord ? navigation.pop() : setIsEditable(false);
              }}
              style={{ width: 160, padding: 15, marginRight: 7 }}
            >
              <Text style={{ alignSelf: "center", fontWeight: "bold" }}>
                취소
              </Text>
            </TouchableOpacity>
            <Text>|</Text>
            <TouchableOpacity
              onPress={() =>
                storeRecord({
                  navigation,
                  myUID,
                  myID,
                  myFirstName,
                  myLastName,
                  title_,
                  place,
                  placeID,
                  address,
                  lctn,
                  date_,
                  folderID_,
                  folderName_,
                  selectedPhotos,
                  text_,
                  writeDate,
                  recordID,
                  originalfolderID,
                  IsNewRecord,
                })
              }
              style={{ width: 160, padding: 15, marginLeft: 7 }}
            >
              <Text style={{ alignSelf: "center", fontWeight: "bold" }}>
                저장
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      <FolderBottomSheet
        stackNavigation={navigation}
        show={showFolderBottomSheet}
        setShow={(s) => {
          setShowFolderBottomSheet(s);
        }}
        setFolderName={(f) => setFolderName_(f)}
        setFolderID={(f) => setFolderID_(f)}
      />
    </SafeAreaView>
  );
};

export default EditScreen;

const styles = StyleSheet.create({
  item: {
    marginLeft: 7,
    flex: 1,
    flexDirection: "row",
  },
  label: {
    fontSize: 17,
    marginTop: 2,
    marginBottom: 15,
    marginRight: 15,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  textInput: {
    //borderBottomColor: '#B0E0E6',
    //borderBottomWidth:1,
    marginBottom: 15,
    paddingVertical: 2,
    paddingHorizontal: 2,
    width: "85%",
    bottom: 6,
    paddingLeft: 14,
  },
  record: {
    //borderColor: '#B0E0E6',
    width: "85%",
    height: 360,
    //borderWidth:1,
    marginBottom: 7,
    paddingVertical: 2,
    paddingHorizontal: 2,
    left: 10,
    bottom: 6,
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 60,
    flexDirection: "row",
  },
});
