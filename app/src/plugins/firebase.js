// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import firebase from "firebase/app";

// Add the Firebase services that you want to use
import "firebase/database";
import "firebase/auth";

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

firebase.initializeApp(firebaseConfig)

// Get a reference to the database service
const database = firebase.database();

function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

/**
 * https://firebase.google.com/docs/reference/node/firebase.database.Reference#once
 * @param successCallback
 * @param failureCallback
 */
const acquireZones = function(successCallback, failureCallback) {
    database.ref().once("value").then(
        function(dataSnapshot){
            successCallback(dataSnapshot.toJSON());
        }
    ).catch(error => failureCallback(error));
}

/**
 * https://firebase.google.com/docs/reference/node/firebase.database.Reference#set
 * For testing purposes the ID is random and must be defined on the
 * initialization of each zone. In real life situation we suggest using a
 * unique identifier (hardcoded string, MAC Address, etc) for each zone
 * hardcoded to the edge device responsible for the capture (sensor, esp32,
 * rasp, etc...).
 * @param name
 * @param current
 * @param total
 * @param successCallback function to execute when the set is completed with
 * success. The zone UUID is passed as parameter of this function.
 * @param failureCallback
 */
const createZone = function(name, current, total, successCallback, failureCallback){
    let uuid = uuidv4();
    database.ref(uuid).set({
        id: uuid,
        name: name,
        current: current,
        total: total,
        periodicityDoors: 0,
        periodicityLeds: 0,
        enabled: true,
        items: []
    }).then(successCallback(uuid)).catch(error => failureCallback(error));
}

// createZone("Casa", 0, 6, function (uuid){console.log(uuid)}, function (){})

// Initialize and Export Firebase
export {database, acquireZones, createZone}