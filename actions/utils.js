import { onValue } from "firebase/database";

export const onValueAsync = (query) =>
  new Promise((resolve, reject) => {
    onValue(
      query,
      (snapshot) => {
        console.log("snapshot", snapshot);
        resolve(snapshot.val());
      },
      (error) => reject(error)
    );
  });
