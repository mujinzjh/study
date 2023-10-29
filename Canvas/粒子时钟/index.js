const canvas = document.querySelector("canvas");

const ctx = canvas.getContext("2d", {
  willReadFrequently: true,
});

function initCanvas() {
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
}

initCanvas();

function getRandom(min, max) {
  return Math.floor(Math.random() * (max + 1 - min) + min);
}

class Particle {
  constructor() {
    const radius = Math.min(canvas.width, canvas.height) / 2;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const rad = (getRandom(0, 360) * Math.PI) / 180;
    this.x = cx + radius * Math.cos(rad);
    this.y = cy + radius * Math.sin(rad);
    this.r = getRandom(2 * devicePixelRatio, 7 * devicePixelRatio);
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = "#5445544d";
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
  }

  moveTo(tx, ty) {
    const duration = 500;
    const sx = this.x,
      sy = this.y;
    const xSpeed = (tx - sx) / duration;
    const ySpeed = (ty - sy) / duration;
    const startTime = Date.now();
    const _moveTo = () => {
      const diff = Date.now() - startTime;
      const x = xSpeed * diff + sx;
      const y = ySpeed * diff + sy;
      this.x = x;
      this.y = y;
      if (diff >= duration) {
        this.x = tx;
        this.y = ty;
        return;
      }
      requestAnimationFrame(_moveTo);
    };
    _moveTo();
    this.x = tx;
    this.y = ty;
  }
}

let text = null;
const particles = [];

function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function draw() {
  clear();
  update();
  particles.forEach((p) => p.draw());
  requestAnimationFrame(draw);
}

draw();

function getText() {
  return new Date().toTimeString().substring(0, 8);
}
function update() {
  const newText = getText();
  if (newText === text) {
    return;
  }
  // clear();
  text = newText;
  const { width, height } = canvas;
  ctx.fillStyle = "#000";
  ctx.textBaseline = "middle";
  ctx.font = `${140 * devicePixelRatio}px 'DS-Digital', sans-serif`;
  ctx.fillText(text, (width - ctx.measureText(text).width) / 2, height / 2);
  const points = getPoint();
  for (let k = 0; k < points.length; k++) {
    let p = particles[k];
    if (!p) {
      p = new Particle();
      particles.push(p);
    }
    const [x, y] = points[k];
    p.moveTo(x, y);
  }
  if (points.length < particles.length) {
    particles.splice(points.length);
  }
}

function getPoint() {
  const { width, height, data } = ctx.getImageData(
    0,
    0,
    canvas.width,
    canvas.height
  );
  const points = [];
  const gap = 4;
  for (let i = 0; i < width; i += gap) {
    for (let j = 0; j < height; j += gap) {
      const index = (j * width + i) * 4;
      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];
      const a = data[index + 3];
      if (r === 0 && g === 0 && b === 0 && a === 255) {
        points.push([i, j]);
      }
    }
  }
  return points;
}
