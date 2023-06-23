import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { ref, onValue, set, push, remove, off } from "firebase/database";
import { Platform, Alert } from "react-native";

import { database } from "../firebase";
const db = database;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const GeneratePushToken = (myUID) => {
  // const myContext = useContext(AppContext);
  // const myUID = myContext.myUID;
  // const [expoPushToken, setExpoPushToken] = useState("");
  // const [notification, setNotification] = useState(false);
  // const notificationListener = useRef();
  // const responseListener = useRef();
  registerForPushNotificationsAsync().then((token) => {
    //console.log("token", token);
    //console.log("myUID", myUID);
    const reference1 = ref(db, "/users/" + myUID + "/pushToken");
    const reference5 = ref(db, `users/${myUID}/pushToken`); //user에 folderID를 넣고
    console.log(`users/${myUID}/pushToken`, token);
    set(reference5, token)
      .then(() => console.log("saved to database"))
      .catch((error) => console.log(error));
  });
  // useEffect(() => {
  //   //expoPushToken에 token 저장
  //   registerForPushNotificationsAsync().then((token) =>
  //     setExpoPushToken(token)
  //   );

  //   // This listener is fired whenever a notification is received while the app is foregrounded
  //   notificationListener.current =
  //     Notifications.addNotificationReceivedListener((notification) => {
  //       setNotification(notification);
  //     });

  //   // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
  //   responseListener.current =
  //     Notifications.addNotificationResponseReceivedListener((response) => {
  //       console.log(response);
  //     });

  //   return () => {
  //     Notifications.removeNotificationSubscription(
  //       notificationListener.current
  //     );
  //     Notifications.removeNotificationSubscription(responseListener.current);
  //   };
  // }, []);

  //token을 device에서 갖고옴.
  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      console.log("push notification");
      console.log("existingStatus", existingStatus);
      if (existingStatus !== "granted") {
        //useState를 만들어서 existingStatus가 "granted"가 아니라면, 나중에 saveToken할 때 sendPushNotification을 스스로한테 해주기
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
        console.log("status", status);
      }
      if (finalStatus !== "granted") {
        // Alert.alert("알림을 거절하셨습니다. 앱 내부 알림이 가지 않을 수 있습니다.");
        return;
      }
      console.log("before token");
      token = (await Notifications.getExpoPushTokenAsync()).data;
      //console.log("token in async func", token);
    } else {
      Alert.alert(
        "알림",
        "알림을 받기 위해서는 실제 기기에서 앱을 실행해주세요."
      );
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
      });
    }

    //myUID에 token을 새롭게 저장.-->계정이 로그인된 가장 최근 기기에 push 알림이 오는것이 자연스럽다!
    //saveToken(token, myUID);

    return token;
  }
};

export default GeneratePushToken;
