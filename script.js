let curves = [];

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.parent("canvas-container");
  background(234, 228, 218);

  for (let i = 0; i < 10; i++) {
    curves.push(nuevaCurva());
  }
}

function draw() {
  // --- Curvas que se dibujan lentamente ---
  noFill();
  strokeWeight(3);

  for (let c of curves) {
    stroke(c.col);

    if (c.progress < 1) {
      let step = 0.002;
      let t1 = c.progress;
      let t2 = c.progress + step;
      if (t2 > 1) t2 = 1;
      line(
        bezierPoint(c.x1, c.x2, c.x3, c.x4, t1),
        bezierPoint(c.y1, c.y2, c.y3, c.y4, t1),
        bezierPoint(c.x1, c.x2, c.x3, c.x4, t2),
        bezierPoint(c.y1, c.y2, c.y3, c.y4, t2)
      );
      c.progress += step;
    } else {
      Object.assign(c, nuevaCurva());
    }
  }
}

// Genera una nueva curva aleatoria
function nuevaCurva() {
  return {
    x1: random(width),
    y1: random(height),
    x2: random(width),
    y2: random(height),
    x3: random(width),
    y3: random(height),
    x4: random(width),
    y4: random(height),
    progress: 0,
    col: color(random(100,255), random(100,255), random(100,255), 120)
  };
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
