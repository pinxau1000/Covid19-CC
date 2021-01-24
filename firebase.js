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
const zonesRef = database.ref("zones");
const valuesRef = database.ref("values");

/**
 * @see https://stackoverflow.com/a/2117523/14643807
 */
function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
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
 * @param max The max number of people allowed in the zone. Default to 0.
 */
const createZone = function(zoneName, successCallback, failureCallback, current=0, max=0){
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
 * Gets a specific zone object.
 * @param zoneName The zone name.
 * @param successCallback The success callback.
 * @param failureCallback The failure callback.
 */
const getZone = function(zoneName, successCallback, failureCallback){
    // failureCallback is optional
    failureCallback =  (typeof(failureCallback) !== "function") ? function(error){return error} : failureCallback;

    zonesRef.child(zoneName).once("value")
        .then(dataSnapshot => successCallback(dataSnapshot.toJSON()))
        .catch(error => failureCallback(error));
}

/**
 * Gets the zones on the database.
 * @see https://firebase.google.com/docs/reference/node/firebase.database.Reference#once
 * @param successCallback A function that is called when the request succeeds
 * with the passed as a JSON parameter.
 * @param failureCallback A function that is called when the request fails
 * with the error as parameter.
 */
const getAllZones = function(successCallback, failureCallback) {
    // failureCallback is optional
    failureCallback =  (typeof(failureCallback) !== "function") ? function(error){return error} : failureCallback;

    zonesRef.once("value")
        .then(dataSnapshot => successCallback(dataSnapshot.toJSON()))
        .catch(error => failureCallback(error));
}

/**
 * Listening for changes in zones.
 * @param successCallback The success callback.
 * @param failureCallback The failure callback.
 */
const listeningAllZones = function (successCallback, failureCallback) {
    // failureCallback is optional
    failureCallback =  (typeof(failureCallback) !== "function") ? function(error){return error} : failureCallback;

    zonesRef.on("value",dataSnapshot => successCallback(dataSnapshot.toJSON()), failureCallback);
}

/**
 * Deletes a zone.
 * @param zoneName The zone name.
 * @param successCallback The success callback.
 * @param failureCallback The failure callback.
 */
const deleteZone = function(zoneName, successCallback, failureCallback){
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
const createSensor = function(zoneName, sensorName, periodicity = 0, successCallback, failureCallback){
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

/**
 * Gets a specific sensor object.
 * @param zoneName The zone name.
 * @param sensorName The sensor name.
 * @param successCallback The success callback.
 * @param failureCallback The failure callback.
 */
const getSensor = function(zoneName, sensorName, successCallback, failureCallback){
    // failureCallback is optional
    failureCallback =  (typeof(failureCallback) !== "function") ? function(error){return error} : failureCallback;

    zonesRef.child(zoneName).child("items").child(sensorName).once("value")
        .then(dataSnapshot => successCallback(dataSnapshot.toJSON()))
        .catch(error => failureCallback(error));
}


/**
 * Gets all sensors of a zone.
 * @param zoneName The zone name.
 * @param successCallback The success callback.
 * @param failureCallback The failure callback.
 */
const getAllSensors = function(zoneName, successCallback, failureCallback){
    // failureCallback is optional
    failureCallback =  (typeof(failureCallback) !== "function") ? function(error){return error} : failureCallback;

    zonesRef.child(zoneName).child("items").once("value")
        .then(dataSnapshot => successCallback(dataSnapshot.toJSON()))
        .catch(error => failureCallback(error));
}

/**
 * Deletes a sensor.
 * @param zoneName The zone name.
 * @param sensorName The sensor name.
 * @param successCallback The success callback.
 * @param failureCallback The failure callback.
 */
const deleteSensor = function(zoneName, sensorName, successCallback, failureCallback){
    // successCallback is optional
    successCallback =  (typeof(successCallback) !== "function") ? function(value){return value} : successCallback;
    // failureCallback is optional
    failureCallback =  (typeof(failureCallback) !== "function") ? function(error){return error} : failureCallback;

    zonesRef.child(zoneName).child("items").child(sensorName).remove().then(successCallback).catch(error => failureCallback(error));
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
const newSensorValueNow = function(zoneName, sensorName, value, successCallback, failureCallback){
    newSensorValue(zoneName, sensorName, value, Date.now(), successCallback, failureCallback)
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
const updateZoneChild = function(zoneName, key, value, successCallback, failureCallback){
    // successCallback is optional
    successCallback =  (typeof(successCallback) !== "function") ? function(value){return value} : successCallback;
    // failureCallback is optional
    failureCallback =  (typeof(failureCallback) !== "function") ? function(error){return error} : failureCallback;

    zonesRef.child(zoneName).update({
        [key]: value
    }).then(successCallback).catch(error => failureCallback(error));
}

/**
 * Updates multiple values based on the JSON object passed.
 * @param zoneName The zone name.
 * @param object The JSON object to update.
 * @param successCallback The success callback.
 * @param failureCallback The failure callback.
 */
const updateZoneChilds = function(zoneName, object, successCallback, failureCallback){
    // successCallback is optional
    successCallback =  (typeof(successCallback) !== "function") ? function(value){return value} : successCallback;
    // failureCallback is optional
    failureCallback =  (typeof(failureCallback) !== "function") ? function(error){return error} : failureCallback;

    zonesRef.child(zoneName).update(object).then(successCallback).catch(error => failureCallback(error));
}

/**
 * Get main function. The other get functions use this one with a
 * pre-defined key.
 * @param zoneName The zone name.
 * @param key The key of the value to update.
 * @param successCallback The success callback.
 * @param failureCallback The failure callback.
 */
const getZoneChild = function(zoneName, key, successCallback, failureCallback){
    // failureCallback is optional
    failureCallback =  (typeof(failureCallback) !== "function") ? function(error){return error} : failureCallback;

    zonesRef.child(zoneName).child(key).once("value")
        .then(dataSnapshot => successCallback(dataSnapshot.toJSON()))
        .catch(error => failureCallback(error));
}

const getName = function(zoneName, successCallback, failureCallback){
    getZoneChild(zoneName, "name", successCallback, failureCallback);
}

const getCurrent = function(zoneName, successCallback, failureCallback){
    getZoneChild(zoneName, "current", successCallback, failureCallback);
}

const updateCurrent = function(zoneName, value, successCallback, failureCallback){
    updateZoneChild(zoneName, "current", value, successCallback, failureCallback);
}

const getMax = function(zoneName, successCallback, failureCallback){
    getZoneChild(zoneName, "max", successCallback, failureCallback);
}

const updateMax = function(zoneName, value, successCallback, failureCallback){
    updateZoneChild(zoneName, "max", value, successCallback, failureCallback);
}

const getEnabled = function(zoneName, successCallback, failureCallback){
    getZoneChild(zoneName, "enabled", successCallback, failureCallback);
}

const updateEnabled = function(zoneName, value, successCallback, failureCallback){
    updateZoneChild(zoneName, "enabled", value, successCallback, failureCallback);
}

const listeningEnabled = function(zoneName, successCallback, failureCallback){
    // failureCallback is optional
    failureCallback =  (typeof(failureCallback) !== "function") ? function(error){return error} : failureCallback;

    zonesRef.child(zoneName).child("enabled")
        .on("value",dataSnapshot => successCallback(dataSnapshot.toJSON()), failureCallback);
}

/**
 * Gets the current value of the periodicity of a sensor.
 * @param zoneName The zone name.
 * @param sensorName The sensor name.
 * @param successCallback The success callback.
 * @param failureCallback The failure callback.
 */
const getPeriodicitySensor = function(zoneName, sensorName, successCallback, failureCallback){
    // failureCallback is optional
    failureCallback =  (typeof(failureCallback) !== "function") ? function(error){return error} : failureCallback;

    zonesRef.child(zoneName).child("items").child(sensorName).child("periodicity").once("value")
        .then(dataSnapshot => successCallback(dataSnapshot.toJSON()))
        .catch(error => failureCallback(error));
}

/**
 * Updated the periodicity of a sensor.
 * @param zoneName The zone name.
 * @param sensorName The sensor name.
 * @param periodicity The new periodicity value.
 * @param successCallback The success callback.
 * @param failureCallback The failure callback.
 */
const updatePeriodicitySensor = function(zoneName, sensorName, periodicity, successCallback, failureCallback){
    // successCallback is optional
    successCallback =  (typeof(successCallback) !== "function") ? function(value){return value} : successCallback;
    // failureCallback is optional
    failureCallback =  (typeof(failureCallback) !== "function") ? function(error){return error} : failureCallback;

    zonesRef.child(zoneName).child("items").child(sensorName).update({
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
const listeningPeriodicity = function(zoneName, sensorName, successCallback, failureCallback) {
    // failureCallback is optional
    failureCallback = (typeof (failureCallback) !== "function") ? function (error) {
        return error
    } : failureCallback;

    zonesRef.child(zoneName).child("items").child(sensorName).child("periodicity")
        .on("value", dataSnapshot => successCallback(dataSnapshot.toJSON()), failureCallback);
}

/**
 * Retrieves the last N acquired values in a given sensor.
 * @param zoneName The zone name.
 * @param sensorName The sensor name.
 * @param successCallback The success callback.
 * @param failureCallback The failure callback.
 */
const getLastValues = function(zoneName, sensorName, nLastValues, successCallback, failureCallback){
    // failureCallback is optional
    failureCallback =  (typeof(failureCallback) !== "function") ? function(error){return error} : failureCallback;

    let lastValuesRef = valuesRef.child(zoneName).child(sensorName).limitToLast(nLastValues);
    lastValuesRef.once("value")
        .then(dataSnapshot => successCallback(dataSnapshot.toJSON()))
        .catch(error => failureCallback(error));
}


/**
 * Retrieves the first N acquired values in a given sensor.
 * @param zoneName The zone name.
 * @param sensorName The sensor name.
 * @param successCallback The success callback.
 * @param failureCallback The failure callback.
 */
const getFirstValues = function(zoneName, sensorName, nFirstValues, successCallback, failureCallback){
    // failureCallback is optional
    failureCallback =  (typeof(failureCallback) !== "function") ? function(error){return error} : failureCallback;

    let firstValuesRef = valuesRef.child(zoneName).child(sensorName).limitToFirst(nFirstValues);
    firstValuesRef.once("value")
        .then(dataSnapshot => successCallback(dataSnapshot.toJSON()))
        .catch(error => failureCallback(error));
}

/**
 * Retrieves the values between startInstant and endInstant for a given sensor.
 * @param zoneName The zone name.
 * @param sensorName The sensor name.
 * @param successCallback The success callback.
 * @param failureCallback The failure callback.
 */
const getRangeValuesTimestamp = function(zoneName, sensorName, startTimestamp, endTimestamp, successCallback, failureCallback){
    // failureCallback is optional
    failureCallback =  (typeof(failureCallback) !== "function") ? function(error){return error} : failureCallback;

    let ref = valuesRef.child(zoneName).child(sensorName).orderByChild("timestamp")
        .startAt(startTimestamp).endAt(endTimestamp);

    ref.once("value")
        .then(dataSnapshot => successCallback(dataSnapshot.toJSON()))
        .catch(error => failureCallback(error));
}

/**
 * Retrieves the last update instant for a given sensor. Meant to be used by
 * the edge device to update periodically.
 * @param zoneName The zone name.
 * @param sensorName The sensor name.
 * @param successCallback The success callback.
 * @param failureCallback The failure callback.
 */
const getSensorLastUpdate = function(zoneName, sensorName, successCallback, failureCallback){
    // failureCallback is optional
    failureCallback =  (typeof(failureCallback) !== "function") ? function(error){return error} : failureCallback;

    const ref = valuesRef.child(zoneName).child(sensorName).limitToLast(1);

    ref.once("value")
        .then(function(dataSnapshot){
            let dataJSON = dataSnapshot.toJSON();
            successCallback(dataJSON[Object.keys(dataJSON)[0]].timestamp)
        })
        .catch(error => failureCallback(error));
}

const incrementCurrent = function(zoneName, N, successCallback, failureCallback){
    // failureCallback is optional
    failureCallback =  (typeof(failureCallback) !== "function") ? function(error){return error} : failureCallback;

    zonesRef.child(zoneName).child("current")
        .transaction(function(current_value){
            return current_value+N
        })
        .then(result => successCallback(result))
        .catch(error => failureCallback(error));
}


/* FIXME INITIALIZATION
createZone("Cozinha");
createSensor("Cozinha", "Temperatura");
createSensor("Cozinha", "Humidade");
createSensor("Cozinha", "Entradas");
createSensor("Cozinha", "Saídas");

createZone("Wall Entrada");
createSensor("Wall Entrada", "Entradas");
createSensor("Wall Entrada", "Saídas");
createSensor("Wall Entrada", "Desinfetante");

createZone("Sala");
createSensor("Sala", "Luminosidade");
createSensor("Sala", "Temperatura");

createZone("Quarto");
createSensor("Quarto", "Luminosidade");
createSensor("Quarto", "Temperatura");
 */


function emulateValueAcquisition(){
    newSensorValueNow("Cozinha", "Temperatura", Math.random());
    newSensorValueNow("Cozinha", "Humidade", Math.random());
    newSensorValueNow("Cozinha", "Entradas", Math.random());
    newSensorValueNow("Cozinha", "Saídas", Math.random());

    newSensorValueNow("Wall Entrada", "Entradas", Math.random());
    newSensorValueNow("Wall Entrada", "Saídas", Math.random());
    newSensorValueNow("Wall Entrada", "Desinfetante", Math.random());
    newSensorValueNow("Cozinha", "Saídas", Math.random());

    newSensorValueNow("Sala", "Luminosidade", Math.random());
    newSensorValueNow("Sala", "Temperatura", Math.random());

    newSensorValueNow("Quarto", "Luminosidade", Math.random());

    setTimeout(emulateValueAcquisition, Math.round(Math.random()*10000));
}

emulateValueAcquisition();



// Initialize and Export Firebase
export {
    database,
    // Zones
    createZone,
    getZone,
    getAllZones,
    deleteZone,

    // Sensors
    createSensor,
    getSensor,
    getAllSensors,
    deleteSensor,
    getSensorLastUpdate,        // Gets the last timestamp of a sensor update
    newSensorValue,             // Pushes a new value with a given timestamp
    newSensorValueNow,          // Pushes a new value with the current timestamp
    updatePeriodicitySensor,    // Sets a new value on periodicity
    getPeriodicitySensor,       // Gets periodicity value of a sensor

    // Update and Gets for global zone properties
    updateZoneChild,
    getZoneChild,
    getName,
    updateCurrent,
    getCurrent,
    updateMax,
    getMax,
    updateEnabled,
    getEnabled,
    incrementCurrent,       // Increment/Decrement Current Value by N units
    updateZoneChilds, // Updates multiple values at once using JSON syntax.

    // Filter Sensor Values
    getFirstValues,         // Gets the first values pushed to the sensor
    getLastValues,          // Gets the last values pushed to the sensor
    getRangeValuesTimestamp,// Gets the values between two timestamps

    // listening
    listeningAllZones,
    listeningEnabled,
    listeningPeriodicity
}
