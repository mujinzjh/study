const canvas = document.querySelector("canvas");

const ctx = canvas.getContext("2d");

const init = () => {
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
};

init();

const fontSize = 14 * devicePixelRatio;
ctx.font = `${fontSize}px "Times New Roman"`;
const columnCount = Math.floor(canvas.width / fontSize);
const charIndex = new Array(columnCount).fill(0);

const draw = () => {
  ctx.fillStyle = "rgba(0, 0, 0,0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#6be445";
  ctx.textBaseline = "top";
  for (let i = 0; i < columnCount; i++) {
    const text = getRandomChar();
    const x = i * fontSize;
    const y = charIndex[i] * fontSize;
    ctx.fillText(text, x, y);
    if (y > canvas.height && Math.random() > 0.99) {
      charIndex[i] = 0;
    } else {
      charIndex[i]++;
    }
  }
};

const getRandomChar = () => {
  const str = "01234567890abcdefghijklmnopqrstuvwxyz";
  return str[Math.floor(Math.random() * str.length)];
};

draw();

setInterval(draw, 50);
