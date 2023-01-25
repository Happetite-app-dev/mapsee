// uid주면 나머지 정보 뱉어내는 것
// myUID,
// myID,
// myFirstName,
// myLastName,

import { onValue, ref } from "@firebase/database";

import database from "../firebase";
const db = database;
// 친구인 사람들은 모두 한 번에 uid 정리
// 아닌 사람들은

// uid object를 만든다.
// uid object 만들어주는 모듈, uid주면 나머지 데리고 오는 모듈 하나
export const fetchUserObject = ({ userObject, setUserObject, userID }) => {
  if (!userObject[userID]) {
    onValue(ref(db, `/users/${userID}`), (snapshot) => {
      if (snapshot.val()) {
        setUserObject((prev) => ({
          ...prev,
          [userID]: {
            id: snapshot.child("id"),
            lastName: snapshot.child("lastName"),
            firstName: snapshot.child("firstName"),
          },
        }));
      }
    });
  }
  return userObject[userID];
};

export const fetchFolderObject = ({
  folderObject,
  setFolderObject,
  folderID,
  userID,
}) => {
  if (!folderObject[folderID]) {
    onValue(ref(db, `/folders/${folderID}/userIDs/`), (snapshot) => {
      const folderUserIDs = snapshot.val() ? Object.keys(snapshot.val()) : [];
      onValue(
        ref(db, `/folders/${folderID}/userIDs/${userID}`),
        (snapshot1) => {
          if (!snapshot1.val()) {
            setFolderObject((prev) => ({
              ...prev,
              [folderID]: {
                folderName: "",
                folderColor: "",
                folderUserIDs,
              },
            }));
          } else {
            onValue(
              ref(db, `/folders/${folderID}/folderName/${userID}`),
              (snapshot1) => {
                const folderName = snapshot1.val();
                onValue(
                  ref(db, `/folders/${folderID}/folderColor/${userID}`),
                  (snapshot2) => {
                    const folderColor = snapshot2.val();
                    setFolderObject((prev) => ({
                      ...prev,
                      [folderID]: {
                        folderName,
                        folderColor,
                        folderUserIDs,
                      },
                    }));
                  }
                );
              }
            );
          }
        }
      );
    });
  }
  return folderObject[folderID];
};

//folderInviteCard에서만 사용
export const fetchInitFolderObject = ({
  folderObject,
  setFolderObject,
  folderID,
}) => {
  if (!folderObject[folderID]) {
    onValue(ref(db, `/folders/${folderID}/userIDs/`), (snapshot) => {
      const folderUserIDs = snapshot.val() ? Object.keys(snapshot.val()) : [];
      onValue(ref(db, `/folders/${folderID}/initFolderName`), (snapshot2) => {
        const folderName = snapshot2.val() ? snapshot2.val() : "";
        onValue(
          ref(db, `/folders/${folderID}/initFolderColor`),
          (snapshot3) => {
            const folderColor = snapshot3.val() ? snapshot3.val() : "";
            setFolderObject((prev) => ({
              ...prev,
              [folderID]: {
                folderName,
                folderColor,
                folderUserIDs,
              },
            }));
          }
        );
      });
    });
  }
  return folderObject[folderID];
};
