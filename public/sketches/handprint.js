let socket = io();
let fingers, fingerCalibration;

// candy
let rotateMode, simulateMode;

// time track stuff
let frameCount;

// pulse stuff
let pulseCheck, pulseFrequency, pulses;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  // dummy function for now, but it's supposed to calibrate a user's "rest position"
  calibrate();
  fingers = {};
  Object.assign(fingers, fingerCalibration);

  // for tracking  time
  frameCount = 0;

  // initiate pulse stuff
  pulseCheck = 0;
  pulseFrequency = 10;
  pulses = [];

  //
  rotateMode = true;
  simulateMode = 0;
}

function calibrate() {
  fingerCalibration = {
    pointer: 676,
    middle: 670,
    ring: 630,
    pinky: 630,
    thumb: 733
  };
}

function simulate() {
  fingers.pointer = 600 + frameCount * 0.1 * simulateMode;
  fingers.middle = 600 + frameCount * 0.1 * simulateMode;
  fingers.ring = 550 + frameCount * 0.1 * simulateMode;
  fingers.thumb = 550 + frameCount * 0.1 * simulateMode;
  fingers.pinky = 550 + frameCount * 0.1 * simulateMode;
}

socket.on("flexing", function([point, mid, ring, pinky, thumb]) {
  fingers.pointer = point;
  fingers.middle = mid;
  fingers.ring = ring;
  fingers.pinky = pinky;
  fingers.thumb = thumb;
});

function draw() {
  // just for dev stuff / testing.
  // orbitControl();

  // temp styling - will probably change.
  background(0);
  stroke(205, 0, 0);
  strokeWeight(1);
  fill(255, 7, 58);

  // if we want stuff to spin, set rotateMode in setup.
  if (rotateMode) {
    rotateY(-1 * frameCount * 0.002);
  }

  // handlePulse() and etc. FIRST because it messes with the entire scale, but we don't
  // want the pulses to pop just the hand and everything else. so, by putting handlePulse() first
  // the lil scale bumps won't effect the pulses but the hand will pulse.
  handlePulse();

  push(); // ~~ for scale bump
  // scale(1 + pulseCheck * 0.01);

  push(); // ~~ for hand translate + rotation
  translate(0, 0, -60);
  rotateX(PI / 6);
  renderHand(6, 2, 8, 3);
  pop(); // ~~ for hand translate + rotation

  // simulate();
  // rendering the shine underneath it
  renderShine();
  pop(); //  ~~ for scale bump

  frameCount++;
}

// should just set pulse to on..
function handlePulse() {
  if (
    fingers.pinky < fingerCalibration.pinky &&
    fingers.ring < fingerCalibration.ring &&
    fingers.middle < fingerCalibration.middle &&
    fingers.pointer < fingerCalibration.pointer &&
    fingers.thumb < fingerCalibration.thumb
  ) {
    if (pulseCheck >= pulseFrequency) {
      pulseCheck = 0;
      pulses.push({ pulseCount: 0, duration: 300 }); // default is just going to be 300 frames for now
    } else pulseCheck++;
  }

  pulses.forEach(pulse => {
    createPulse(pulse);
  });
}

function createPulse(pulse) {
  // I'm too lazy to do the calculations to find when it actually ends because those are mad complex
  // so I just threw an if statement to make the torus stop rendering once it
  if (10 - pulse.pulseCount * 0.2 < 0 || pulse.pulseCount === pulse.duration) {
    pulses.shift();
    return;
  }

  push();
  stroke(255);
  fill(255);
  rotateX((11 * PI) / 16);
  torus(30 + pulse.pulseCount * 10, 10 - pulse.pulseCount * 0.2, 24, 8);
  pop();

  pulse.pulseCount++;
}

function renderShine() {
  push();
  translate(0, 250, 0);
  rotateX(PI / 2);
  if (rotateMode) rotateZ(frameCount * 0.01);
  torus(120, 20, 4, 3);
  push();
  translate(-180, 0, 0);
  if (rotateMode) rotateZ(-frameCount * 0.02);
  torus(20, 10, 4, 3);
  pop();
  push();
  translate(180, 0, 0);
  if (rotateMode) rotateZ(-frameCount * 0.02);
  torus(20, 10, 4, 3);
  pop();
  push();
  translate(0, -180, 0);
  if (rotateMode) rotateZ(-frameCount * 0.02);
  torus(20, 10, 4, 3);
  pop();
  push();
  translate(0, 180, 0);
  if (rotateMode) rotateZ(-frameCount * 0.02);
  torus(20, 10, 4, 3);
  pop();
  pop();
}

function renderHand(fingerDetailX, fingerDetailY, palmDetailX, palmDetailY) {
  function renderPalm() {
    push();
    ellipsoid(140, 160, 50, palmDetailX, palmDetailY);
    pop();
  }

  function renderPinkyFinger(rawValue) {
    let flex = map(rawValue, 630, 770, 0, (-1 * PI) / 2);
    push();
    translate(-130, -70, 0);
    rotateX(flex);
    rotateZ(-PI / 10);
    rotateY(PI / 8);
    push();
    translate(0, -55, 0);
    ellipsoid(25, 45, 30, fingerDetailX, fingerDetailY);
    pop();
    push();
    translate(0, -100, 0);
    rotateX(flex);
    push();
    translate(0, -30, 0);
    ellipsoid(28, 30, 28, fingerDetailX, fingerDetailY);
    pop();
    push();
    translate(0, -60, 0);
    rotateX(flex);
    push();
    translate(0, -30, 0);
    ellipsoid(25, 30, 25, fingerDetailX, fingerDetailY);
    pop();
    pop();
    pop();
    pop();
  }

  function renderRingFinger(rawValue) {
    let flex = map(rawValue, 630, 775, 0, (-1 * PI) / 2);
    push();
    translate(-80, -145, 0);
    rotateX(flex);
    push();
    translate(0, -55, 0);
    ellipsoid(30, 55, 30, fingerDetailX, fingerDetailY);
    pop();
    push();
    translate(0, -110, 0);
    rotateX(flex);
    push();
    translate(0, -50, 0);
    ellipsoid(30, 50, 30, fingerDetailX, fingerDetailY);
    pop();
    push();
    translate(0, -90, 0);
    rotateX(flex);
    push();
    translate(0, -45, 0);
    ellipsoid(30, 40, 30, fingerDetailX, fingerDetailY);
    pop();
    pop();
    pop();
    pop();
  }

  function renderMiddleFinger(rawValue) {
    let flex = map(rawValue, 670, 840, 0, (-1 * PI) / 2);
    push();
    translate(0, -170, 0);
    rotateX(flex);
    push();
    translate(0, -55, 0);
    ellipsoid(30, 55, 30, fingerDetailX, fingerDetailY);
    pop();
    push();
    translate(0, -110, 0);
    rotateX(flex);
    push();
    translate(0, -50, 0);
    ellipsoid(30, 50, 30, fingerDetailX, fingerDetailY);
    pop();
    push();
    translate(0, -90, 0);
    rotateX(flex);
    push();
    translate(0, -50, 0);
    ellipsoid(30, 40, 30, fingerDetailX, fingerDetailY);
    pop();
    pop();
    pop();
    pop();
  }

  function renderPointerFinger(rawValue) {
    let flex = map(rawValue, 676, 812, 0, (-1 * PI) / 2);
    push();
    translate(80, -145, 0);
    rotateX(flex);
    push();
    translate(0, -55, 0);
    ellipsoid(30, 55, 30, fingerDetailX, fingerDetailY);
    pop();
    push();
    translate(0, -110, 0);
    rotateX(flex);
    push();
    translate(0, -50, 0);
    ellipsoid(30, 50, 30, fingerDetailX, fingerDetailY);
    pop();
    push();
    translate(0, -90, 0);
    rotateX(flex);
    push();
    translate(0, -50, 0);
    ellipsoid(30, 40, 30, fingerDetailX, fingerDetailY);
    pop();
    pop();
    pop();
    pop();
  }

  function renderThumbFinger(rawValue) {
    let flex = map(rawValue, 730, 832, 0, (-1 * PI) / 6);
    let flexFw = map(rawValue, 730, 832, 0, (-1 * PI) / 2 - PI / 10);
    push();
    translate(175, 10, 0);
    rotateX(flexFw);
    rotateZ(flex);
    push();
    translate(0, -55, 0);
    rotateY((-5 * PI) / 8);
    ellipsoid(40, 50, 30, fingerDetailX, fingerDetailY);
    push();
    translate(0, -50, 0);
    rotateX(flex * 2);
    push();
    translate(0, -40, 0);
    ellipsoid(30, 40, 30, fingerDetailX, fingerDetailY);
    pop();
    push();
    translate(0, -60, 0);
    pop();
    pop();
    pop();
    pop();
  }

  push();
  translate(0, 40, 0);
  renderPalm();
  renderPinkyFinger(fingers.pinky);
  renderRingFinger(fingers.ring);
  renderPointerFinger(fingers.pointer);
  renderMiddleFinger(fingers.middle);
  renderThumbFinger(fingers.thumb);
  pop();
}
