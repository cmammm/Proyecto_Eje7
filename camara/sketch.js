let video, bodyPose, poses = [];

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Activar cámara (baja resolución = mejor rendimiento)
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  // Cargar modelo BodyPose (modo espejo activado)
  bodyPose = ml5.bodyPose(video, { flipped: true }, modelReady);
}

function modelReady() {
  console.log("✅ BodyPose cargado correctamente");
  detectPose(); // inicia detección controlada
}

function detectPose() {
  bodyPose.detect(video, (results) => {
    poses = results;
    detectPose(); // vuelve a detectar al terminar (fluido y sin lag)
  });
}

function draw() {
  background(0);
  image(video, 0, 0, width, height);

  if (poses.length > 0) {
    let pose = poses[0];

    // Dibuja puntos
    noStroke();
    fill(255, 182, 193);
    for (let kp of pose.keypoints) {
      if (kp.confidence > 0.5) ellipse(kp.x, kp.y, 10, 10);
    }

    // Dibuja conexiones
    stroke(255, 182, 193);
    strokeWeight(3);
    for (let [a, b] of pose.skeleton) {
      line(a.x, a.y, b.x, b.y);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
