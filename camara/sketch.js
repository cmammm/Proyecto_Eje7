// ------------------------------
//  SUPABASE
// ------------------------------
const SUPABASE_URL = "https://tqtcyphinjsqxuadxtwj.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdGN5cGhpbmpzcXh1YWR4dHdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MDE0MzUsImV4cCI6MjA3NzQ3NzQzNX0.MlgyjJM67TvOaDnL0V_As3IpZ8EkoofQBNa8jrEkp3E";
const BUCKET_NAME = "fotos";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ------------------------------
//  VARIABLES ORIGINALES
// ------------------------------
let video;
let videoReady = false;

let scratchLayer;
let circleLayer;

let strokes = [];
let circles = [];

let maxStrokes = 40;
let maxCircles = 25;

// SOLO CONTADOR DE 5s
let countdown = 5;
let startCountdown = true; 
let lastSecond = 0;
let photoTaken = false;

// BODYPOSE
let poseModel;
let poses = [];

// ------------------------------
//  SETUP
// ------------------------------
function setup() {
  createCanvas(windowWidth, windowHeight);

  video = createCapture(VIDEO, { flipped: true });
  video.size(windowWidth, windowHeight);
  video.hide();

  video.elt.onloadeddata = () => {
    videoReady = true;

    scratchLayer = createGraphics(width, height);
    circleLayer = createGraphics(width, height);

    // 🔥 Cargar el modelo BodyPose
    poseModel = ml5.bodyPose(video, () => {
      console.log("BodyPose listo");
    });

    poseModel.on("pose", (results) => {
      poses = results;
    });

    scratchLayer.clear();
    circleLayer.clear();
  };
}

// ------------------------------
//  DRAW
// ------------------------------
function draw() {
  background(0);

  if (!videoReady) {
    fill(255);
    textSize(40);
    textAlign(CENTER, CENTER);
    text("Cargando cámara...", width / 2, height / 2);
    return;
  }

  image(video, 0, 0, width, height);

  updateCircles();
  drawCircles();
  image(circleLayer, 0, 0);

  updateStrokes();
  drawStrokes();

  drawFaceMask();

  timerLogic();
}

// ------------------------------
//     CÍRCULOS (NEGROS)
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
      col: color(0, 0, 0, 200) // NEGRO
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
    circleLayer.fill(0, 0, 0, c.alpha); // negro
    circleLayer.ellipse(c.x, c.y, c.size);
  }
}

// ------------------------------
//   TRAZOS (SIN CAMBIOS RAROS)
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

// ------------------------------
//   DIBUJAR CUADRADO NEGRO EN LA CARA
// ------------------------------
function drawFaceMask() {
  if (poses.length === 0) return;

  let keypoints = poses[0].keypoints;

  let leftEye = keypoints.find(k => k.name === "left_eye");
  let rightEye = keypoints.find(k => k.name === "right_eye");
  let nose = keypoints.find(k => k.name === "nose");

  if (!leftEye || !rightEye || !nose) return;

  let faceX = (leftEye.x + rightEye.x) / 2 - 80;
  let faceY = nose.y - 80;

  fill(0);
  noStroke();
  rect(faceX, faceY, 160, 160);
}

// ------------------------------
//   TEMPORIZADOR SOLO DE 5s
// ------------------------------
function timerLogic() {
  if (photoTaken) return;

  let sec = floor(millis() / 1000);

  if (sec !== lastSecond) {
    lastSecond = sec;
    countdown--;

    if (countdown <= 0) {
      takePhoto();
      photoTaken = true;
      return;
    }
  }

  showBigText(countdown);
}

function showBigText(t) {
  fill(255);
  stroke(0);
  strokeWeight(4);
  textSize(100);
  textAlign(CENTER, CENTER);
  text(t, width / 2, height / 2);
}



// ------------------------------
//   SUBIR FOTO A SUPABASE
// ------------------------------
async function takePhoto() {
  const canvas = document.querySelector("canvas");

  canvas.toBlob(async (blob) => {
    const fileName = `foto_${Date.now()}.png`;

    const { data, error } = await supabaseClient
      .storage
      .from(BUCKET_NAME)
      .upload(fileName, blob, {
        contentType: "image/png",
        upsert: true
      });

    if (error) {
      console.error("Error subiendo imagen:", error);
    } else {
      console.log("Imagen subida:", data);
    }
  }, "image/png");
}
