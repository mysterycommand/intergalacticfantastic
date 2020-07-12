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

const pixel = (x: number, y: number) => y * w * 4 + x * 4;

let input: {
  x: number;
  y: number;
  dx: number;
  dy: number;
  ox: number;
  oy: number;
  len: number;
};

on(window, "mousemove", (event) => {
  if (!event.buttons) {
    input = { x: 0, y: 0, dx: 0, dy: 0, ox: 0, oy: 0, len: 0 };
    return;
  }

  const { clientX: x, clientY: y, movementX: dx, movementY: dy } = event;
  const [ox, oy, len] = [x - dx, y - dy, max(1, (hypot(dx, dy) + 0.5) | 0)];

  input = { x, y, dx, dy, ox, oy, len };
});

const tick = (t: DOMHighResTimeStamp) => {
  raf(tick);

  canvasContext.fillStyle = `hsl(${(t / 100) % 360}, 50%, 90%)`;
  canvasContext.fillRect(0, 0, w, h);

  bufferData.fill(0);
  for (let i = 0; i < input.len ?? 0; ++i) {
    const px = (input.ox + input.dx * (i / input.len)) | 0;
    const py = (input.oy + input.dy * (i / input.len)) | 0;

    const offset = pixel(px, py);

    bufferData[offset + 0] = 0;
    bufferData[offset + 1] = min(abs(input.dx), 255);
    bufferData[offset + 2] = min(abs(input.dy), 255);
    bufferData[offset + 3] = 255;
  }

  bufferContext.putImageData(bufferImageData, 0, 0);
  canvasContext.drawImage(buffer, 0, 0);

  debug.innerText = JSON.stringify({}, null, 2);
};

raf(tick);
