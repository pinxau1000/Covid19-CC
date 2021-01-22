// Load the http module to create an http server.
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http) //require socket.io module and pass the http object
//const fs = require('fs'); //require filesystem to read html files
const Gpio = require('onoff').Gpio; //require onoff to control GPIO
const port = 8080;
const LEDred = new Gpio(4, 'out');  //declare GPIO4 an output
const LEDgreen = new Gpio(3, 'out'); //declare GPIO3 an output
require('./firebase_database.js')();
var time = 10;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


// Listen on port 8080
http.listen(port, function (error) {
  if (error) {
    console.log('Something went wrong', error);
  }else {
    console.log('Server is listening on port ' + port);
  }
});


var callback = function(snapshot) {
  const data = snapshot.toJSON();
  //console.log(data);
  if (data.current >= data.max_ppl)  {
    LEDred.writeSync(1);
    LEDgreen.writeSync(0);
  } else {
    LEDred.writeSync(0);
    LEDgreen.writeSync(1);
  }
  time = data.periodicityLeds;
  setTimeout(readZone, time, 'Leiria-Shopping-test', callback);
  console.log('Time: ' + time)
  console.log('Lotação máxima: ' + data.max_ppl);
  console.log('Lotação atual: ' + data.current);
}


// WebSocket Connection
io.on('connection', function (socket) {
  var buttonState = 0; //variable to store button state
  var buttonread = 0;

  socket.on('state', function (data) { //get button state from client
    buttonState = data;
    if (buttonState != LEDred.readSync()) { //Change LED state if button state is changed
      LEDred.writeSync(buttonState); //turn LED on or off
      //addZone('Leiria-Shopping-test', 'Entrada-Norte',  buttonState);
    }
  });

  socket.on('read', function() {
    readZone('Leiria-Shopping-test', callback);
  });

  socket.on('update', function (zoneId, fieldId, value) {
    updateZone(zoneId, fieldId,  value);
  })

  socket.on('write', function (zoneId) {
    addZone(zoneId);
  })

});

readZone('Leiria-Shopping-test', callback);


//on ctrl+c
process.on('SIGINT', function () {
  LEDred.writeSync(0); // Turn LED off
  LEDred.unexport(); // Unexport LED GPIO to free resources
  LEDgreen.writeSync(0); // Turn LED off
  LEDgreen.unexport(); // Unexport LED GPIO to free resources
  //pushButton.unexport(); // Unexport Button GPIO to free resources
  process.exit(); //exit completely
});