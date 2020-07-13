import { Fluid } from "./dynamics";
import { on } from "./events";

const { hypot, max } = Math;
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

// const pixel = (x: number, y: number) => y * w * 4 + x * 4;

let input = { x: 0, y: 0, dx: 0, dy: 0, ox: 0, oy: 0, len: 0 };

on(window, "mousemove", (event) => {
  if (!event.buttons) {
    input = { x: 0, y: 0, dx: 0, dy: 0, ox: 0, oy: 0, len: 0 };
    return;
  }

  const { clientX: x, clientY: y, movementX: dx, movementY: dy } = event;
  const [ox, oy, len] = [x - dx, y - dy, max(1, (hypot(dx, dy) + 0.5) | 0)];

  input = { x, y, dx, dy, ox, oy, len };
});

const fluid = new Fluid();
fluid.setUpdateCallback((f) => {
  for (let i = 0; i < input.len; ++i) {
    const px = (input.ox + input.dx * (i / input.len)) | 0;
    const py = (input.oy + input.dy * (i / input.len)) | 0;

    f.setVelocity(px, py, input.dx, input.dy);
    f.setDensity(px, py, 25);
  }
});
fluid.setRenderCallback((f) => {
  bufferData.fill(0);

  for (let x = 0; x < w; ++x) {
    for (let y = 0; y < h; ++y) {
      bufferData[4 * (y * w + x) + 3] = f.getDensity(x, y) * 255;
    }
  }

  bufferContext.putImageData(bufferImageData, 0, 0);
  canvasContext.drawImage(buffer, 0, 0);
});
fluid.setResolution(w, h);

const tick = (t: DOMHighResTimeStamp) => {
  raf(tick);

  canvasContext.fillStyle = `hsl(${(t / 100) % 360}, 50%, 90%)`;
  canvasContext.fillRect(0, 0, w, h);

  fluid.step();

  debug.innerText = JSON.stringify({}, null, 2);
};

raf(tick);
