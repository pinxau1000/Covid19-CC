// Load the http module to create an http server.
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http) //require socket.io module and pass the http object
//const fs = require('fs'); //require filesystem to read html files
const Gpio = require('onoff').Gpio; //require onoff to control GPIO
const port = 8080;
const LED = new Gpio(4, 'out');  //declare GPIO4 an output
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
  }
});

var callback = function(snapshot) {
  const data = snapshot.toJSON();
  console.log(data);
  if (data.current >= data.max_ppl)  {
    LED.writeSync(1);
    console.log(data.current);
    console.log("ola");
  } else {
    LED.writeSync(0);
    console.log("adeus");
    console.log(data.max_ppl);
}
}


// WebSocket Connection
io.on('connection', function (socket) {
  var buttonState = 0; //variable to store button state
  var buttonread = 0;

  socket.on('state', function (data) { //get button state from client
    buttonState = data;
    if (buttonState != LED.readSync()) { //Change LED state if button state is changed
      LED.writeSync(buttonState); //turn LED on or off
      addZone('Leiria-Shopping-test', 'Entrada-Norte',  buttonState);
      //console.log(buttonState);
    }
  });

  socket.on('read', function() {
    //var current = updateZone('Leiria-Shopping-test', 'current');
    //var max = updateZone('Leiria-Shopping-test', 'max_ppl');

    readZone('Leiria-Shopping-test', callback)
  });
});

//on ctrl+c
process.on('SIGINT', function () {
  LED.writeSync(0); // Turn LED off
  LED.unexport(); // Unexport LED GPIO to free resources
  //pushButton.unexport(); // Unexport Button GPIO to free resources
  process.exit(); //exit completely
});