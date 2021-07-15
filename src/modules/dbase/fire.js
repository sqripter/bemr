// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/app";
// If you are using v7 or any earlier version of the JS SDK, you should import firebase using namespace import
// import * as firebase from "firebase/app"

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
//import "firebase/analytics";

// Add the Firebase products that you want to use
//import "firebase/auth";
import "firebase/firestore";
//import "firebase/storage"
//import "firebase/database"

// example code
// https://github.com/firebase/quickstart-js/blob/master/database/scripts/main.js

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAvnUE0W1xa3jUvU4SzfzE5l2Gg5Su1avw",
    authDomain: "bemr-test.firebaseapp.com",
    projectId: "bemr-test",
    storageBucket: "bemr-test.appspot.com",
    messagingSenderId: "635503095305",
    appId: "1:635503095305:web:2ff7f5fdb907fec82e92d8",
    databaseURL: "https://bemr-test-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "bemr-test",

};
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
firebase.firestore().enablePersistence()
  .catch((err) => {
      if (err.code == 'failed-precondition') {
          // Multiple tabs open, persistence can only be enabled
          // in one tab at a a time.
          // ...
      } else if (err.code == 'unimplemented') {
          // The current browser does not support all of the
          // features required to enable persistence
          // ...
      }
  });

let __firedb = undefined;
//firebase.firestore();

export function firedb(){

    return firebase.firestore()
}


