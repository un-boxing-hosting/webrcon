// This minimal example connects and runs the "help" command.

var Rcon = require(`rcon`);
var options = {
    tcp: true,       // false for UDP, true for TCP (default true)
    challenge: true  // true to use the challenge protocol (default true)
  };
var conn = new Rcon('pw.covert-gaming.com', 25575, '00threepwood!!', options);

conn.on('auth', function() {
  // You must wait until this event is fired before sending any commands,
  // otherwise those commands will fail.
  console.log("Authenticated");
  console.log("Sending command: info")
  conn.send("info");
}).on('response', function(str) {
  console.log("Response: " + str);
}).on('error', function(err) {
  console.log("Error: " + err);
}).on('end', function() {
  console.log("Connection closed");
  process.exit();
});

conn.connect();

// connect() will return immediately.
//
// If you try to send a command here, it will fail since the connection isn't
// authenticated yet. Wait for the 'auth' event.