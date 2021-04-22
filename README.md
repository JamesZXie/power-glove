Repo for managing the many different sketches of the craft-con-glove

# One-Time Setup

1. Download Arduino IDE: https://www.arduino.cc/en/Main/Software
2. Open it
3. Connect the Arduino Nano on the glove to your computer with the cable.
4. Go to Tools --> Board “Arduino Uno” --> Arduino Nano
5. Go to Tools --> Port --> select the port with "usbserial" in the name
6. Go to File --> Examples --> Firmata --> StandardFirmataPlus
7. Click the checkmark labeled "verify" then click the button to its right labeled "upload"

# Making your own p5 sketch

1. Create your own branch! Title it however you want.
2. Go to the public folder
3. Add your own file, name it whatever like "sketch.js"
4. In index.html, change the script src on line 19 from "handprint.js" to your sketch

# Websocket event "API"

## Fingers

- Event: `"flexing"`
- Returns: `thumb value, pointer value, middle finger value, ring finger value, pinky value`

Some code if you need to get started

```
let socket = io()
let fingers = {
  thumb: 0,
  pointer: 0,
  middle: 0,
  ring: 0,
  pinky: 0,
};

function setup() {}

socket.on("flexing", function([thumb, point, mid, ring, pinky]) {
  fingers.thumb = thumb;
  fingers.pointer = point;
  fingers.middle = mid;
  fingers.ring = ring;
  fingers.pinky = pinky;
});

function draw() {}
```

## Accelerometer

- Event: `"moving"`
- Returns: `x acceleration, y acceleration, z acceleration, net acceleration, inclination, orientation, pitch, roll`

Some code if you need to get started

```
let socket = io()
let accelerometer = {
  x: 0,
  y: 0,
  z: 0,
  acceleration: 0,
  inclination: 0,
  orientation: 0,
  pitch: 0,
  roll: 0,
};

function setup() {}

socket.on("moving", function([x, y, z, acceleration, inclination, orientation, pitch, roll]) {
  accelerometer.x = x;
  accelerometer.y = y;
  accelerometer.z = z;
  accelerometer.accelration = acceleration;
  accelerometer.inclination = inclination;
  accelerometer.orientation = orientation;
  accelerometer.pitch = pitch;
  accelerometer.roll = roll;
});

function draw() {}
```

# Mocking Dummy Data

**I'm currently working on a `simulate.js` file that will let you just run "npm run simulate" in the terminal without having to change anything on the frontend to simulate some random hand motions.**

You can see an example of how I did it in handprint by  looking at the `simulate()` function. I take the builtin `framecount` variable in p5 which gives the number of frames since the sketch started and then add that to the finger values to simulate a hand moving. The code for `simulate()` is below.

```
function simulate() {
  fingers.pointer = 600 + frameCount * 0.1 * simulateMode;
  fingers.middle = 600 + frameCount * 0.1 * simulateMode;
  fingers.ring = 550 + frameCount * 0.1 * simulateMode;
  fingers.thumb = 550 + frameCount * 0.1 * simulateMode;
  fingers.pinky = 550 + frameCount * 0.1 * simulateMode;
}
```

where `simulateMode` is a `const` of value either `1` or `0` depending on if I want to inject the simulated movement or not.

DM me on instagram @slimxiedy if you have questions.
