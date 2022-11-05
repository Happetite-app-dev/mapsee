// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, push, remove, off } from 'firebase/database';
import {getAuth, createUserWithEmailAndPassword} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDBq4tZ1QLm1R7iPH8O4dTvebVGWgkRPks",
    authDomain: "mapseedemo1.firebaseapp.com",
    projectId: "mapseedemo1",
    storageBucket: "mapseedemo1.appspot.com",
    messagingSenderId: "839335870793",
    appId: "1:839335870793:web:75004c5d43270610411a98",
    measurementId: "G-8L1MD1CGN2"
  };
  
// Initialize Firebase
// let app;
// if(firebase.apps.length===0){
//     app=firebase.initializeApp(firebaseConfig);
// }
// else{
//     app=firebase.app()
// }

// const auth =firebase.auth()
// export {auth};
const app= initializeApp(firebaseConfig);
export const auth=getAuth(app)