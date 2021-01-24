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
const database = firebase.database();
const zonesRef = database.ref("zones");
const valuesRef = database.ref("values");


module.exports = function () {

    /*
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
    */


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
     * @param max The max number of people allowed in the zone. Default to 0.
     */
    this.createZone = function(zoneName, successCallback, failureCallback, current=0, max=10){
    // successCallback is optional
    successCallback =  (typeof(successCallback) !== "function") ? function(value){return value} : successCallback;
    // failureCallback is optional
    failureCallback =  (typeof(failureCallback) !== "function") ? function(error){return error} : failureCallback;

    const uuid = uuidv4();
    zonesRef.child(zoneName).set({
        id: uuid,
        name: zoneName,
        current: current,
        max: max,
        enabled: true,
        items: [ ]
    })
        .then(successCallback(uuid))
        .catch(error => failureCallback(error));
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

        zonesRef.child(zoneName).remove()
            .then(function(){
                database.ref("_secrets").child(zoneName).remove()
                    .then(successCallback)
                    .catch(error => failureCallback(error));
            })
            .catch(error => failureCallback(error));
    }


    /**
     * Creates a new sensor within a zone.
     * @param zoneName The zone name.
     * @param sensorName The sensor name.
     * @param periodicity The periodicity of the update. Defaults to 0.
     * @param successCallback A function to handle the complete request with the
     * ID of the created sensor.
     * @param failureCallback A function that is called when the request fails
     * with the error as parameter.
     */
    this.createSensor = function(zoneName, sensorName, periodicity = 0, successCallback, failureCallback){
        // successCallback is optional
        successCallback =  (typeof(successCallback) !== "function") ? function(value){return value} : successCallback;
        // failureCallback is optional
        failureCallback =  (typeof(failureCallback) !== "function") ? function(error){return error} : failureCallback;

        const uuid = uuidv4();
        zonesRef.child(zoneName).child("items").child(sensorName).set({
            id: uuid,
            name: sensorName,
            periodicity: periodicity,
            values: zoneName + '/' + sensorName
        }).then(successCallback(uuid)).catch(error => failureCallback(error));
    }

/*
    //get number of ppl inside
    this.readZone = function (zoneName, oncomplete) {
        firebase.database().ref(zoneName).once('value', oncomplete);
    }
*/
    /**
     * Gets a specific zone object.
     * @param zoneName The zone name.
     * @param successCallback The success callback.
     * @param failureCallback The failure callback.
     */
    this.getZone = function(zoneName, successCallback, failureCallback){
        // failureCallback is optional
        failureCallback =  (typeof(failureCallback) !== "function") ? function(error){return error} : failureCallback;

        zonesRef.once("value")
            .then(dataSnapshot => successCallback(dataSnapshot.toJSON()))
            .catch(error => failureCallback(error));
    }

    //update zone info
    this.updateZone = function (zoneName, fieldId, valor) {
        firebase.database().ref(zoneName).update({
            [fieldId] : valor
        });
    }

    /**
     * Main update function. The other update functions call this one with a
     * pre-defined key.
     * @param zoneName The zone name.
     * @param key The key of the value to update.
     * @param value The value to update.
     * @param successCallback The success callback.
     * @param failureCallback The failure callback.
     */
    this.updateZoneChild = function(zoneName, key, value, successCallback, failureCallback){
        // successCallback is optional
        successCallback =  (typeof(successCallback) !== "function") ? function(value){return value} : successCallback;
        // failureCallback is optional
        failureCallback =  (typeof(failureCallback) !== "function") ? function(error){return error} : failureCallback;

        zonesRef.update({
            [key]: value
        }).then(successCallback).catch(error => failureCallback(error));
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
    this.newSensorValue = function(zoneName, sensorName, value, timestamp, successCallback, failureCallback){
        // successCallback is optional
        successCallback =  (typeof(successCallback) !== "function") ? function(value){return value} : successCallback;
        // failureCallback is optional
        failureCallback =  (typeof(failureCallback) !== "function") ? function(error){return error} : failureCallback;

        valuesRef.child(zoneName).child(sensorName).push({
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

        zonesRef.child("items").child(sensorName).remove().then(successCallback).catch(error => failureCallback(error));
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

        zonesRef.child("items").child(sensorName).update({
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

        zonesRef.child("items").child(sensorName).child("periodicity")
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