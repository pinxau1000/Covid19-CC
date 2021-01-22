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

/**
 * @see https://stackoverflow.com/a/2117523/14643807
 */
function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

/**
 * Gets the zones on the database.
 * @see https://firebase.google.com/docs/reference/node/firebase.database.Reference#once
 * @param successCallback A function that is called when the request succeeds
 * with the passed as a JSON parameter.
 * @param failureCallback A function that is called when the request fails
 * with the error as parameter.
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
 *
 * createZone("test", 0, 5, function (uuid){
 *      console.log(uuid)
 *  }, function (error){
 *      console.err(error)
 *  });
 *
 * @param zoneName The zone name.
 * @param successCallback function to execute when the set is completed with
 * success. The zone UUID is passed as parameter of this function.
 * @param failureCallback A function that is called when the request fails
 * with the error as parameter.
 * @param current The current number of people in the zone. Default to 0.
 * @param total The total number of people allowed in the zone. Default to 0.
 */
const createZone = function(zoneName, successCallback, failureCallback, current=0, total=0){
    const uuid = uuidv4();
    database.ref(zoneName).set({
        id: uuid,
        name: zoneName,
        current: current,
        total: total,
        periodicityDoors: 0,
        periodicityLeds: 0,
        enabled: true,
        items: []
    }).then(successCallback(uuid)).catch(error => failureCallback(error));
}
/**
 * Creates a new sensor within a zone.
 * @param zoneName The zone name.
 * @param sensorName The sensor name.
 * @param successCallback A function to handle the complete request with the
 * ID of the created sensor.
 * @param failureCallback A function that is called when the request fails
 * with the error as parameter.
 */
const createSensor = function(zoneName, sensorName, successCallback, failureCallback){
    const uuid = uuidv4();
    database.ref(zoneName).child("items").child(sensorName).set({
        id: uuid,
        name: sensorName,
        values: []
    }).then(successCallback({uuid})).catch(error => failureCallback(error));
}

/**
 * Adds a sensor value acquired at a given timestamp to the array.
 * @param zoneName The zone name.
 * @param sensorName The sensor name.
 * @param value The new acquired value.
 * @param timestamp The timestamp when the entry has registered.
 * @param successCallback A function to handle the complete request with the
 * reference key of the created entry.
 * @param failureCallback A function that is called when push fails with the
 * error as parameter.
 */
const newSensorValue = function(zoneName, sensorName, value, timestamp, successCallback, failureCallback){
    const pushRef = database.ref(zoneName).child("items").child(sensorName).child("values").push({
        value: value,
        timestamp: timestamp
    }).then(function(){
        successCallback(pushRef.key);
    }).catch(error => failureCallback(error));
}

/**
 * Adds a newly acquired sensor value to the array.
 * @param zoneName The zone name.
 * @param sensorName The sensor name.
 * @param value The new acquired value.
 * @param successCallback A function to handle the complete request with the
 * reference key of the created entry.
 * @param failureCallback A function that is called when push fails with the
 * error as parameter.
 */
const newSensorValueNow = function(zoneName, sensorName, value, successCallback, failureCallback){
    newSensorValue(zoneName, sensorName, value, Date.now(), successCallback, failureCallback)
}


// Initialize and Export Firebase
export {
    database,
    acquireZones,
    createZone,
    createSensor,
    newSensorValue,
    newSensorValueNow
}