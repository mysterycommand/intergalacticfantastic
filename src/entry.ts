const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const canvasContext = canvas.getContext("2d")!;

const { innerWidth: w, innerHeight: h, requestAnimationFrame: raf } = window;

canvas.width = w;
canvas.height = h;

const buffer = canvas.cloneNode() as HTMLCanvasElement;
const bufferContext = buffer.getContext("2d")!;
const bufferImageData = bufferContext.createImageData(w, h);
const { data: bufferData } = bufferImageData;

const tick = (t: DOMHighResTimeStamp) => {
  raf(tick);

  canvasContext.fillStyle = `hsl(${(t / 100) % 360}, 50%, 90%)`;
  canvasContext.fillRect(0, 0, w, h);

  bufferContext.putImageData(bufferImageData, 0, 0);
  canvasContext.drawImage(buffer, 0, 0);
};

raf(tick);
