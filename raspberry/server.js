// Load the http module to create an http server.
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http) //require socket.io module and pass the http object

//const fs = require('fs'); //require filesystem to read html files
const Gpio = require('onoff').Gpio; //require onoff to control GPIO
const port = 8080;
//const admin = require('firebase-admin');
const LED = new Gpio(4, 'out');  //declare GPIO4 an output

var firebase = require("firebase/app");

// Add the Firebase products that you want to use
require("firebase/functions"); // ?????????????????
require("firebase/database");


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


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

function writeUserData(userId, name, email, imageUrl) {
  firebase.database().ref('users/' + userId).set({
    username: name,
    email: email,
    profile_picture : imageUrl
  });
}

// server.on('connection', socket => {
//   console.log('New connection')
// });

// Listen on port 8080
http.listen(port, function (error) {
  if (error) {
    console.log('Something went wrong', error);
  }else {
    console.log('Server is listening on port ' + port);
  }
});


io.on('connection', function (socket) {// WebSocket Connection
  var buttonState = 0; //variable to store button state

  socket.on('state', function (data) { //get button state from client
    buttonState = data;
    if (buttonState != LED.readSync()) { //Change LED state if button state is changed
      LED.writeSync(buttonState); //turn LED on or off
      writeUserData('test_id', 'test_name', 'test_email', buttonState);
      console.log(buttonState);
    }
  });
});


process.on('SIGINT', function () { //on ctrl+c
  LED.writeSync(0); // Turn LED off
  LED.unexport(); // Unexport LED GPIO to free resources
  //pushButton.unexport(); // Unexport Button GPIO to free resources
  process.exit(); //exit completely
});