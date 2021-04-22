const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
var five = require("johnny-five"),
  board,
  board = new five.Board();

app.use(express.static("public"));

// when the board is ready...
board.on("ready", function() {
  // give each finger power
  var o12 = new five.Pin(12);
  var o11 = new five.Pin(11);
  var o2 = new five.Pin(2);
  var o3 = new five.Pin(3);
  var o5 = new five.Pin(5);

  o12.high();
  o11.high();
  o2.high();
  o3.high();
  o5.high();

  // hook up the sensors to constants
  const pointer = new five.Sensor({ pin: "A7" });
  const middle = new five.Sensor({ pin: "A6" });
  const ring = new five.Sensor({ pin: "A1" });
  const pinky = new five.Sensor({ pin: "A2" });
  const thumb = new five.Sensor({ pin: "A3" });

  // adjust the scale of what we're getting
  pointer.scale(0, 1000);
  middle.scale(0, 1000);
  ring.scale(0, 1000);
  pinky.scale(0, 1000);
  thumb.scale(0, 1000);

  // when the pointer finger sends data (which is at the same rate as all the other fingers), emit a websocket event "flexing" and send all values over.
  pointer.on("data", () => {
    io.emit("flexing", [
      thumb.value,
      pointer.value,
      middle.value,
      ring.value,
      pinky.value,
    ]);
  });

  // johnny-five magic for hooking up the accelerometer... I have no idea how this works.
  var accelerometer = new five.Accelerometer({
    controller: "MPU6050"
  });

  accelerometer.on("change", () => {
    const {
      acceleration,
      inclination,
      orientation,
      pitch,
      roll,
      x,
      y,
      z
    } = accelerometer;

    // emit custom websocket event "moving" and send all the data over
    io.emit("moving", [x, y, z, acceleration, inclination, orientation, pitch, roll]);
  });
});

http.listen(3000, () => {
  console.log("🚀 App running on http://localhost:3000");
});
