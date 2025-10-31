let video;
let bodySegmenter;
let segmentationImage;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Activar cámara
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  // Cargar modelo de segmentación
  bodySegmenter = ml5.bodySegmentation('SelfieSegmentation', modelReady);
}

function modelReady() {
  console.log("BodySegmentation listo");
  segmentVideo();
}

function segmentVideo() {
  bodySegmenter.segment(video, gotResults);
}

function gotResults(error, result) {
  if (error) {
    console.error(error);
    return;
  }

  segmentationImage = result.segmentationMask;
  segmentVideo();
}

function draw() {
  background(0);

  // Dibujar la cámara
  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);
  pop();

  if (segmentationImage) {
    // Dibujar sobre el video solo donde hay cuerpo
    segmentationImage.loadPixels();
    loadPixels(); // cargar los píxeles del canvas

    for (let y = 0; y < segmentationImage.height; y++) {
      for (let x = 0; x < segmentationImage.width; x++) {
        let i = (y * segmentationImage.width + x) * 4;
        let alpha = segmentationImage.pixels[i]; // la máscara

        if (alpha > 127) {
          // índice del canvas escalado a video
          let canvasX = floor(x * width / segmentationImage.width);
          let canvasY = floor(y * height / segmentationImage.height);
          let ci = (canvasY * width + canvasX) * 4;

          pixels[ci + 0] = 255; // R
          pixels[ci + 1] = 182; // G
          pixels[ci + 2] = 193; // B (rosa pastel)
          pixels[ci + 3] = 255; // opaco
        }
      }
    }

    updatePixels();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
