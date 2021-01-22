var firebase = require("firebase/app");

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
    this.addZone = function(zoneId) {
        firebase.database().ref(zoneId + '/').set({
            current : 0,
            enabled : 'true',
            items : {
                in : 5,
                out : 2,
                desinfect : 4
            },
            name : 'Leiria Shopping',
            periodicityLeds : 10,
            periodicityDoors : 20,
            max_ppl : 50,
      });
    }

    //get number of ppl inside
    this.readZone = function (zoneId, callback) {
        firebase.database().ref(zoneId).once('value', callback);
    }

    //update zone info
    this.updateZone = function (zoneId, fieldId, valor) {
        firebase.database().ref(zoneId + '/').update({
            [fieldId] : valor
        });
    }
}



/*
    //get number of ppl inside
    this.updateZone = function (zoneId, child) {
        firebase.database().ref(zoneId + '/' + child).once('value', (snapshot) => {
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