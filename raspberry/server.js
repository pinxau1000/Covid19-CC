// Load the http module to create an http server.
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http) //require socket.io module and pass the http object
const Gpio = require('onoff').Gpio; //require onoff to control GPIO
const port = 8080;
const fb = require('./firebase.js')();


function compareCapacitySetLed(zone){
  getZone(zone.name, dataSnapshot => {
        try{
          // Cannot get all the zone values because the remote zone as not the hardware properties!
          zone.current = dataSnapshot.current;
          zone.max = dataSnapshot.max;

          if (zone === null) {
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
          // When ledGreen or ledRed are not GPIO instances!
        }
      },
      function(){
        try{
          // Disabled the LED on fail!
          zone.ledRed.writeSync(0);
          zone.ledGreen.writeSync(0);
        }catch (err){
          // When ledGreen or ledRed are not GPIO instances!
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
        if (new_periodicity !== null){
          if (item.timeouts.id !== undefined){
            clearInterval(item.timeouts.id);
          }
          let interv = new_periodicity*1000;
          item.timeouts.id = setInterval(item.timeouts.action, interv, zone, item, new_periodicity);

          console.log("--------------------- SET TIMEOUT ----------------------");
          console.log('Zone: ' + zone.name);
          console.log('Item: ' + item.name);
          console.log('Periodicity: ' + new_periodicity);
          console.log('Max: ' + zone.max);
          console.log('Atual: ' + zone.current);
          console.log(new Date().toLocaleTimeString('en-US').slice(0, -3));
          console.log("--------------------------------------------------------");
          console.log("");
        }});

}

const itemaction = function(zone, item, period){
  Object.values(item.values).forEach(entry => {
    newSensorValue(zone.name, item.name, entry.value, entry.timestamp, function(){
      // console.log(`\t - ${item.name}: ${entry.value}`);
      item.values = [];
    });
  })
}

const zoneaction = function (zone) {
  if(zone.enabled){
    updateCurrent(zone.name, zone.current, function(){
        // console.log(` - ${zone.name}: ${zone.current}`);
    });
    compareCapacitySetLed(zone);
  }
}

/**
 * Sensors in each zone
 */
const sensorsBiblioteca = [
  {
    name: "Entrada",
    periodicity: 5,
    timeouts: {
      id: undefined,
      action: itemaction
    },
    values: [],
    last: 0
  },
  {
    name: "Saída",
    periodicity: 5,
    timeouts: {
      id: undefined,
      action: itemaction
    },
    values: [],
    last: 0
  },
  {
    name: "Desinfetante",
    periodicity: 5,
    timeouts: {
      id: undefined,
      action: itemaction
    },
    values: [],
    last: 0
  }
]

const sensorsRefeitorio = [
  {
    name: "Entrada",
    periodicity: 5,
    timeouts: {
      id: undefined,
      action: itemaction
    },
    values: [],
    last: 0
  },
  {
    name: "Saída",
    periodicity: 5,
    timeouts: {
      id: undefined,
      action: itemaction
    },
    values: [],
    last: 0
  },
  {
    name: "Desinfetante",
    periodicity: 5,
    timeouts: {
      id: undefined,
      action: itemaction
    },
    values: [],
    last: 0
  }
]

const sensorsSalaInformatica = [
  {
    name: "Entrada",
    periodicity: 5,
    timeouts: {
      id: undefined,
      action: itemaction
    },
    values: [],
    last: 0
  },
  {
    name: "Saída",
    periodicity: 5,
    timeouts: {
      id: undefined,
      action: itemaction
    },
    values: [],
    last: 0
  },
  {
    name: "Desinfetante",
    periodicity: 5,
    timeouts: {
      id: undefined,
      action: itemaction
    },
    values: [],
    last: 0
  }
]

/**
 * All zones in this raspberry
 */
var zones = [
  {
    name: "Biblioteca",
    current: 0,
    max: 40,
    enabled: true,
    items: sensorsBiblioteca,
    ledRed: new Gpio(4, 'out'),
    ledGreen: new Gpio(3, 'out'),
    pushBtn: new Gpio(17, 'in', 'rising', {debounceTimeout: 10}),
    timeouts: {
      id: undefined,
      action: zoneaction
    }
  },
  {
    name: "Refeitorio",
    current: 0,
    max: 10,
    enabled: true,
    items: sensorsRefeitorio,
    ledRed: new Gpio(22, 'out'),
    ledGreen: new Gpio(27, 'out'),
    timeouts: {
      id: undefined,
      action: zoneaction
    }
  },
  {
    name: "Sala-Informatica",
    current: 0,
    max: 15,
    enabled: true,
    items: sensorsSalaInformatica,
    ledRed: new Gpio(9, 'out'),
    ledGreen: new Gpio(10, 'out'),
    timeouts: {
      id: undefined,
      action: zoneaction
    }
  }
]

function initialization(){
  for (let zone of zones){
    // Creates a zone
    createZone(zone.name, function(){}, function(){}, zone.current, zone.max);

    // Create listener for enabled change, so that periodicity's can be
    // changed accordingly. LEDS are also affected by enabled state.
    listeningEnabled(zone.name, function(value){
      // Update local status
      zone.enabled = value;

      if (value){
        // Enables timeout for periodicity on all sensors with zone is enabled
        Object.values(zone.items).forEach(item => {
          setSensorsPeriodocityTimeout(zone, item);
        });

        // Creates timeout that read from time to time the current and total
        // value to update the LED value
        zone.timeouts.id = setInterval(zone.timeouts.action, 5000, zone);

        // Limpa o histórico de valores
        zone.items.forEach(item => {
          item.values = [];
        });
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

    // Attach watcher/listen to push button of each zone
    try{
      zone.pushBtn.watch((err, value) => {
        if (err) {
          throw err;
        }

        if (zone.enabled) {
          let i_idx;
          Object.values(zone.items).forEach((item, idx) => {
            if (item.name === "Desinfetante"){
              i_idx = idx;
            }
          });

          const currentvalue = zone.items[i_idx].last + value;
          const now = Date.now();
          zone.items[i_idx].values.push({
            value: currentvalue,
            timestamp: now
          });

          zone.items[i_idx].last = currentvalue;
        }
      });
    } catch (e) {
      // When push button is not a GPIO instance
    }

    // For all items inside the zone... lets create them :D
    for (let item of zone.items){
      // Creates a item in that zone
      createSensor(zone.name, item.name, item.periodicity);
    }
  }
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Listen on port 8080
http.listen(port, function (error) {
  if (error) {
    console.log('Something went wrong ', error);
  }else {
    console.log('Server is listening on port ' + port);
  }
});


// WebSocket Connection
io.on('connection', function (socket) {
  socket.on('newsensoreg', function (zoneName, sensorName) {

    let z_idx;
    let i_idx;
    Object.values(zones).forEach((zone, idx) => {
      if (zone.name === zoneName){
        z_idx = idx;
        Object.values(zone.items).forEach((item, idx) => {
          if (item.name === sensorName){
            i_idx = idx;
          }
        });
      }
    });

    if (zones[z_idx].enabled) {
      // Increment or decrement current
      if (sensorName === "Entrada" || sensorName === "Saída") {
        if (sensorName === "Entrada") {
          zones[z_idx].current++;
        } else {
          zones[z_idx].current--;
        }
      }

      const value = zones[z_idx].items[i_idx].last + 1;
      const now = Date.now();

      zones[z_idx].items[i_idx].values.push({
        value: value,
        timestamp: now
      });

      zones[z_idx].items[i_idx].last = value;
    }
  });
});

initialization();

//on ctrl+c
process.on('SIGINT',
    function () {
      for (let zone of zones){
        zone.ledRed.writeSync(0); // Turn LED off
        zone.ledRed.unexport(); // Unexport LED GPIO to free resourcesc
        zone.ledGreen.writeSync(0); // Turn LED off
        zone.ledGreen.unexport(); // Unexport LED GPIO to free resources
        zone.pushBtn.unexport(); // Unexport Button GPIO to free resources
      }

      process.exit(); //exit completely
    });
