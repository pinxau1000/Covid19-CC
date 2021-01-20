// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import firebase from "firebase/app";

// Add the Firebase services that you want to use
import "firebase/database";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDHfKSAV_fvF0CYbG21MLYbITUwVFFzTuc",
    authDomain: "meecad-covid19-cc.firebaseapp.com",
    databaseURL: "https://meecad-covid19-cc-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "meecad-covid19-cc",
    storageBucket: "meecad-covid19-cc.appspot.com",
    messagingSenderId: "137392691616",
    appId: "1:137392691616:web:8674eceb7ccd257d676cc5",
    measurementId: "G-G3ZWMGJLS2"
  };

// Initialize and Export Firebase
export default firebase.initializeApp(firebaseConfig);
