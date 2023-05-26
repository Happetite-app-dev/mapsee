import * as Notifications from "expo-notifications";
import { ref, onValue, set, push, remove, off } from "firebase/database";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

import { database } from "../firebase";
const db = database;

/*const fs = require("fs");
const http2 = require("http2");
const jwt = require("jsonwebtoken");

const token = jwt.sign(
  {
    iss: "7UKUS52487",
    iat: Math.round(new Date().getTime() / 1000),
  },
  fs.readFileSync("AuthKey_T2RZXV4XG9.p8", "utf8"),
  {
    header: {
      alg: "ES256",
      kid: "T2RZXV4XG9",
    },
  }
);

const IS_PRODUCTION = false; // TODO: your check
const client = http2.connect(
  IS_PRODUCTION
    ? "https://api.push.apple.com"
    : "https://api.sandbox.push.apple.com"
);
*/
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

    // newly added
    /*

    const deviceToken = expoPushToken;

    const headers = {
      ":method": "POST",
      ":scheme": "https",
      "apns-topic": "mapsee2207031", // TODO: your application bundle ID
      ":path": "/3/device/" + deviceToken,
      authorization: `bearer ${token}`,
    };

    const request = client.request(headers);

    request.setEncoding("utf8");
    request.write(
      JSON.stringify({
        aps: {
          alert: {
            title: title_,
            body: body_,
          },
        },
      })
    );

    request.on("response", (headers, flags) => {
      for (const name in headers) {
        console.log(`${name}: ${headers[name]}`);
      }
    });

    let data = "";
    request.on("data", (chunk) => {
      data += chunk;
    });

    request.on("end", () => {
      console.log(`\n${data}`);
      client.close();
    });

    request.end();*/
  }
};

export default SendPushNotification;
