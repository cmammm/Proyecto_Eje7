let video;
let videoReady = false;

let scratchLayer;
let circleLayer;

let strokes = [];
let circles = [];

let maxStrokes = 40;
let maxCircles = 25;

let waitTime = 5;
let countdown = 5;
let startWait = true;
let startCountdown = false;
let lastSecond = 0;
let photoTaken = false;

function setup() {
  createCanvas(windowWidth, windowHeight);

  video = createCapture(VIDEO, { flipped: true });
  video.size(windowWidth, windowHeight);
  video.hide();

  // Esperar a que la cámara realmente cargue
  video.elt.onloadeddata = () => {
    videoReady = true;

    scratchLayer = createGraphics(width, height);
    circleLayer = createGraphics(width, height);

    scratchLayer.clear();
    circleLayer.clear();
  };
}

function draw() {
  background(0);

  if (!videoReady) {
    fill(255);
    textSize(40);
    textAlign(CENTER, CENTER);
    text("Cargando cámara...", width / 2, height / 2);
    return;
  }

  // 1) Cámara visible SIEMPRE
  image(video, 0, 0, width, height);

  // 2) Círculos
  updateCircles();
  drawCircles();
  image(circleLayer, 0, 0);

  // 3) Trazos sin blanquear la pantalla
  updateStrokes();
  drawStrokes();

  // 4) Temporizador y foto
  timerLogic();
}

//
// ------------------------------
//   CÍRCULOS
// ------------------------------
function updateCircles() {
  while (circles.length < maxCircles) {
    circles.push({
      x: random(width),
      y: random(height),
      size: random(20, 70),
      alpha: 200,
      life: random(80, 150),
      vx: random(-1, 1),
      vy: random(-1, 1),
      col: color(random(150, 255), random(100, 255), random(255), 200)
    });
  }

  for (let i = circles.length - 1; i >= 0; i--) {
    let c = circles[i];
    c.x += c.vx;
    c.y += c.vy;

    c.life--;
    c.alpha -= 2;

    if (c.life <= 0 || c.alpha <= 0) circles.splice(i, 1);
  }
}

function drawCircles() {
  circleLayer.clear();
  for (let c of circles) {
    circleLayer.noStroke();
    circleLayer.fill(red(c.col), green(c.col), blue(c.col), c.alpha);
    circleLayer.ellipse(c.x, c.y, c.size);
  }
}

//
// ------------------------------
//   TRAZOS (NO BLANQUEA LA PANTALLA)
// ------------------------------
function updateStrokes() {
  while (strokes.length < maxStrokes) {
    strokes.push({
      x: random(width),
      y: random(height),
      px: random(width),
      py: random(height),
      vx: random(-1.5, 1.5),
      vy: random(-1.5, 1.5),
      life: random(100, 200),
      col: color(random(255), random(255), random(255), 150),
      weight: random(2, 4)
    });
  }

  for (let i = strokes.length - 1; i >= 0; i--) {
    let s = strokes[i];
    s.px = s.x;
    s.py = s.y;
    s.x += s.vx;
    s.y += s.vy;
    s.life--;

    if (s.life <= 0) strokes.splice(i, 1);
  }
}

function drawStrokes() {
  scratchLayer.clear();
  for (let s of strokes) {
    scratchLayer.stroke(s.col);
    scratchLayer.strokeWeight(s.weight);
    scratchLayer.line(s.px, s.py, s.x, s.y);
  }
  image(scratchLayer, 0, 0);
}

//
// ------------------------------
//   TEMPORIZADOR
// ------------------------------
function timerLogic() {
  if (photoTaken) return; // ✨ SE DETIENE TODO

  let sec = floor(millis() / 1000);
  if (sec !== lastSecond) {
    lastSecond = sec;

    if (startWait) {
      waitTime--;
      if (waitTime <= 0) {
        startWait = false;
        startCountdown = true;
      }
    } else if (startCountdown) {
      countdown--;
      if (countdown <= 0) {
        saveCanvas("foto", "png");
        photoTaken = true;
      }
    }
  }

  if (startWait) showBigText("Espera: " + waitTime);
  else if (startCountdown) showBigText(countdown);
}

function showBigText(t) {
  fill(255);
  stroke(0);
  strokeWeight(4);
  textSize(100);
  textAlign(CENTER, CENTER);
  text(t, width / 2, height / 2);
}
