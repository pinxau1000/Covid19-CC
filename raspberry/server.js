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
const fb = require('./firebase.js')();

function compareCapacitySetLed(zone){
  getZone(zone.name, dataSnapshot => {
    try{
      let zoneRemote = dataSnapshot.toJSON();
      if (zoneRemote === null) {
        // Disabled the LED on fail if zone didn't exists!
        zone.ledRed.writeSync(0);
        zone.ledGreen.writeSync(0);
      } else {
        if (zone.current >= zone.max) {
          zone.ledRed.writeSync(1);
          zone.ledGreen.writeSync(0);
        } else {
          zone.ledRed.writeSync(0);
          zone.ledGreen.writeSync(1);
        }
      }
    }catch (err){
      console.log(`${zone.name}`)
    }
  },
      function(){
    try{
      // Disabled the LED on fail!
      zone.ledRed.writeSync(0);
      zone.ledGreen.writeSync(0);
    }catch (err){
      console.log(`${zone.name}`)
    }
      }
  );
}

function setSensorsPeriodocityTimeout(zone, item){
  // Attach a listener on periodicity
  listeningPeriodicity(zone.name, item.name,
      function (new_periodicity) {
    // If the periodicity value is a number and there are already defined
    // timeouts then clear the old timeout and add new one with the
    // updated value.
    if ((item.timeouts.id !== undefined) && !(isNaN(Number(new_periodicity)))) {
      clearInterval(item.timeouts.id);
    }
    let interv = new_periodicity*1000;
    item.timeouts.id = setInterval(item.timeouts.action, interv, zone, item, new_periodicity);
  });

  console.log("--------------------------------------------------------")
  console.log('Zone: ' + zone.name)
  console.log('Item: ' + item.name)
  console.log('Periodicity: ' + item.periodicity)
  console.log('Max: ' + zone.max);
  console.log('Atual: ' + zone.current);
  console.log(new Date().toLocaleTimeString('en-US').slice(0, -3));
  console.log("--------------------------------------------------------")
  console.log("")

}


/**
 * Sensors in each zone
 */
let sensors = [
  {
    name: "Entrada",
    periodicity: 10,
    timeouts: {
      id: undefined,
      action: function(zone, item, period){
        console.log(`${zone.name} -> ${item.name} : ${period}`);
        newSensorValueNow(zone.name, item.name, 1);
      }
    }
  },
  {
    name: "Saída",
    periodicity: 20,
    timeouts: {
      id: undefined,
      action: function(zone, item, period){
        console.log(`${zone.name} -> ${item.name} : ${period}`);
        newSensorValueNow(zone.name, item.name, 2);
      }
    }
  },
  {
    name: "Desinfetante",
    periodicity: 30,
    timeouts: {
      id: undefined,
      action: function(zone, item, period){
        console.log(`${zone.name} -> ${item.name} : ${period}`);
        newSensorValueNow(zone.name, item.name, 3);
      }
    }
  }
]

/**
 * All zones in this raspberry
 */
let zones = [
  {
    name: "Biblioteca-3",
    current: 0,
    max: 40,
    enabled: true,
    items: sensors,
    ledRed: new Gpio(4, 'out'),
    ledGreen: new Gpio(3, 'out'),
    timeouts: {
      id: undefined,
      action: function (zone) {
        compareCapacitySetLed(zone);
      }
    }
  },
  {
    name: "Sala-Robotica-3",
    current: 0,
    max: 10,
    enabled: true,
    items: sensors,
    ledRed: "id-some-html-element",
    ledGreen: "id-some-html-element",
    timeouts: {
      id: undefined,
      action: function (zone) {
        compareCapacitySetLed(zone);
      }
    }
  },
  {
    name: "Sala-Informatica-3",
    current: 0,
    max: 15,
    enabled: true,
    items: sensors,
    ledRed: "id-some-html-element",
    ledGreen: "id-some-html-element",
    timeouts: {
      id: undefined,
      action: function (zone) {
        compareCapacitySetLed(zone);
      }
    }
  }
]


// FIXME Check if function is needed
function writeLedStatus(led, value) {
  if (led instanceof Gpio) {
    led.writeSync(value);

    /* TODO HTML Elements
    } else if (typeof(led) === typeof(String)) {
      if (value === 1) {
        $("led").css("color", value);
      } else {
        $("led").css("color", "black");
      }
    }
    // */
  }
}

function initialization(){
  for (let zone of zones){
    // Creates a zone
    createZone(zone.name, function(){}, function(){}, zone.current, zone.max);

    // Create listener for enabled change, so that periodicity's can be
    // changed accordingly. LEDS are also affected by enabled state.
    listeningEnabled(zone.name, function(value){
      if (value){
        // Enables timeout for periodicity on all sensors with zone is enabled
        Object.values(zone.items).forEach(item => {
          setSensorsPeriodocityTimeout(zone, item)
        });

        // Creates timeout that read from time to time the current and total
        // value to update the LED value
        zone.timeouts.id = setInterval(zone.timeouts.action, 5000, zone);

      } else {
        // Disables timeout for periodicity on all sensors with zone is disabled
        Object.values(zone.items).forEach(item => {
          clearInterval(item.timeouts.id);
          item.timeouts.id = undefined;
        });

        // Creates timeout that read from time to time the current and total
        // value to update the LED value
        clearInterval(zone.timeouts.id);
        zone.timeouts.id = undefined;

        // Also disabled the LEDs
        zone.ledRed.writeSync(0);
        zone.ledGreen.writeSync(0);
      }
    });

    // For all items inside the zone... lets create them :D
    for (let item of zone.items){
      // Creates a item in that zone
      createSensor(zone.name, item.name, item.periodicity);

      /* FIXME Check if needed... (Sets periodicity listenners)
      // Adds listener for items periodicity if zone is enabled
      if (zone.enabled){
        listeningPeriodicity(zone.name, item.name, function(new_periodicity){
          console.log(new_periodicity);
          if ((item.timeouts.id !== undefined) && !(isNaN(Number(new_periodicity)))){
            clearInterval(item.timeouts.id);
          }
          item.timeouts.id = setInterval(item.timeouts.action, new_periodicity, zone.name, item.name);
        });
      }
      // */
    }
  }

}

pushButton.watch((err, value) => {
  if (err) {
    throw err;
  }

  let count;
  getZone('Leiria-Shopping/current', function(snapshot){
    count = snapshot.toJSON();
    count++;
    console.log('count = ' + count);
    updateZoneChild('Leiria-Shopping', 'current', count);
  });
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Listen on port 8080
http.listen(port, function (error) {
  if (error) {
    console.log('Something went wrong', error);
  }else {
    console.log('Server is listening on port' + port);
  }
});

// WebSocket Connection
io.on('connection', function (socket) {
  let buttonState = 0; //variable to store button state
  let buttonread = 0;

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

initialization();

//on ctrl+c
process.on('SIGINT',
    function () {
  LEDred.writeSync(0); // Turn LED off
  LEDred.unexport(); // Unexport LED GPIO to free resources
  LEDgreen.writeSync(0); // Turn LED off
  LEDgreen.unexport(); // Unexport LED GPIO to free resources
  pushButton.unexport(); // Unexport Button GPIO to free resources
  process.exit(); //exit completely
});
