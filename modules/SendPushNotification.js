import * as Notifications from "expo-notifications";
import { ref, onValue, set, push, remove, off } from "firebase/database";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

import database from "../firebase";
const db = database;

const SendPushNotification = ({ receiverUID, title_, body_ }) => {
  onValue(ref(db, "/users/" + receiverUID + "/pushToken"), (snapshot) => {
    sendPushNotification(snapshot.val());
  });

  async function sendPushNotification(expoPushToken) {
    const message = {
      to: expoPushToken,
      sound: "default",
      title: title_,
      body: body_,
      data: { someData: "goes here" },
    };

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  }
};

export default SendPushNotification;
