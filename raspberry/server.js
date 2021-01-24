// Load the http module to create an http server.
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http) //require socket.io module and pass the http object
//const fs = require('fs'); //require filesystem to read html files
const Gpio = require('onoff').Gpio; //require onoff to control GPIO
const port = 8080;
const LEDred = new Gpio(4, 'out');  //declare GPIO4 an output
const LEDgreen = new Gpio(3, 'out'); //declare GPIO3 an output
const pushButton = new Gpio(17, 'in', 'rising', {debounceTimeout: 10});
require('./firebase_database.js')();


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


// Listen on port 8080
http.listen(port, function (error) {
  if (error) {
    console.log('Something went wrong', error);
  }else {
    console.log('Server is listening on port ' + port);
    console.log('');
  }
});


var callback = function(snapshot) {
  var time = 10;
  var mstime = time*1000;
  const data = snapshot.toJSON();
  zoneName = data.name;
  //console.log(data);
  if (data.current >= data.max)  {
    LEDred.writeSync(1);
    LEDgreen.writeSync(0);
  } else {
    LEDred.writeSync(0);
    LEDgreen.writeSync(1);
  }
  let [hour, minute, second] = new Date().toLocaleTimeString('en-US').split(/:| /);
  setTimeout(readZone, mstime, zoneName, callback);
  console.log(zoneName);
  console.log('Periodicity: ' + time + 's')
  console.log('Lotação máxima: ' + data.max);
  console.log('Lotação atual: ' + data.current);
  console.log(hour + ':' + minute + ':' + second);
  console.log('');

}


pushButton.watch((err, value) => {
  if (err) {
    throw err;
  }
  var count;
  readZone('Leiria-Shopping/current', function(snapshot){
    count = snapshot.toJSON();
    count++;
    console.log('count = ' + count);
    updateZone('Leiria-Shopping', 'current', count);
  });
});


function startWebServer() {
  zonesNames = ['Leiria-Shopping', 'IPLeiria'];
  sensorsNames = ['Entrada', 'Saida', 'Desinfetante']
  var z;
  var current = 0;
  var max = 5;
  for (z in zonesNames) {
    createZone(zonesNames[z], current, max);
    for (s in sensorsNames) {
      createSensor(zonesNames[z], sensorsNames[s]);
      console.log('New ' + sensorsNames[s] + ' sensor!');
    }
    console.log('New zone with name: ' + zonesNames[z]);
    setTimeout(readZone, 5000, zonesNames[z], callback);
  }
}

// WebSocket Connection
io.on('connection', function (socket) {
  var buttonState = 0; //variable to store button state
  var buttonread = 0;

  socket.on('inout', function (direction, zoneName) { //get button state from client
    //console.log(zoneName);
    readZone(zoneName + '/current', function(snapshot){
      console.log(snapshot.toJSON());
      count = snapshot.toJSON();
      count += direction;
      updateZone(zoneName, 'current', count);
    });
  });

  socket.on('newsensoreg', function (zoneName, sensor, value) {
      newSensorValueNow(zoneName, sensor, value);
  });

  socket.on('read', function(zoneName) {
    readZone(zoneName, callback);
    updatePeriodicitySensor(zonename, 'Entrada');
  });

  socket.on('update', function (zoneName, fieldId, value) {
    updateZone(zoneName, fieldId,  value);
  })

  socket.on('create', function (zoneName) {
    createZone(zoneName);
  })

  socket.on('deletezone', function(zoneName) {
    deleteZone(zoneName);
  });

});

startWebServer();


//on ctrl+c
process.on('SIGINT', function () {
  LEDred.writeSync(0); // Turn LED off
  LEDred.unexport(); // Unexport LED GPIO to free resources
  LEDgreen.writeSync(0); // Turn LED off
  LEDgreen.unexport(); // Unexport LED GPIO to free resources
  pushButton.unexport(); // Unexport Button GPIO to free resources
  process.exit(); //exit completely
});