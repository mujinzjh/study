/*
 * @Author: mujinzjh
 * @Description:
 * @Date: 2023-10-27 19:45:11
 * @LastEditTime: 2023-10-27 22:32:23
 * @FilePath: \Canvas\音频可视化\js\index.js
 */

const CVS = document.querySelector("canvas"); // 获取canvas

const audioEle = document.querySelector("audio"); // 获取音乐节点

const ctx = CVS.getContext("2d");

let grd = ctx.createLinearGradient(0, 0, 0, 150);
grd.addColorStop(0, "#00dbde");
grd.addColorStop(0.8, "#fccb90");
grd.addColorStop(1, "#fc00ff");

function initCanvas() {
  CVS.width = document.body.clientWidth;
  CVS.height = window.innerHeight - 60 - audioEle.clientHeight;
}

initCanvas();


// ctx.fillStyle = grd;
// ctx.fillRect(
//   0,
//   0,
//   10,
//   250
// );

let isInit = false;
let analyser, buffer;

// navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
//   if (isInit) {
//     return;
//   }
//   const audioCtx = new AudioContext();
//   // 创建一个分析器节点
//   analyser = audioCtx.createAnalyser();
//   analyser.fftSize = 512;
//   buffer = new Uint8Array(analyser.frequencyBinCount);
//   // 创建一个源节点
//   const source = audioCtx.createMediaStreamSource(stream);
//   source.connect(analyser);
//   // analyser.connect(audioCtx.destination);
//   isInit = true;
// });

audioEle.onplay = () => {
  if (isInit) {
    return;
  }
  const audioCtx = new AudioContext();
  // 创建一个分析器节点
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 512;
  buffer = new Uint8Array(analyser.frequencyBinCount);
  // 创建一个源节点
  const source = audioCtx.createMediaElementSource(audioEle);
  source.connect(analyser);
  analyser.connect(audioCtx.destination);
  isInit = true;
};

const drawCanvas = (dataArray) => {
  const { width, height } = CVS;
  ctx.clearRect(0, 0, width, height);
  const len = dataArray.length / 1.5;
  const barWidth = width / (len * 2);
  for (let i = 0; i < dataArray.length; i++) {
    let data = dataArray[i];
    let barHeight = (data / 256) * height;
    let x = width / 2 + i * barWidth;
    let x1 = width / 2 - (i + 1) * barWidth;
    let y = height - barHeight;
    ctx.fillStyle = grd;
    ctx.fillRect(x, y, barWidth - 2, barHeight);
    ctx.fillRect(x1, y, barWidth - 2, barHeight);
  }
};
drawCanvas(canvas);

function draw() {
  requestAnimationFrame(draw);
  if (!isInit) {
    return;
  }
  analyser.getByteFrequencyData(buffer);
  drawCanvas(buffer);
}

draw();
