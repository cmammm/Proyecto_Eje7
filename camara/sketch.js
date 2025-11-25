let video;
let waitTime = 5;       
let countdown = 5;      
let startWait = true;
let startCountdown = false;
let photoTaken = false;
let lastSecond = 0;

// Capa de trazos
let scratchLayer;
let strokes = [];
let maxStrokes = 40;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Cámara
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  // Capa de trazos
  scratchLayer = createGraphics(windowWidth, windowHeight);
  scratchLayer.clear();
}

function draw() {
  background(255);

  // 1) Cámara
  image(video, 0, 0, width, height);

  // 2) Actualizar y dibujar trazos curvos
  updateStrokes();
  drawStrokes();

  // 3) Temporizador
  timerLogic();
}

// ------------------- Trazos curvos con rastro -------------------
function updateStrokes() {
  // Crear nuevos trazos
  while (strokes.length < maxStrokes) {
    let s = {
      x: random(width),
      y: random(height),
      prevX: 0,
      prevY: 0,
      life: random(100, 200),
      color: color(random(255), random(255), random(255), 150),
      weight: random(2, 4),
      vx: random(-2, 2),
      vy: random(-2, 2)
    };
    s.prevX = s.x;
    s.prevY = s.y;
    strokes.push(s);
  }

  // Mover trazos
  for (let i = strokes.length - 1; i >= 0; i--) {
    let s = strokes[i];
    s.prevX = s.x;
    s.prevY = s.y;

    // Movimiento suave
    s.vx += random(-0.2, 0.2);
    s.vy += random(-0.2, 0.2);

    s.x += s.vx;
    s.y += s.vy;

    // Limitar dentro del canvas
    s.x = constrain(s.x, 0, width);
    s.y = constrain(s.y, 0, height);

    s.life--;
    if (s.life <= 0) {
      strokes.splice(i, 1);
    }
  }
}

function drawStrokes() {
  // En vez de limpiar completamente, dibujamos fondo semitransparente
  scratchLayer.fill(255, 255, 255, 20); // blanco con alpha
  scratchLayer.noStroke();
  scratchLayer.rect(0, 0, width, height);

  // Dibujar todos los trazos
  for (let s of strokes) {
    scratchLayer.stroke(s.color);
    scratchLayer.strokeWeight(s.weight);
    scratchLayer.line(s.prevX, s.prevY, s.x, s.y);
  }

  // Mostrar capa
  image(scratchLayer, 0, 0);
}

// ------------------- Temporizador -------------------
function timerLogic() {
  let currentSecond = floor(millis() / 1000);

  if (currentSecond !== lastSecond) {
    lastSecond = currentSecond;

    if (startWait) {
      waitTime--;
      if (waitTime <= 0) {
        startWait = false;
        startCountdown = true;
      }
    } 
    else if (startCountdown) {
      countdown--;
      if (countdown <= 0 && !photoTaken) {
        takePhoto();
        photoTaken = true;
        startCountdown = false;
      }
    }
  }

  if (startWait) {
    showBigText("Espera: " + waitTime);
  } 
  else if (startCountdown) {
    showBigText(countdown);
  }
}

// ------------------- Texto -------------------
function showBigText(msg) {
  push();
  fill(0);
  noStroke();
  textSize(120);
  textAlign(CENTER, CENTER);
  text(msg, width/2, height/2);
  pop();
}

// ------------------- Captura -------------------
function takePhoto() {
  saveCanvas("foto_mixmedia_rastro", "png");
}
