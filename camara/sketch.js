let bodyPose;
let video;
let poses = [];

let startDelay = 5000;
let countdown = 10;
let lastSecond = 0;

let countdownStarted = false;
let photoTaken = false;
let capturedImage;

// 👉 VIDEO FILTRO
let filtro;

function preload() {
  bodyPose = ml5.bodyPose({ flipped: true });

  filtro = createVideo("assets/Fondocam.mp4");
  filtro.hide();
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  //Cámara
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  //iniciar bodypose
  bodyPose.detectStart(video, gotPoses);

  //reproducir filtro encima
  filtro.loop();
  filtro.volume(0);

  textAlign(CENTER, CENTER);
  textSize(64);

  //espera 5s y luego activa el contador
  setTimeout(() => {
    countdownStarted = true;
    lastSecond = millis();
  }, startDelay);
}

function gotPoses(results) {
  poses = results;
}

function draw() {
  background(0);

  //Cámara
  image(video, 0, 0, width, height);

  //Filtro
  image(filtro, 0, 0, width, height);

  //cuadro
  drawFaceBox();

  //contador
  if (countdownStarted && !photoTaken) {
    if (millis() - lastSecond > 1000) {
      countdown--;
      lastSecond = millis();
    }

    fill(255, 80, 120);
    textSize(100);
    text(countdown, width / 2, height / 2);

    if (countdown <= 0) {
      takePhoto();
      photoTaken = true;
    }
  }

  //MOSTRAR FOTO TOMADA
  if (photoTaken && capturedImage) {
    image(capturedImage, 0, 0, width, height);

    fill(255);
    textSize(48);
    text("📸 Foto tomada", width / 2, height - 80);
  }
}

function drawFaceBox() {
  if (poses.length > 0) {
    let keypoints = poses[0].keypoints;

    let leftEye = keypoints.find(k => k.name === "left_eye");
    let rightEye = keypoints.find(k => k.name === "right_eye");
    let nose = keypoints.find(k => k.name === "nose");

    if (
      leftEye && rightEye && nose &&
      leftEye.confidence > 0.1 &&
      rightEye.confidence > 0.1 &&
      nose.confidence > 0.1
    ) {
      // distancia entre ojos → tamaño del cuadro
      let faceW = dist(leftEye.x, leftEye.y, rightEye.x, rightEye.y) * 2.2;
      let faceH = faceW * 1.3;

      let centerX = (leftEye.x + rightEye.x) / 2;
      let centerY = (leftEye.y + rightEye.y) / 2 - faceH * 0.25;

      noFill();
      stroke(0, 255, 255);
      strokeWeight(4);
      rect(centerX - faceW / 2, centerY - faceH / 2, faceW, faceH);
    }
  }
}

function takePhoto() {
  capturedImage = get();
  console.log("Foto tomada.");
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
