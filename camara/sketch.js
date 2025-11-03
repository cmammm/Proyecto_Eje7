let video, bodyPose, poses = [];

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Activar cámara
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  // Cargar modelo BodyPose
  bodyPose = ml5.bodyPose(video, { flipped: false }, modelReady);
}

function modelReady() {
  console.log("✅ BodyPose cargado correctamente");
  bodyPose.detectStart(video, gotPoses);
}

function gotPoses(results) {
  poses = results;
}

function draw() {
  background(0);

  // Mostrar cámara en espejo
  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);
  pop();

  // Si detecta cuerpo → dibuja esqueleto
  if (poses.length > 0) {
    let pose = poses[0];

    // Puntos clave
    noStroke();
    fill(255, 182, 193); // rosa pastel 💖
    for (let kp of pose.keypoints) {
      if (kp.confidence > 0.5) {
        ellipse(width - kp.x, kp.y, 10, 10);
      }
    }

    // Conexiones (esqueleto)
    stroke(255, 182, 193);
    strokeWeight(3);
    for (let [a, b] of pose.skeleton) {
      line(width - a.x, a.y, width - b.x, b.y);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}