let bodyPose;
let video;
let poses = [];
let connections;
let painting;
let img;


function preload() {
  // Load the bodyPose model
  bodyPose = ml5.bodyPose({flipped:true});
}


function mousePressed() {
  console.log(poses);
}


function setup() {
  //lienzo de pantalla
  createCanvas(windowWidth, windowHeight);
  // Creamos una capa para graficos
  img = new Image();
  img.src="assets/cat.png"
  painting = createGraphics (windowWidth, windowHeight);
  painting.clear();
  // Crea el video y lo esconde
  video = createCapture(VIDEO, {flipped:true});
  video.size(windowWidth, windowHeight);
  video.hide();
  // Start detecting poses in the webcam video
  bodyPose.detectStart(video, gotPoses);
  // Get the skeleton connection information
  connections = bodyPose.getSkeleton();
}



// Callback function for when the model returns pose data
function gotPoses(results) {
  // Store the model's results in a global variable
  poses = results;
}



function draw() {
  //estos son los cuadros que dividen la pantalla
  painting.noStroke();
  //cuadro arriba izquierda
  //painting.fill (197, 219, 213, 3);
  //painting.rect (width/2, 0, width/2, height/2);
  //cuadro arriba derecha
  //painting.fill (219, 160, 178, 3);
  //painting.rect (0, 0, width/2, height/2);
  //cuadro abajo izquierda
  //painting.fill (139, 163, 71, 3);
  //painting.rect (width/2, height/2, width/2, height/2);
  //cuadro abajo derecha
  //painting.fill (220, 105, 70, 3);
  //painting.rect (0, height/2, width/2, height/2);


  //cuadro arriba izquierda
  //painting.fill ('rgba(197, 219, 213, 0.4)');
  //painting.rect (width/2, 0, width/2, height/2);
  //cuadro arriba derecha
  //painting.fill('rgba(219, 160, 178, 0.4)');
  //painting.rect(0, 0, width/2, height/2);
  //cuadro abajo izquierda
  //painting.fill ('rgba(139, 163, 71, 0.4)');
  //painting.rect (width/2, height/2, width/2, height/2);
  //cuadro abajo derecha
  //painting.fill('rgba(220, 105, 70, 0.4)');
  //painting.rect(0, height/2, width/2, height/2);

  //Display the video
  image(video, 0, 0, width, height);
  
  
  // Draw the skeleton connections
  /*for (let i = 0; i < poses.length; i++) {
    let pose = poses[i];
    for (let j = 0; j < connections.length; j++) {
      let pointAIndex = connections[j][0];
      let pointBIndex = connections[j][1];
      let pointA = pose.keypoints[pointAIndex];
      let pointB = pose.keypoints[pointBIndex];
      // Only draw a line if we have confidence in both points
      if (pointA.confidence > 0.1 && pointB.confidence > 0.1) {
        stroke(255, 0, 0);
        strokeWeight(2);
        line(pointA.x, pointA.y, pointB.x, pointB.y);
      }
    }
  }*/
  
  
  // Iterate through all the poses
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i];
    // Iterate through all the keypoints for each pose
    for (let j = 0; j < pose.keypoints.length; j++) {
      //let keypoint = pose.keypoints[j];
      let index1 = pose.keypoints[9];
      let index2 = pose.keypoints[10];
      // Only draw a circle if the keypoint's confidence is greater than 0.1
      /*if (keypoint.confidence > 0.1) {
        fill(0, 255, 0);
        noStroke();
        circle(keypoint.x, keypoint.y, 10);*/
        //mano 1
        if (index1.confidence > 0.1) {
          fill(0, 0, 0);
          noStroke();
          circle(index1.x, index1.y, 10);
        }

        if (index1.x > 0 && index1.y < height/2) {
          fill(255, 255, 0);
          //rect(width/2, (height/2)-130, 130, 130);
          textSize(100);
          //text('Izquierda', 0, (height/2)-130);
          drawingContext.drawImage(img, 400, 80);
        }

        //mano 2
          if (index2.confidence > 0.1) {
          fill(0, 0, 0);
          noStroke();
          circle(index2.x, index2.y, 10);
          }
  
        if (index2.x > width/2 && index2.y < height/2) {
          fill(0, 255, 255);
          //rect(0, (height/2)-130, 130, 130);
          //text('Derecha', width/2, (height/2)-130);
          textSize(60);
          text('miawww', index2.x, index2.y);
        }

    }
  }
  //Iqui colocamos nuestra capa para dibujar hecha con createGraphics
  image(painting, 0, 0);
}