import { set, ref } from "@firebase/database"
import { database } from '../firebase'
const db = database;
//서로가 서로의 UID를 relatedUIDs에 넣음
const AddRelatedUID = (UID1, UID2) => {
    const reference1 = ref(db, `/users/${UID1}/relatedUIDs/${UID2}`)
    set(reference1, true)
    const reference2 = ref(db, `/users/${UID2}/relatedUIDs/${UID1}`)
    set(reference2, true)
}

export default AddRelatedUID