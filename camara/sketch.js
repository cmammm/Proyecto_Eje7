let bodyPose;
let video;
let poses = [];
let connections;
let painting;

function preload() {
  // Load the bodyPose model
  bodyPose = ml5.bodyPose({flipped: true});
}

function mousePressed() {
  console.log(poses);
}

function setup() {
  // Lienzo de pantalla
  createCanvas(windowWidth, windowHeight);
  // Crea una capa para gráficos
  painting = createGraphics(windowWidth, windowHeight);
  painting.clear();
  // Crea el video y lo esconde
  video = createCapture(VIDEO, {flipped: true});
  video.size(windowWidth, windowHeight);
  video.hide();
  // Inicia la detección de poses en el video de la webcam
  bodyPose.detectStart(video, gotPoses);
  // Obtiene la información de las conexiones del esqueleto
  connections = bodyPose.getSkeleton();
}

// Callback function para cuando el modelo devuelve los datos de la pose
function gotPoses(results) {
  // Almacena los resultados del modelo en una variable global
  poses = results;
}

function draw() {
  // Muestra el video
  image(video, 0, 0, width, height);
  
  // Dibuja el esqueleto (líneas entre puntos clave)
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i];
    for (let j = 0; j < connections.length; j++) {
      let pointAIndex = connections[j][0];
      let pointBIndex = connections[j][1];
      let pointA = pose.keypoints[pointAIndex];
      let pointB = pose.keypoints[pointBIndex];
      
      // Solo dibuja una línea si ambos puntos tienen una alta confianza
      if (pointA.confidence > 0.1 && pointB.confidence > 0.1) {
        stroke(255, 0, 0); // Color rojo para las conexiones
        strokeWeight(2);
        line(pointA.x, pointA.y, pointB.x, pointB.y);
      }
    }

    // Dibuja los puntos clave del cuerpo
    for (let j = 0; j < pose.keypoints.length; j++) {
      let keypoint = pose.keypoints[j];
      if (keypoint.confidence > 0.1) {
        fill(0, 255, 0); // Color verde para los puntos
        noStroke();
        circle(keypoint.x, keypoint.y, 10);
      }
    }
  }

  // Aquí colocamos nuestra capa para dibujar hecha con createGraphics
  image(painting, 0, 0);
}
