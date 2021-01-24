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
//defaults
//const zonesNames = ['IPLeiria', 'Biblioteca'];
//const sensorsNames = ['Entrada', 'Saida', 'Desinfetante'];
let localsDatas = [];
let firebase = require('./firebase.js')();

let getperiod = 5000;


let zones = {
  Biblioteca: {},
  IPLeiria: {}
}

let sensors = {
  Entrada: {},
  Saída: {},
  Desinfetante: {}
}

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


let callback = function(snapshot) {
  const data = snapshot.toJSON();
  console.log(data);
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
  setTimeout(getZone, getperiod, zoneName, callback);
  console.log(zoneName);
  console.log('Periodicity: ' + time + 's')
  console.log('Lotação máxima: ' + data.max);
  console.log('Lotação atual: ' + data.current);
  console.log(hour + ':' + minute + ':' + second);
  console.log('');
}

let sendSensorsAllValues = function (data, zoneName, sensorName) {
  for (let localData in localsDatas.length){
    newSensorValue(zoneName, sensorsName, localData.value, localData.timestamp)
  }
  localsDatas = [];
}

let timeOutIDs = [];
let updatePeriodicity = function (data, zoneName, sensorName) {
  let zID = zonesNames.indexOf(zoneName);
  let sID = sensorsNames.indexOf(sensorName);
  if (timeOutIDs.length!=0){
    clearTimeout(timeOutIDs[zID][sID]);
  }
  timeOutIDs.push(setTimeout(sendSensorsAllValues, Number(data), data, zoneName, sensorName));
  console.log(`Timeout ${timeOutIDs[zID][sID]} set to ${Number(data)}`);
}


pushButton.watch((err, value) => {
  if (err) {
    throw err;
  }
  var count;
  getZone('Leiria-Shopping/current', function(snapshot){
    count = snapshot.toJSON();
    count++;
    console.log('count = ' + count);
    updateZoneChild('Leiria-Shopping', 'current', count);
  });
});


function startWebServer() {
  let zonesNames = Object.keys(zones);
  let sensorsNames = Object.keys(sensors);
  let z;
  let s;
  var current = 0;
  var max = 5;
  for (z in zonesNames) {
    createZone(zonesNames[z], current, max);
    for (s in sensorsNames) {
      createSensor(zonesNames[z], sensorsNames[s]);
      /*
      listeningPeriodicity(zonesNames[z], sensorsNames[s], data => {
        updatePeriodicity(data, zonesNames[z], sensorsNames[s]);
      });

       */
      console.log(' - New ' + sensorsNames[s] + ' sensor!');
    }
    console.log('New zone with name: ' + zonesNames[z]);
    setTimeout(getZone, getperiod, zonesNames[z], callback);
  }
}


// WebSocket Connection
io.on('connection', function (socket) {
  var buttonState = 0; //variable to store button state
  var buttonread = 0;

  socket.on('inout', function (direction, zoneName) { //get button state from client
    console.log(zoneName);
    getZone(zoneName, function(snapshot){
      console.log(snapshot.toJSON());
      count = snapshot;
      count += direction;
      updateZoneChild(zoneName, direction, count);
    });
  });

  socket.on('newsensoreg', function (zoneName, sensor, value) {
      localsDatas.push(value);
  });

  socket.on('read', function(zoneName) {
    getZone(zoneName, callback);
    updatePeriodicitySensor(zonename, 'Entrada');
  });

  socket.on('update', function (zoneName, fieldId, value) {
    updateZoneChild(zoneName, fieldId,  value);
  })

  socket.on('create', function (zoneName) {
    createZone(zoneName);
    let sensorsNames = Object.keys(sensors);
    let s;
    for (s in sensorsNames){
      createSensor(zoneName, sensorsNames[s]);
    }
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