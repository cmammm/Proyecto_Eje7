let letras = [];
let curvasActivas = [];
let escala = 1.25;

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.parent("canvas-container");
  background(234, 228, 218);

  generarLetras();

  for (let i = 0; i < letras.length; i++) {
    for (let c of letras[i]) {
      curvasActivas.push({ ...c, progress: 0 });
    }
  }
}

function draw() {
  background(234, 228, 218, 20);
  noFill();
  stroke(0, 120);
  strokeWeight(4);

  push();
  translate(width * 0.1, height * 0.05); 
  scale(escala);
  translate(-width * 0.1, -height * 0.05);

  push();
  // CENTRAR en la pantalla
  translate(width / 2, height / 2);
  scale(escala);
  translate(-width / 2, -height / 2);
  
  let step = 0.02;

  for (let c of curvasActivas) {
    if (c.progress < 1) {
      let t1 = c.progress;
      let t2 = min(1, t1 + step);

      let x1 = bezierPoint(c.x1, c.x2, c.x3, c.x4, t1);
      let y1 = bezierPoint(c.y1, c.y2, c.y3, c.y4, t1);
      let x2 = bezierPoint(c.x1, c.x2, c.x3, c.x4, t2);
      let y2 = bezierPoint(c.y1, c.y2, c.y3, c.y4, t2);

      line(x1, y1, x2, y2);

      c.progress += step;
    }
  }

  pop();
}

function generarLetras() {
  let baseX = width * 0.15;
  let baseY = height * 0.55;
  let espacio = 160;

  // ---- LETRA S ----
  letras.push([
    curva(baseX, baseY, baseX-40, baseY-120, baseX+40, baseY-120, baseX, baseY-20),
    curva(baseX, baseY-20, baseX+40, baseY+80, baseX-40, baseY+80, baseX, baseY)
  ]);

  // I
  letras.push([
    curva(baseX+espacio, baseY-120, baseX+espacio, baseY+120, baseX+espacio, baseY+120, baseX+espacio, baseY-120)
  ]);

  // G
  letras.push([
    curva(baseX+2*espacio, baseY, baseX+2*espacio-80, baseY-120, baseX+2*espacio+80, baseY-120, baseX+2*espacio, baseY),
    curva(baseX+2*espacio, baseY, baseX+2*espacio+40, baseY, baseX+2*espacio+40, baseY, baseX+2*espacio+20, baseY-40)
  ]);

  // U
  letras.push([
    curva(baseX+3*espacio, baseY-120, baseX+3*espacio-60, baseY+80, baseX+3*espacio+60, baseY+80, baseX+3*espacio, baseY-120)
  ]);

  // E
  letras.push([
    curva(baseX+4*espacio, baseY-120, baseX+4*espacio-60, baseY-120, baseX+4*espacio-60, baseY+120, baseX+4*espacio, baseY+120),
    curva(baseX+4*espacio, baseY, baseX+4*espacio-40, baseY, baseX+4*espacio-40, baseY, baseX+4*espacio, baseY)
  ]);

  // S
  letras.push([
    curva(baseX+5*espacio, baseY, baseX+5*espacio-40, baseY-120, baseX+5*espacio+40, baseY-120, baseX+5*espacio, baseY-20),
    curva(baseX+5*espacio, baseY-20, baseX+5*espacio+40, baseY+80, baseX+5*espacio-40, baseY+80, baseX+5*espacio, baseY)
  ]);

  letras.push([]); // espacio

  // T
  letras.push([
    curva(baseX+7*espacio, baseY-120, baseX+7*espacio+100, baseY-120, baseX+7*espacio-100, baseY-120, baseX+7*espacio+100, baseY-120),
    curva(baseX+7*espacio, baseY-120, baseX+7*espacio, baseY+120, baseX+7*espacio, baseY+120, baseX+7*espacio, baseY-120)
  ]);

  // Ú
  letras.push([
    curva(baseX+8*espacio, baseY-120, baseX+8*espacio-60, baseY+80, baseX+8*espacio+60, baseY+80, baseX+8*espacio, baseY-120),
    curva(baseX+8*espacio-20, baseY-150, baseX+8*espacio+20, baseY-150, baseX+8*espacio+20, baseY-150, baseX+8*espacio-20, baseY-150)
  ]);
}

function curva(x1, y1, x2, y2, x3, y3, x4, y4) {
  return { x1, y1, x2, y2, x3, y3, x4, y4 };
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  letras = [];
  curvasActivas = [];
  generarLetras();
}
