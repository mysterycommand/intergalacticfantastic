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

  private iterations: number = 10;
  private ii: number = 1 / this.iterations;

  constructor(readonly w: number, readonly h: number) {
    this.cols = w + 2;
    this.rows = h + 2;
    this.size = this.cols * this.rows;
  }

  public step(input: Input, data: Uint8ClampedArray) {
    this.queryUi(input);

    this.velocities(
      this.aVelocitiesX,
      this.aVelocitiesY,
      this.bVelocitiesX,
      this.bVelocitiesY
    );
    this.densities(
      this.aDensities,
      this.bDensities,
      this.aVelocitiesX,
      this.aVelocitiesY
    );

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

  private addTo(as: number[], bs: number[]) {
    for (let i = 0; i < this.size; ++i) {
      as[i] += bs[i] * this.ii;
    }
  }

  private diffuse(as: number[], bs: number[]) {
    // hi
  }

  private project(axs: number[], ays: number[], bxs: number[], bys: number[]) {
    // hi
  }

  private advect(as: number[], bs: number[], xs: number[], ys: number[]) {
    // hi
  }

  private velocities(
    axs: number[],
    ays: number[],
    bxs: number[],
    bys: number[]
  ) {
    this.addTo(axs, bxs);
    this.addTo(ays, bys);

    // swap
    [axs, bxs] = [bxs, axs];
    [ays, bys] = [bys, ays];

    // diffuse
    this.diffuse(axs, bxs);
    // diffuse
    this.diffuse(ays, bys);
    // project
    this.project(axs, ays, bxs, bys);

    // swap
    [axs, bxs] = [bxs, axs];
    [ays, bys] = [bys, ays];

    // advect
    this.advect(axs, bxs, bxs, bys);
    // advect
    this.advect(ays, bys, bxs, bys);
    // project
    this.project(axs, ays, bxs, bys);
  }

  private densities(
    ads: number[],
    bds: number[],
    axs: number[],
    ays: number[]
  ) {
    this.addTo(ads, bds);

    // swap
    [ads, bds] = [bds, ads];

    // diffuse
    this.diffuse(ads, bds);
    // advect
    this.advect(ads, bds, axs, ays);
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
