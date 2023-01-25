import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { ref, onValue, set, push, remove, off } from "firebase/database";
import { Platform } from "react-native";

import database from "../firebase";
const db = database;
const saveToken = async (token, myUID) => {
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

const GeneratePushToken = (myUID) => {
  // const myContext = useContext(AppContext);
  // const myUID = myContext.myUID;
  // const [expoPushToken, setExpoPushToken] = useState("");
  // const [notification, setNotification] = useState(false);
  // const notificationListener = useRef();
  // const responseListener = useRef();
  registerForPushNotificationsAsync().then((token) => saveToken(token, myUID));
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
      //console.log(token);
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
    //saveToken(token, myUID);

    return token;
  }
};

export default GeneratePushToken;
