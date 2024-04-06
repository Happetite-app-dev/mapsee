/*import messaging from "@react-native-firebase/messaging";
import { ref, onValue, set, push, remove, off } from "firebase/database";

import { database } from "../firebase";
const db = database;

export async function requestNotificationPermission(myUID) {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log("Authorization status:", authStatus);
  }

  const token = await messaging().getToken();
  console.log("token", token);
  //console.log("myUID", myUID);
  const reference5 = ref(db, `users/${myUID}/pushTokenFirebase`); //user에 folderID를 넣고
  set(reference5, token)
    .then(() => console.log("saved to database"))
    .catch((error) => console.log(error));
}
*/
