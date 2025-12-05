const SUPABASE_URL = "https://tqtcyphinjsqxuadxtwj.supabase.co";               // ⬅️ reemplaza
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdGN5cGhpbmpzcXh1YWR4dHdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MDE0MzUsImV4cCI6MjA3NzQ3NzQzNX0.MlgyjJM67TvOaDnL0V_As3IpZ8EkoofQBNa8jrEkp3E";   // ⬅️ reemplaza
const BUCKET_NAME = "fotos";              // ⬅️ reemplaza

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);


let video;
let waitTime = 5;
let countdown = 5;
let startWait = true;
let startCountdown = false;
let photoTaken = false;
let lastSecond = 0;

let scratchLayer;
let strokes = [];
let maxStrokes = 40;

let cameraReady = false;


function setup() {
  createCanvas(windowWidth, windowHeight);

  scratchLayer = createGraphics(windowWidth, windowHeight);
  scratchLayer.clear();

  video = createCapture(VIDEO, () => {
    cameraReady = true;
  });
  video.size(width, height);
  video.hide();
}


function draw() {
  if (!cameraReady) {
    background(200);
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(32);
    text("Cargando cámara…", width/2, height/2);
    return;
  }

  background(255);

  image(video, 0, 0, width, height);

  updateStrokes();
  drawStrokes();

  timerLogic();
}


function updateStrokes() {
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

  for (let i = strokes.length - 1; i >= 0; i--) {
    let s = strokes[i];
    s.prevX = s.x;
    s.prevY = s.y;

    s.vx += random(-0.2, 0.2);
    s.vy += random(-0.2, 0.2);

    s.x += s.vx;
    s.y += s.vy;

    s.x = constrain(s.x, 0, width);
    s.y = constrain(s.y, 0, height);

    s.life--;
    if (s.life <= 0) strokes.splice(i, 1);
  }
}

function drawStrokes() {
  scratchLayer.fill(255, 255, 255, 20);
  scratchLayer.noStroke();
  scratchLayer.rect(0, 0, width, height);

  for (let s of strokes) {
    scratchLayer.stroke(s.color);
    scratchLayer.strokeWeight(s.weight);
    scratchLayer.line(s.prevX, s.prevY, s.x, s.y);
  }

  image(scratchLayer, 0, 0);
}


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


function showBigText(msg) {
  push();
  fill(0);
  noStroke();
  textSize(120);
  textAlign(CENTER, CENTER);
  text(msg, width/2, height/2);
  pop();
}


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

      // obtener URL pública (opcional)
      const { data: urlData } = supabaseClient
        .storage
        .from(BUCKET_NAME)
        .getPublicUrl(fileName);

      console.log("URL pública:", urlData.publicUrl);
    }

  }, "image/png");
}
