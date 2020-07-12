const { abs, min } = Math;

export interface Input {
  x: number;
  y: number;
  dx: number;
  dy: number;
  ox: number;
  oy: number;
  len: number;
}

export class Dynamics {
  readonly cols: number;
  readonly rows: number;
  readonly size: number;

  private aDensities: number[] = new Array(this.size).fill(0);
  private bDensities: number[] = Array.from(this.aDensities);

  private aVelocitiesX: number[] = new Array(this.size).fill(0);
  private bVelocitiesX: number[] = Array.from(this.aVelocitiesX);

  private aVelocitiesY: number[] = new Array(this.size).fill(0);
  private bVelocitiesY: number[] = Array.from(this.aVelocitiesY);

  constructor(readonly w: number, readonly h: number) {
    this.cols = w + 2;
    this.rows = h + 2;
    this.size = this.cols * this.rows;
  }

  public step(input: Input, data: Uint8ClampedArray) {
    this.queryUi(input);
    this.render(data);
  }

  private cell(x: number, y: number) {
    return y * this.cols + x;
  }

  private queryUi(input: Input) {
    this.bVelocitiesX.fill(0);
    this.bVelocitiesY.fill(0);
    this.bDensities.fill(0);

    for (let i = 0; i < input.len ?? 0; ++i) {
      const px = (input.ox + input.dx * (i / input.len)) | 0;
      const py = (input.oy + input.dy * (i / input.len)) | 0;

      const cell = this.cell(px, py);

      this.bVelocitiesX[cell] = input.dx;
      this.bVelocitiesY[cell] = input.dy;
      this.bDensities[cell] = 255;
    }
  }

  private render(data: Uint8ClampedArray) {
    data.fill(0);

    for (let i = 0; i < this.w; ++i) {
      for (let j = 0; j < this.h; ++j) {
        const offset = 4 * (j * this.w + i);
        const cell = this.cell(i, j);

        data[offset + 0] = 0;
        data[offset + 1] = min(abs(this.bVelocitiesX[cell]), 255);
        data[offset + 2] = min(abs(this.bVelocitiesY[cell]), 255);
        data[offset + 3] = this.bDensities[cell];
      }
    }
  }
}
