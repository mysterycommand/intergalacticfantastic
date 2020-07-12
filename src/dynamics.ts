const { abs, max, min, sqrt } = Math;

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
  private q: number = -0.5 / sqrt(this.w * this.h);
  private hw: number = this.w / 2;
  private hh: number = this.h / 2;
  private iw: number = this.w * this.ii;
  private ih: number = this.h * this.ii;

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
      this.bDensities[cell] = 25;
    }
  }

  private addTo(as: number[], bs: number[]) {
    for (let i = 0; i < this.size; ++i) {
      as[i] += bs[i] * this.ii;
    }
  }

  private diffuse(as: number[], bs: number[]) {
    for (let j = 1; j <= this.h; ++j) {
      let index = j * this.cols;
      ++index;

      for (let i = 0; i < this.w; ++i) {
        as[index] = bs[index];
        ++index;
      }
    }
  }

  private solve(xs: number[], ys: number[]) {
    for (let k = 0; k < this.iterations; ++k) {
      for (let j = 1; j <= this.h; ++j) {
        let prevRowIndex = (j - 1) * this.cols;
        let currRowIndex = j * this.cols;
        let nextRowIndex = (j + 1) * this.cols;

        let x = xs[currRowIndex];
        ++currRowIndex;

        for (let i = 1; i <= this.w; ++i) {
          x = xs[currRowIndex] =
            (ys[currRowIndex] +
              (x +
                xs[++currRowIndex] +
                xs[++prevRowIndex] +
                xs[++nextRowIndex])) *
            0.25;
        }
      }
    }
  }

  private project(axs: number[], ays: number[], bxs: number[], bys: number[]) {
    for (let j = 1; j <= this.h; ++j) {
      let prevRowIndex = (j - 1) * this.cols;
      let currRowIndex = j * this.cols;
      let nextRowIndex = (j + 1) * this.cols;

      let prevIndex = currRowIndex - 1;
      let nextIndex = currRowIndex + 1;

      for (let i = 1; i <= this.w; ++i) {
        bys[++currRowIndex] =
          this.q *
          (axs[++nextIndex] -
            axs[++prevIndex] +
            ays[++nextRowIndex] -
            ays[++prevRowIndex]);
        bxs[currRowIndex] = 0;
      }
    }

    this.solve(bxs, bys);

    for (let j = 1; j <= this.h; ++j) {
      let prevRowIndex = (j - 1) * this.cols;
      let currRowIndex = j * this.cols;
      let nextRowIndex = (j + 1) * this.cols;

      let prevIndex = currRowIndex - 1;
      let currIndex = currRowIndex;
      let nextIndex = currRowIndex + 1;

      for (let i = 1; i <= this.w; ++i) {
        axs[++currIndex] -= this.hw * (bxs[++nextIndex] - bxs[++prevIndex]);
        ays[currIndex] -= this.hh * (bxs[++nextRowIndex] - bxs[++prevRowIndex]);
      }
    }
  }

  private advect(as: number[], bs: number[], xs: number[], ys: number[]) {
    for (let j = 1; j <= this.h; ++j) {
      let currRowIndex = j * this.cols;

      for (let i = 1; i <= this.w; ++i) {
        let x = min(max(0.5, i - this.iw * xs[++currRowIndex]), this.hw);
        let y = min(max(0.5, j - this.ih * ys[currRowIndex]), this.hh);

        let i0 = x | 0;
        let i1 = i0 + 1;

        let j0 = y | 0;
        let j1 = j0 + 1;

        let s1 = x - i0;
        let s0 = 1 - s1;

        let t1 = y - j0;
        let t0 = 1 - t1;

        let r1 = j0 * this.cols;
        let r2 = j1 * this.cols;

        as[currRowIndex] =
          s0 * (t0 * bs[i0 + r1] + t1 * bs[i0 + r2]) +
          s1 * (t0 * bs[i1 + r1] + t1 * bs[i1 + r2]);
      }
    }
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

        // data[offset + 0] = 0;
        // data[offset + 1] = 0;
        // data[offset + 2] = 0;
        data[offset + 3] = this.aDensities[cell];
      }
    }
  }
}
