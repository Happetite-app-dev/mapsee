import { ref, onValue, set, push, remove } from "firebase/database";
import { useQueryClient } from "react-query";
import * as Location from "expo-location";
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
  unstable_batchedUpdates,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { get } from "lodash";

import ShareFolder from "../assets/icons/Share copy.svg";
import ListEcllipse from "../assets/icons/ListEcllipse.svg";
import DateImage from "../assets/icons/date.svg";
import DeleteFolder from "../assets/icons/Delete.svg";
import FolderImage from "../assets/icons/Folder.svg";
import GoBack from "../assets/icons/BackArrow.svg";
import LocationImage from "../assets/icons/Location/Location.svg";
import WritingImage from "../assets/icons/Edit.svg";
import Upload from "../assets/icons/Upload.svg";

import AppContext from "../components/AppContext";
import DatePicker from "../components/EditScreen/DatePicker";
import FolderBottomSheet from "../components/FolderBottomSheet/FolderBottomSheet";
import ImgPicker from "../components/EditScreen/ImgPicker";
import { PopUpType1, PopUpType2 } from "../components/PopUp";
import SnackBar from "../components/SnackBar";
import { storage, auth, database } from "../firebase";
import SendPushNotification from "../modules/SendPushNotification";
import { useFolderQuery, useRecordQuery, useUserQuery } from "../queries";

const db = database;

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
  originalfolderID,
  myName,
  myID
) => {
  const timeNow = new Date();
  const writeDate = writeDate_ || {
    year: timeNow.getFullYear(),
    month: timeNow.getMonth() + 1,
    day: timeNow.getDate(),
    hour: timeNow.getHours(),
    minute: timeNow.getMinutes(),
  };
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
          ? `${timeNow.getFullYear().toString().charAt(2)}${timeNow
              .getFullYear()
              .toString()
              .charAt(3)}${(timeNow.getMonth() + 1 < 10
              ? "0" + `${timeNow.getMonth() + 1}`
              : timeNow.getMonth() + 1
            ).toString()}${timeNow.getDate().toString()} 기록`
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
              title_: "mapsee 맵시", ///
              body_: `${myName}(@${myID})님이 폴더[${folderName}]에 기록을 남겼습니다.`, // ~님이 ~폴더에 기록을 남겼습니다.
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
          ? `${timeNow.getFullYear().toString().charAt(2)}${timeNow
              .getFullYear()
              .toString()
              .charAt(3)}${(timeNow.getMonth() + 1 < 10
              ? "0" + `${timeNow.getMonth() + 1}`
              : timeNow.getMonth() + 1
            ).toString()}${timeNow.getDate().toString()} 기록`
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

    const referenceDate = ref(db, `/folders/${folderID}/updateDate`);
    const now = new Date();
    set(referenceDate, now.toString());

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
  queryClient,
  myName,
}) => {
  await saveData(
    myUID,
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
    myName,
    myID
  )
    .then(() => {
      queryClient.invalidateQueries(["users", myUID]);
      queryClient.invalidateQueries(["folders", folderID_]);
      queryClient.invalidateQueries(["records"]);
      queryClient.invalidateQueries(["recordIDList"]);
    })
    .then(() => {
      navigation.navigate("Storage"); //realtimeDataBase가 모두 업데이트 된후
    });
};
const removeData = async ({ recordID, folderID, placeID, queryClient }) => {
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
  const reference1 = ref(db, "/records/" + recordID);
  await remove(reference1)
    .then(() => {
      const reference2 = ref(
        db,
        "/folders/" + folderID + "/placeRecords/" + placeID + "/" + recordID
      );
      //console.log(folderID, placeID, recordID)
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

  // invalidate queries
  queryClient.invalidateQueries(["folders", folderID]);
  queryClient.invalidateQueries(["records", recordID]);
  queryClient.invalidateQueries(["recordIDList"]);
};
const removeRecord = async ({
  navigation,
  recordID,
  folderID_,
  placeID,
  queryClient,
}) => {
  await removeData({
    recordID,
    folderID: folderID_,
    placeID,
    queryClient,
  }).then(
    () => navigation.navigate("Storage") //realtimeDataBase가 모두 업데이트 된후
  );
};

const EditScreen = ({ navigation, route }) => {
  // Location for SubSearchScreen1
  const [current, setCurrent] = useState([0, 0]);

  useEffect(() => {
    async function getLocation() {
      const location = await Location.getCurrentPositionAsync({});
      setCurrent({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    }

    getLocation();
  });

  //
  const myContext = useContext(AppContext);
  const myUID = myContext.myUID;
  const myID = myContext.myID;
  const queryClient = useQueryClient();

  const myFirstName = myContext.myFirstName;
  const myLastName = myContext.myLastName;

  const timeNow2 = new Date();

  const { recordID, placeID, placeName, address, lctn } = route.params;
  const query = useRecordQuery(recordID);
  const data = query.data ? query.data : null;

  const userQuery = useUserQuery(myUID);
  const defaultFolderID = userQuery.data?.folderIDs
    ? Object.keys(userQuery.data.folderIDs)[0]
    : null;
  const defaultFolderQuery = useFolderQuery(defaultFolderID);
  const defaultFolderName = defaultFolderQuery?.data?.folderName[myUID];
  const defaultFolderColor = defaultFolderQuery?.data?.folderColor[myUID];
  const [isShareFolder, setIsShareFolder] = useState(
    defaultFolderQuery?.data?.userIDs !== undefined &&
      Object.keys(defaultFolderQuery.data.userIDs).length > 1
  );

  const IsNewRecord = recordID === undefined; //data?.title === undefined; //지금 사용자가 작성하고 있는 record가 새로 만드는 record인지 기존에 있던 record인지를 알려주는 bool
  const IsRecordOwner = data?.userID === myUID; //기존의 기록인 경우, 그것이 자신의 기록인지 확인하는 bool
  const [isEditable, setIsEditable] = useState(IsNewRecord); //이거는 IsNewRecord이거나, IsRecordOwner이고 토글을 눌렀을 때 true가 됨

  const [placeID_, setPlaceID_] = useState(placeID || data?.placeID);
  const [placeName_, setPlaceName_] = useState(placeName || data?.placeName);
  const [address_, setAddress_] = useState(address || data?.address);
  const [lctn_, setLctn_] = useState(lctn || data?.lctn);

  const [title_, setTitle_] = useState(data?.title || undefined);
  const [date_, setDate_] = useState(
    data?.date === undefined
      ? new Date()
      : new Date(data?.date.year, data?.date.month - 1, data?.date.day)
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const originalfolderID = data?.folderID; //만약 IsnewRecord가 아니라면 기존에 저장되어 있을 folderID를 받는다. IsNewRecord라면
  const [folderID_, setFolderID_] = useState(data?.folderID || defaultFolderID);
  const [folderName_, setFolderName_] = useState(
    data?.folderName || defaultFolderName
  );
  // Folder Query: folder 색상 받아오기...
  const folderQuery = useFolderQuery(folderID_);
  const [folderColor_, setFolderColor_] = useState(
    get(folderQuery.data, ["folderColor", myUID]) || defaultFolderColor
  );

  const writerUserQuery = useUserQuery(data?.userID);

  const [showFolderBottomSheet, setShowFolderBottomSheet] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState(
    data?.photos !== undefined && data?.photos !== null
      ? Object.values(data?.photos)
      : []
  );
  const [text_, setText_] = useState(data?.text || "");
  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  const [goBackModalVisible, setGoBackModalVisible] = useState(false);
  const [visible, setVisible] = useState(false); // Snackbar
  const [visibleUpload, setVisibleUpload] = useState(false); // Snackbar

  useEffect(() => {
    setPlaceID_(placeID || data?.placeID);
    setPlaceName_(placeName || data?.placeName);
    setAddress_(address || data?.address);
    setLctn_(lctn || data?.lctn);
    setTitle_(data?.title || undefined);
    setDate_(
      data?.date === undefined
        ? new Date()
        : new Date(data?.date.year, data?.date.month - 1, data?.date.day)
    );
    setFolderID_(data?.folderID || defaultFolderID);
    setFolderName_(data?.folderName || defaultFolderName);
    setSelectedPhotos(
      data?.photos !== undefined && data?.photos !== null
        ? Object.values(data?.photos)
        : []
    );
    setText_(data?.text || "");
    setFolderColor_(folderQuery.data?.folderColor[myUID] || defaultFolderColor);
  }, [query.isLoading || folderQuery.isLoading]);

  useEffect(() => {
    if (folderQuery.data?.userIDs !== undefined) {
      setFolderColor_(
        folderQuery.data?.folderColor[myUID] || defaultFolderColor
      );
      setIsShareFolder(Object.keys(folderQuery.data.userIDs).length > 1);
    }
  }, [folderID_]);

  const onToggleSnackBar = () => setVisible(!visible); // SnackbarButton -> 나중에는 없애기
  const onDismissSnackBar = () => setVisible(false); // Snackbar
  const onToggleSnackBarUpload = () => setVisibleUpload(true); // Snackbar
  const onDismissSnackBarUpload = () => setVisibleUpload(false); // Snackbar

  return query.isLoading ? (
    <Text>로딩중</Text>
  ) : query.isError ? (
    <Text>에러</Text>
  ) : (
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
          marginTop: 32,
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View
          onTouchEndCapture={() => {
            if (isEditable) setGoBackModalVisible(true);
            else navigation.goBack();
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
            placeholder={`${timeNow2
              .getFullYear()
              .toString()
              .charAt(2)}${timeNow2
              .getFullYear()
              .toString()
              .charAt(3)}${(timeNow2.getMonth() + 1 < 10
              ? "0" + `${timeNow2.getMonth() + 1}`
              : timeNow2.getMonth() + 1
            ).toString()}${timeNow2.getDate().toString()} 기록`}
          />
        </View>
        {IsRecordOwner && !isEditable && (
          <View style={styles.twoRightButtons}>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                onPress={() => setIsEditable(true)}
                style={styles.firstButton}
              >
                <WritingImage />
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
        {(isEditable && IsRecordOwner) || IsNewRecord ? (
          <View
            style={{
              height: 24,
              position: "absolute",
              lineHeight: 24,
              right: 0,
            }}
          >
            <TouchableOpacity
              style={{
                width: 72,
                height: 24,
                right: 0,
              }}
              onPress={() => {
                console.log("pressed");
                console.log(placeID_);
                if (placeID_ == undefined)
                  Alert.alert("알림", "장소를 선택해주세요");
                else
                  storeRecord({
                    navigation,
                    myUID,
                    myID,
                    myFirstName,
                    myLastName,
                    title_,
                    place: placeName_,
                    placeID: placeID_,
                    address: address_,
                    lctn: lctn_,
                    date_,
                    folderID_,
                    folderName_,
                    selectedPhotos,
                    text_,
                    writeDate: data?.writeDate,
                    recordID,
                    originalfolderID,
                    IsNewRecord,
                    queryClient,
                    myName: myContext.myLastName + myContext.myFirstName,
                  });
              }}
            >
              <Upload
                style={{
                  right: 23,
                  position: "absolute",
                }}
              />
            </TouchableOpacity>
          </View>
        ) : !IsRecordOwner && !isEditable ? (
          <View
            style={{
              backgroundColor: "#F4F5F9",
              height: 24,
              right: 23,
              position: "absolute",
              lineHeight: 24,
              paddingLeft: 16,
              paddingRight: 16,
              borderRadius: 12,
              paddingTop: 4,
            }}
          >
            <Text
              style={{
                height: 16,
                fontFamily: "NotoSansKR-Medium",
                alignContent: "center",
                lineHeight: 16,
                fontSize: 12,
              }}
            >
              {writerUserQuery.data?.lastName + writerUserQuery.data?.firstName}
            </Text>
          </View>
        ) : (
          <></>
        )}
      </View>
      <ScrollView
        style={{
          width: "100%",
          marginTop: 16,
          height: "100%",
        }}
        showsVerticalScrollIndicator={false}
        scrollEnabled
      >
        {selectedPhotos.length === 0 && !isEditable ? (
          <View></View>
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
              onToggleSnackBar={onToggleSnackBar}
              navigation={navigation}
            />
          </View>
        )}
        <View
          onTouchEndCapture={() => {
            showFolderBottomSheet && setShowFolderBottomSheet(false);
            if (isEditable) {
              navigation.navigate("SubSearchScreen1", {
                setPlaceID: (f) => setPlaceID_(f),
                setPlaceName: (f) => setPlaceName_(f),
                setAddress: (f) => setAddress_(f),
                setLctn: (f) => setLctn_(f),
                current,
              });
            }
          }}
          style={{
            height: 48,
            width: 150,
            ...styles.item,
          }}
        >
          <LocationImage />
          {placeName_ ? (
            <Text
              style={{
                height: 24,
                lineHeight: 24,
                fontSize: 14,
                left: 12,
                fontFamily: "NotoSansKR-Regular",
              }}
            >
              {placeName_}
            </Text>
          ) : (
            <Text
              style={{
                height: 24,
                lineHeight: 24,
                fontSize: 14,
                left: 12,
                fontFamily: "NotoSansKR-Regular",
                color: "#ADB1C5",
              }}
            >
              장소를 입력하세요
            </Text>
          )}
        </View>
        <View
          onTouchEndCapture={() => {
            showFolderBottomSheet && setShowFolderBottomSheet(false);
          }}
          style={{
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
          <View
            onTouchEndCapture={() => {
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
            <ListEcllipse color={folderColor_} />
            <Text
              style={{
                fontFamily: "NotoSansKR-Regular",
                left: 10,
                lineHeight: 18,
                height: 16,
              }}
            >
              {folderName_}
            </Text>
            {(folderQuery.userIDs !== undefined &&
              Object.entries(folderQuery.userIDs).length >= 2) ||
            isShareFolder ? (
              <ShareFolder
                color="#ADB1C5"
                style={{ left: 12, position: "relative", top: -0.5 }}
              />
            ) : (
              <></>
            )}
          </View>
          <View
            onTouchEndCapture={() => {
              showFolderBottomSheet && setShowFolderBottomSheet(false);
            }}
            style={{ flex: 1 }}
          />
        </View>
        {!isEditable && (data?.text === undefined || data.text.length === 0) ? (
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
              placeholder="내용을 입력하세요"
              placeholderTextColor="#ADB1C5"
            />
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
        selectedFolderID={folderID_}
        setFolderColor={(f) => setFolderColor_(f)}
      />
      <SnackBar
        visible={visible}
        onDismissSnackBar={onDismissSnackBar}
        text="최대 10개까지 사진 첨부 가능합니다."
      />
      <SnackBar
        visible={visibleUpload}
        onDismissSnackBar={onDismissSnackBarUpload}
        text="장소를 입력하세요."
      />
      <PopUpType1
        modalVisible={removeModalVisible}
        modalHandler={setRemoveModalVisible}
        action={() =>
          removeRecord({
            navigation,
            recordID,
            folderID_,
            placeID: data?.placeID,
            queryClient,
          })
        }
        askValue="정말 삭제하시겠어요?"
        actionValue="삭제"
      />
      <PopUpType1
        modalVisible={goBackModalVisible}
        modalHandler={setGoBackModalVisible}
        action={() => {
          navigation.goBack();
        }}
        askValue="정말 기록을 그만두시겠어요?"
        actionValue="그만두기"
      />
    </View>
  );
};

export default EditScreen;

const styles = StyleSheet.create({
  imgPicker: {
    width: "100%",
    height: 148,
    marginBottom: 24,
  },
  item: {
    flex: 1,
    flexDirection: "row",
    width: 344,
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
    fontFamily: "NotoSansKR-Regular",
    fontSize: 14,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 40,
    flexDirection: "row",
    bottom: -30,
    position: "absolute",
  },

  goBack: {
    width: 32,
    height: 24,
    position: "absolute",
    left: 23,
  },
  title: {
    width: 304,
    height: 24,
    left: 63,
  },
  titleText: {
    fontSize: 16,
    lineHeight: 20,
    fontFamily: "NotoSansKR-Medium",
    height: 24,
    width: 224,
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
