var firebase = require("firebase/app");
const { v4: uuidv4 } = require('uuid');

// Add the Firebase products that you want to use
require("firebase/functions"); // ?????????????????
require("firebase/database");


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: "AIzaSyDHfKSAV_fvF0CYbG21MLYbITUwVFFzTuc",
  authDomain: "meecad-covid19-cc.firebaseapp.com",
  databaseURL: "https://meecad-covid19-cc-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "meecad-covid19-cc",
  storageBucket: "meecad-covid19-cc.appspot.com",
  messagingSenderId: "137392691616",
  appId: "1:137392691616:web:8674eceb7ccd257d676cc5",
  measurementId: "G-G3ZWMGJLS2"
};
firebase.initializeApp(firebaseConfig);

// Get a reference to the database service
var database = firebase.database();


module.exports = function () {
    //adds new zone
    this.createZone = function(zoneName, current=0, max=10) {
        const uuid = uuidv4();
        firebase.database().ref(zoneName).set({
            id: uuid,
            name: zoneName,
            current: current,
            max: max,
            enabled: true,
            items: []
      });
    }


    /**
     * Deletes a zone.
     * @param zoneName The zone name.
     * @param successCallback The success callback.
     * @param failureCallback The failure callback.
     */
    this.deleteZone = function(zoneName, successCallback, failureCallback){
        // successCallback is optional
        successCallback =  (typeof(successCallback) !== "function") ? function(value){return value} : successCallback;
        // failureCallback is optional
        failureCallback =  (typeof(failureCallback) !== "function") ? function(error){return error} : failureCallback;

        database.ref(zoneName).remove().then(successCallback).catch(error => failureCallback(error));
    }


    //creates new sensor
    this.createSensor = function(zoneName, sensorName, periodicity = 5, successCallback, failureCallback){
        // successCallback is optional
        successCallback =  (typeof(successCallback) !== "function") ? function(value){return value} : successCallback;
        // failureCallback is optional
        failureCallback =  (typeof(failureCallback) !== "function") ? function(error){return error} : failureCallback;

        const uuid = uuidv4();
        firebase.database().ref(zoneName).child("items").child(sensorName).set({
            id: uuid,
            name: sensorName,
            periodicity: periodicity,
            values: []
        }).then(successCallback(uuid)).catch(error => failureCallback(error));
    }

    //get number of ppl inside
    this.readZone = function (zoneName, oncomplete) {
        firebase.database().ref(zoneName).once('value', oncomplete);
    }

    //update zone info
    this.updateZone = function (zoneName, fieldId, valor) {
        firebase.database().ref(zoneName).update({
            [fieldId] : valor
        });
    }

    this.increment = function (zoneName, valor) {
        firebase.database().ref(zoneName).update({
            current : valor
        });
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
    newSensorValue = function(zoneName, sensorName, value, timestamp, successCallback, failureCallback){
        // successCallback is optional
        successCallback =  (typeof(successCallback) !== "function") ? function(value){return value} : successCallback;
        // failureCallback is optional
        failureCallback =  (typeof(failureCallback) !== "function") ? function(error){return error} : failureCallback;
        database.ref(zoneName).child("items").child(sensorName).child("values").push({
            value: value,
            timestamp: timestamp
        }).then(ret => successCallback(ret.key)).catch(error => failureCallback(error));
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
    this.newSensorValueNow = function(zoneName, sensorName, value, successCallback, failureCallback){
      newSensorValue(zoneName, sensorName, value, Date.now(), successCallback, failureCallback)
    }


    /**
     * Deletes a sensor.
     * @param zoneName The zone name.
     * @param sensorName The sensor name.
     * @param successCallback The success callback.
     * @param failureCallback The failure callback.
     */
    this.deleteSensor = function(zoneName, sensorName, successCallback, failureCallback){
        // successCallback is optional
        successCallback =  (typeof(successCallback) !== "function") ? function(value){return value} : successCallback;
        // failureCallback is optional
        failureCallback =  (typeof(failureCallback) !== "function") ? function(error){return error} : failureCallback;

        database.ref(zoneName).child("items").child(sensorName).remove().then(successCallback).catch(error => failureCallback(error));
    }


    /**
     * Updated the periodicity of a sensor.
     * @param zoneName The zone name.
     * @param sensorName The sensor name.
     * @param periodicity The new periodicity value.
     * @param successCallback The success callback.
     * @param failureCallback The failure callback.
     */
    this.updatePeriodicitySensor = function(zoneName, sensorName, periodicity, successCallback, failureCallback){
        // successCallback is optional
        successCallback =  (typeof(successCallback) !== "function") ? function(value){return value} : successCallback;
        // failureCallback is optional
        failureCallback =  (typeof(failureCallback) !== "function") ? function(error){return error} : failureCallback;

        database.ref(zoneName).child("items").child(sensorName).update({
            "periodicity": periodicity
        }).then(successCallback).catch(error => failureCallback(error));
    }

    /**
     * Runs callback whenever periodicity changed.
     * @param zoneName The zone name.
     * @param sensorName The sensor name.
     * @param successCallback The success callback.
     * @param failureCallback The failure callback.
     */
    this.listeningPeriodicity = function(zoneName, sensorName, successCallback, failureCallback) {
        // failureCallback is optional
        failureCallback = (typeof (failureCallback) !== "function") ? function (error) {
            return error
        } : failureCallback;

        database.ref(zoneName).child("items").child(sensorName).child("periodicity")
            .on("value", dataSnapshot => successCallback(dataSnapshot.toJSON()), failureCallback);
    }

}



/*
    //get number of ppl inside
    this.updateZone = function (zoneName, child) {
        firebase.database().ref(zoneName + '/' + child).once('value', (snapshot) => {
            const data = snapshot.val();
            console.log(data);
            //return data;
        });
        return "test";
    }

var starCountRef = firebase.database().ref('posts/' + postId + '/starCount');
starCountRef.on('value', (snapshot) => {
  const data = snapshot.val();
  updateStarCount(postElement, data);
});
*/