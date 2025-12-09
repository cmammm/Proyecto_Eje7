// ------------------------------
//  SUPABASE
// ------------------------------
const SUPABASE_URL = "https://tqtcyphinjsqxuadxtwj.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdGN5cGhpbmpzcXh1YWR4dHdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MDE0MzUsImV4cCI6MjA3NzQ3NzQzNX0.MlgyjJM67TvOaDnL0V_As3IpZ8EkoofQBNa8jrEkp3E";
const BUCKET_NAME = "fotos";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ------------------------------
//  VARIABLES
// ------------------------------
let video;
let videoReady = false;

let scratchLayer;
let circleLayer;

let strokes = [];
let circles = [];

let maxStrokes = 40;
let maxCircles = 25;

// TEMPORIZADOR
let waitTime = 3;
let countdown = 5;
let startWait = true;
let startCountdown = false;
let lastSecond = 0;
let photoTaken = false;
let canvas;





function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO, { flipped: true });
  video.size(windowWidth, windowHeight);
  video.hide();

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

  image(video, 0, 0, width, height);

  updateCircles();
  drawCircles();
  image(circleLayer, 0, 0);

  updateStrokes();
  drawStrokes();

  timerLogic();
}




//   Círculos
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
      col: color(0, 0, 0, 200)
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
    circleLayer.fill(0, 0, 0, c.alpha);
    circleLayer.ellipse(c.x, c.y, c.size);
  }
}






//   Trazos
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




//   TempFoto
function timerLogic() {
  if (photoTaken) return;

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
        takePhoto();
        photoTaken = true;
      }
    }
  }

  if (startWait) showBigText("Espera...");
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





//   TOMAR FOTO Y SUBIR A SUPABASE
async function takePhoto() {
  canvas.elt.toBlob(async function(blob) {
    const filename = `foto_${Date.now()}.png`;
    const filePath = `${filename}`;

    const { data, error } = await supabaseClient
      .storage
      .from(BUCKET_NAME)
      .upload(filePath, blob, {
        cacheControl: '3600',
        upsert: true,
        contentType: 'image/png'
      });

    if (error) {
      console.error("Error al subir foto:", error);
      alert('Error al subir foto: ' + error.message);
    } else {
      console.log("Foto subida correctamente:", data);
      alert("¡Foto tomada y subida a Supabase!");
    }
  }, 'image/png');
}
