import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { StatusBar } from "expo-status-bar";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  remove,
  off,
} from "firebase/database";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  ImageComponent,
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableOpacity,
} from "react-native";

import AppContext from "../components/AppContext";

const saveToken = async (token, myUID) => {
  const db = getDatabase();
  const reference1 = ref(db, "/users/" + myUID + "/pushToken");
  set(reference1, token);
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const GeneratePushToken = () => {
  const myContext = useContext(AppContext);
  const myUID = myContext.myUID;
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    //expoPushToken에 token 저장
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  //token을 device에서 갖고옴.
  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        //useState를 만들어서 existingStatus가 "granted"가 아니라면, 나중에 saveToken할 때 sendPushNotification을 스스로한테 해주기
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    //myUID에 token을 새롭게 저장.-->계정이 로그인된 가장 최근 기기에 push 알림이 오는것이 자연스럽다!
    saveToken(token, myUID);

    return token;
  }
  //push 알림 허용할 때 push 알림으로 mapsee에 오신걸 환영합니다! 이런 문구 띄우길 바라는지 기획팀에 체크 필요
  //   async function sendPushNotification(expoPushToken) {
  //     const message = {
  //       to: expoPushToken,
  //       sound: "default",
  //       title: title_,
  //       body: body_,
  //       data: { someData: "goes here" },
  //     };

  //     await fetch("https://exp.host/--/api/v2/push/send", {
  //       method: "POST",
  //       headers: {
  //         Accept: "application/json",
  //         "Accept-encoding": "gzip, deflate",
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(message),
  //     });
  //   }

  return (
    <View>
      {/* <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
        <Text>로그인 후 화면</Text>
      </View> */}
      {/* <TouchableOpacity     //push 알림 허용할 때 push 알림으로 mapsee에 오신걸 환영합니다! 이런 문구 띄우길 바라는지 기획팀에 체크 필요
        onPress={async () => {
          await sendPushNotification(expoPushToken);
        }}
      >
        <View>
          <Text>send notification</Text>
        </View>
      </TouchableOpacity> */}
    </View>
  );
};

export default GeneratePushToken;
