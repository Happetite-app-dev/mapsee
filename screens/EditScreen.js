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
  deleteObject,
  listAll,
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

import DateImage from "../assets/icons/date.svg";
import DeleteFolder from "../assets/icons/delete.svg";
import FolderImage from "../assets/icons/folder.svg";
import EditFolder from "../assets/icons/folderEdit.svg";
import FolderPrefix from "../assets/icons/folderPrefix.svg";
import GoBack from "../assets/icons/goBack.svg";
import LocationImage from "../assets/icons/location.svg";
import WritingImage from "../assets/icons/writing.svg";
import AppContext from "../components/AppContext";
import DatePicker from "../components/DatePicker";
import FolderBottomSheet from "../components/FolderBottomSheet";
import ImgPicker from "../components/ImgPicker";
import { PopUpType1, PopUpType2 } from "../components/PopUp";
import { storage, auth } from "../firebase";
import SendPushNotification from "../modules/SendPushNotification";

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
      if (snapshot.val() != null) {
        const folderUserIDs = Object.keys(snapshot.val());
        folderUserIDs.map((folderUserID) => {
          if (folderUserID != myUID) {
            const reference = ref(db, "/notices/" + folderUserID);
            push(reference, {
              type: "recept_recordAdd_done",
              performerUID: myUID,
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
      }
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
    }
    // storage 관련 저장/삭제
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

    const folderRef = ref_storage(storage, `images/${recordID}/`);
    onValue(ref(db, "/records/" + recordID + "/photos/"), (snapshot) => {
      if (snapshot.val() != null) {
        const keys = Object.keys(snapshot.val());

        listAll(folderRef)
          .then(function (result) {
            result.items.forEach(function (imageRef) {
              // And finally display them
              if (!keys.includes(imageRef.name)) deleteObject(imageRef);
            });
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    });

    //기존 기록의 수정이나 삭제는 알림 없어도 됨.
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
  //remove from storage
  const folderRef = ref_storage(storage, `images/${recordID}/`);

  listAll(folderRef)
    .then(function (result) {
      result.items.forEach(function (imageRef) {
        // And finally display them
        deleteObject(imageRef);
      });
    })
    .catch(function (error) {
      console.log(error);
    });

  // remove from database
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

  const [selectedPhotos, setSelectedPhotos] = useState(
    photos !== undefined && photos !== null ? Object.values(photos) : []
  );

  const [text_, setText_] = useState(text || "");
  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  const [goBackModalVisible, setGoBackModalVisible] = useState(false);
  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        backgroundColor: "white",
        flexDirection: "column",
      }}
    >
      <View
        style={{
          height: 56,
          top: 32,
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <View
          onTouchEndCapture={() => {
            setGoBackModalVisible(true);
          }}
          style={styles.goBack}
        >
          <GoBack height={24} />
        </View>
        <View style={styles.title}>
          <TextInput
            editable={isEditable}
            selectTextOnFocus={isEditable}
            style={styles.titleText}
            onChangeText={(tle) => setTitle_(tle)}
            value={title_}
            placeholder={`${timeNow2.getFullYear().toString()}_${(
              timeNow2.getMonth() + 1
            ).toString()}_${timeNow2.getDate().toString()}_기록`}
          />
        </View>
        {IsRecordOwner && !isEditable && (
          <View style={styles.twoRightButtons}>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                onPress={() => setIsEditable(true)}
                style={styles.firstButton}
              >
                <EditFolder />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setRemoveModalVisible(true)}
                style={styles.secondButton}
              >
                <DeleteFolder />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
      <ScrollView
        style={{ width: "100%", marginTop: 32 }}
        showsVerticalScrollIndicator={false}
        scrollEnabled
      >
        {selectedPhotos.length === 0 && !isEditable ? (
          <></>
        ) : (
          <View style={{ height: 210, ...styles.imgPicker }}>
            {/* <Image source={RecordPhotoImage} /> */}
            <ImgPicker
              onImageTaken={(photo) => {
                setSelectedPhotos((selectedPhotos) => [
                  ...selectedPhotos,
                  photo,
                ]);
              }}
              onImageErased={(photos) => setSelectedPhotos(() => photos)}
              defaultPhotos={selectedPhotos}
              IsEditable={isEditable}
            />
          </View>
        )}
        <View
          onTouchEndCapture={() => {
            showFolderBottomSheet && setShowFolderBottomSheet(false);
          }}
          style={{ height: 48, ...styles.item }}
        >
          <LocationImage />
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
          <DateImage />
          <DatePicker
            date1={date_}
            setDate1={(date1) => setDate_(date1)}
            show={showDatePicker}
            setShow={(show1) => setShowDatePicker(show1)}
            IsEditable={isEditable}
          />
        </View>
        <View style={{ height: 50, ...styles.item }}>
          <FolderImage />
          <TouchableOpacity
            onPress={() => {
              isEditable && setShowFolderBottomSheet(!showFolderBottomSheet);
            }}
            style={{
              width: 100,
              height: 40,
              left: 10,
              bottom: 7,
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <FolderPrefix height={16} width={16} />
            <Text> {folderName_}</Text>
          </TouchableOpacity>
          <View
            onTouchEndCapture={() => {
              showFolderBottomSheet && setShowFolderBottomSheet(false);
            }}
            style={{ flex: 1 }}
          />
        </View>
        {!isEditable && (text === undefined || text.length === 0) ? (
          <></>
        ) : (
          <View style={{ ...styles.item }}>
            <WritingImage />
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
        )}

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
      <PopUpType1
        modalVisible={removeModalVisible}
        modalHandler={setRemoveModalVisible}
        action={() =>
          removeRecord({ navigation, recordID, folderID_, placeID })
        }
        askValue="정말 삭제하시겠어요?"
        actionValue="삭제"
      />
      <PopUpType2
        modalVisible={goBackModalVisible}
        modalHandler={setGoBackModalVisible}
        action1={() => {
          navigation.goBack();
        }}
        action2={() => {
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
          });
        }}
        askValue="변경 사항을 저장하시겠어요?"
        actionValue1="저장 안함"
        actionValue2="저장"
      />
    </View>
  );
};

export default EditScreen;

const styles = StyleSheet.create({
  imgPicker: { marginTop: 16, width: "100%" },
  item: {
    flex: 1,
    flexDirection: "row",
    marginLeft: 23,
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
    lineHeight: 24,
    left: 10,
    bottom: 6,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 60,
    flexDirection: "row",
    position: "absolute",
    marginTop: 661,
  },

  goBack: {
    width: 32,
    height: 24,
    position: "absolute",
    left: 31,
  },
  title: {
    width: 304,
    height: 24,
    left: 63,
  },
  titleText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "bold",
  },
  twoRightButtons: {
    position: "absolute",
    right: 0,
    width: 86,
    height: 30,
  },
  firstButton: {
    width: 30,
    height: 30,
  },
  secondButton: {
    width: 30,
    height: 30,
    left: 10,
  },
});
