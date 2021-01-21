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
    this.addZone = function(zoneId, name, maxppl) {
        firebase.database().ref(zoneId + '/').set({
            current : 51,
            enabled : 'true',
            items : {
                Entradas : 5,
                Saídas : 2,
                Desinfecções : 4
            },
            name : 'Leiria Shopping',
            periodicityLeds : 10,
            periodicityDoors : 20,
            max_ppl : 50,
            button_state: maxppl
      });
    }
    //get number of ppl inside
    this.updateZone = function (zoneId, child) {
        firebase.database().ref(zoneId + '/' + child).once('value', (snapshot) => {
            const data = snapshot.val();
            console.log(data);
            //return data;
        });
        return "test";
    }

    this.readZone = function (zoneId, callback) {
        firebase.database().ref(zoneId).once('value', callback);
    }

}


//console.log(module.exports);


/*
var starCountRef = firebase.database().ref('posts/' + postId + '/starCount');
starCountRef.on('value', (snapshot) => {
  const data = snapshot.val();
  updateStarCount(postElement, data);
});
*/