import { on } from "./events";

const { abs, hypot, max, min } = Math;
const { innerWidth: w, innerHeight: h, requestAnimationFrame: raf } = window;

const debug = document.querySelector("pre") as HTMLPreElement;
const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const canvasContext = canvas.getContext("2d")!;

canvas.width = w;
canvas.height = h;

const buffer = canvas.cloneNode() as HTMLCanvasElement;
const bufferContext = buffer.getContext("2d")!;
const bufferImageData = bufferContext.createImageData(w, h);
const { data: bufferData } = bufferImageData;
bufferData.fill(0);

const pixel = (x: number, y: number) => y * w * 4 + x * 4;

let maxDx = 0;
let maxDy = 0;

on(window, "mousemove", (event) => {
  if (!event.buttons) {
    return;
  }

  const { clientX: x, clientY: y, movementX: dx, movementY: dy } = event;
  const [ox, oy, len] = [x - dx, y - dy, max(1, (hypot(dx, dy) + 0.5) | 0)];

  maxDx = max(abs(dx), maxDx);
  maxDy = max(abs(dy), maxDy);

  for (let i = 0; i < len; ++i) {
    const px = (ox + dx * (i / len)) | 0;
    const py = (oy + dy * (i / len)) | 0;

    const offset = pixel(px, py);

    bufferData[offset + 0] = 0;
    bufferData[offset + 1] = min(abs(dx), 255);
    bufferData[offset + 2] = min(abs(dy), 255);
    bufferData[offset + 3] = 255;
  }
});

const tick = (t: DOMHighResTimeStamp) => {
  raf(tick);

  canvasContext.fillStyle = `hsl(${(t / 100) % 360}, 50%, 90%)`;
  canvasContext.fillRect(0, 0, w, h);

  bufferContext.putImageData(bufferImageData, 0, 0);
  canvasContext.drawImage(buffer, 0, 0);

  debug.innerText = JSON.stringify(
    {
      maxDx,
      maxDy,
    },
    null,
    2
  );
};

raf(tick);
