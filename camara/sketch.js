let bodyPose;
let video;
let poses = [];
let countdown = 10; // ⏳ segundos
let lastSecond = 0;
let capturedImage;
let photoTaken = false;

function preload() {
  bodyPose = ml5.bodyPose({ flipped: true });
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  bodyPose.detectStart(video, gotPoses);

  textAlign(CENTER, CENTER);
  textSize(64);
  fill(255);
}

function gotPoses(results) {
  poses = results;
}

function draw() {
  background(0);
  image(video, 0, 0, width, height);

  // 🕒 Contador visual
  if (!photoTaken) {
    if (millis() - lastSecond > 1000) {
      countdown--;
      lastSecond = millis();
    }

    textSize(100);
    fill(255, 150, 150);
    text(countdown, width / 2, height / 2);

    // Cuando el contador llega a 0 → tomar "foto"
    if (countdown <= 0) {
      takePhoto();
      photoTaken = true;
    }
  } else if (capturedImage) {
    // Mostrar la imagen tomada
    image(capturedImage, 0, 0, width, height);

    fill(255);
    textSize(48);
    text("Foto tomada", width / 2, height - 80);
  }
}

function takePhoto() {
  // Guarda una copia del canvas (foto)
  capturedImage = get();
  console.log("Foto tomada y guardada en variable 'capturedImage'");

  // Si quieres descargarla directamente:
  // saveCanvas("mi_foto", "png");
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
