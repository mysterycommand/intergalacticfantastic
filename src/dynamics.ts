export class Fluid {
  // private variables
  _update: (field: Field) => {};
  _render: (field: Field) => {};
  _iterations = 10;
  dt = 0.1;
  _densities: number[];
  _oDensities: number[];
  _velocitiesX: number[];
  _oVelocitiesX: number[];
  _velocitiesY: number[];
  _oVelocitiesY: number[];
  _width: number;
  _height: number;
  _rowSize: number;
  _size: number;

  // public/privelaged methods
  setUpdateCallback(callback) {
    this._update = callback;
  }
  setRenderCallback = function (callback) {
    this._render = callback;
  };

  iterations() {
    return this._iterations;
  }
  setIterations(i) {
    if (0 < i && i <= 100) {
      this._iterations = i;
    }
  }

  setResolution(w, h) {
    var res = w * h;

    if (
      !(1 < res && res < 1_000_000) ||
      this._width === w ||
      this._height === h
    ) {
      throw new Error(`res too high: ${res}`);
    }

    this._width = w;
    this._height = h;
    this._reset();
  }

  step() {
    this._queryUI(this._oDensities, this._oVelocitiesX, this._oVelocitiesY);

    this._velocityStep(
      this._velocitiesX,
      this._velocitiesY,
      this._oVelocitiesX,
      this._oVelocitiesY,
      this.dt
    );
    this._densityStep(
      this._densities,
      this._oDensities,
      this._velocitiesX,
      this._velocitiesY,
      this.dt
    );

    this._render(
      new Field(
        this._densities,
        this._velocitiesX,
        this._velocitiesY,
        this._width,
        this._height,
        this._rowSize
      )
    );
  }

  // private methods
  _reset() {
    this._rowSize = this._width + 2;
    this._size = (this._width + 2) * (this._height + 2);

    this._densities = new Array(this._size);
    this._oDensities = new Array(this._size);

    this._velocitiesX = new Array(this._size);
    this._oVelocitiesX = new Array(this._size);

    this._velocitiesY = new Array(this._size);
    this._oVelocitiesY = new Array(this._size);

    for (var i = 0; i < this._size; i++) {
      this._oDensities[i] = this._oVelocitiesX[i] = this._oVelocitiesY[
        i
      ] = this._densities[i] = this._velocitiesX[i] = this._velocitiesY[i] = 0;
    }
  }

  _queryUI(d, u, v) {
    for (var i = 0; i < this._size; i++) {
      d[i] = u[i] = v[i] = 0.0;
    }

    this._update(new Field(d, u, v, this._width, this._height, this._rowSize));
  }

  _velocityStep(u, v, u0, v0, dt) {
    this._addFields(u, u0, dt);
    this._addFields(v, v0, dt);

    u = [u0, (u0 = u)][0];
    v = [v0, (v0 = v)][0];

    this._diffuse2(u, u0, v, v0, dt);
    this._project(u, v, u0, v0);

    u = [u0, (u0 = u)][0];
    v = [v0, (v0 = v)][0];

    this._advect(1, u, u0, u0, v0, dt);
    this._advect(2, v, v0, u0, v0, dt);

    this._project(u, v, u0, v0);
  }

  _densityStep(x, x0, u, v, dt) {
    this._addFields(x, x0, dt);
    this._diffuse(0, x0, x, dt);
    this._advect(0, x, x0, u, v, dt);
  }

  _addFields(x, s, dt) {
    for (var i = 0; i < this._size; ++i) {
      x[i] += dt * s[i];
    }
  }

  _linearSolve(b, x, x0, a, c) {
    var i, j, k, lastRow, currentRow, nextRow, lastX, invC;

    if (a === 0 && c === 1) {
      for (j = 1; j <= this._height; ++j) {
        currentRow = j * this._rowSize;
        ++currentRow;
        for (i = 0; i < this._width; ++i) {
          x[currentRow] = x0[currentRow];
          ++currentRow;
        }
      }
    } else {
      invC = 1 / c;
      for (k = 0; k < this._iterations; ++k) {
        for (j = 1; j <= this._height; ++j) {
          lastRow = (j - 1) * this._rowSize;
          currentRow = j * this._rowSize;
          nextRow = (j + 1) * this._rowSize;
          lastX = x[currentRow];
          ++currentRow;
          for (i = 1; i <= this._width; ++i) {
            lastX = x[currentRow] =
              (x0[currentRow] +
                a * (lastX + x[++currentRow] + x[++lastRow] + x[++nextRow])) *
              invC;
          }
        }
      }
    }
  }

  _diffuse(b, x, x0, dt) {
    var a = 0;
    this._linearSolve(b, x, x0, a, 1 + 4 * a);
  }

  _linearSolve2(x, x0, y, y0, a, c) {
    var i, j, k, lastRow, currentRow, nextRow, lastX, lastY, invC;

    if (a === 0 && c === 1) {
      for (j = 1; j <= this._height; ++j) {
        currentRow = j * this._rowSize;
        ++currentRow;
        for (i = 0; i < this._width; ++i) {
          x[currentRow] = x0[currentRow];
          y[currentRow] = y0[currentRow];
          ++currentRow;
        }
      }
    } else {
      invC = 1 / c;
      for (k = 0; k < this._iterations; ++k) {
        for (j = 1; j <= this._height; ++j) {
          lastRow = (j - 1) * this._rowSize;
          currentRow = j * this._rowSize;
          nextRow = (j + 1) * this._rowSize;
          lastX = x[currentRow];
          lastY = y[currentRow];
          ++currentRow;
          for (i = 1; i <= this._width; ++i) {
            lastX = x[currentRow] =
              (x0[currentRow] +
                a * (lastX + x[currentRow] + x[lastRow] + x[nextRow])) *
              invC;
            lastY = y[currentRow] =
              (y0[currentRow] +
                a * (lastY + y[++currentRow] + y[++lastRow] + y[++nextRow])) *
              invC;
          }
        }
      }
    }
  }

  _diffuse2(x, x0, y, y0, dt) {
    var a = 0;
    this._linearSolve2(x, x0, y, y0, a, 1 + 4 * a);
  }

  _advect(b, d, d0, u, v, dt) {
    var i, j, pos, x, y, i0, i1, j0, j1, s0, s1, t0, t1, row1, row2;

    var Wdt0 = dt * this._width;
    var Hdt0 = dt * this._height;
    var Wp5 = this._width + 0.5;
    var Hp5 = this._height + 0.5;

    for (j = 1; j <= this._height; ++j) {
      pos = j * this._rowSize;
      for (i = 1; i <= this._width; ++i) {
        x = i - Wdt0 * u[++pos];
        y = j - Hdt0 * v[pos];

        if (x < 0.5) {
          x = 0.5;
        } else if (x > Wp5) {
          x = Wp5;
        }

        i0 = x | 0;
        i1 = i0 + 1;

        if (y < 0.5) {
          y = 0.5;
        } else if (y > Hp5) {
          y = Hp5;
        }

        j0 = y | 0;
        j1 = j0 + 1;

        s1 = x - i0;
        s0 = 1 - s1;

        t1 = y - j0;
        t0 = 1 - t1;

        row1 = j0 * this._rowSize;
        row2 = j1 * this._rowSize;

        d[pos] =
          s0 * (t0 * d0[i0 + row1] + t1 * d0[i0 + row2]) +
          s1 * (t0 * d0[i1 + row1] + t1 * d0[i1 + row2]);
      }
    }
  }

  _project(u, v, p, div) {
    var i,
      j,
      prevRow,
      currentRow,
      nextRow,
      prevValue,
      nextValue,
      prevPos,
      currentPos,
      nextPos;

    var h = -0.5 / Math.sqrt(this._width * this._height);

    for (j = 1; j <= this._height; ++j) {
      prevRow = (j - 1) * this._rowSize;
      currentRow = j * this._rowSize;
      nextRow = (j + 1) * this._rowSize;

      prevValue = currentRow - 1;
      nextValue = currentRow + 1;

      for (i = 1; i <= this._width; ++i) {
        div[++currentRow] =
          h * (u[++nextValue] - u[++prevValue] + v[++nextRow] - v[++prevRow]);
        p[currentRow] = 0;
      }
    }

    this._linearSolve(0, p, div, 1, 4);

    var halfWidth = 0.5 * this._width,
      halfHeight = 0.5 * this._height;

    for (j = 1; j <= this._height; ++j) {
      prevPos = j * this._rowSize - 1;
      currentPos = j * this._rowSize;
      nextPos = j * this._rowSize + 1;

      prevRow = (j - 1) * this._rowSize;
      currentRow = j * this._rowSize;
      nextRow = (j + 1) * this._rowSize;

      for (i = 1; i <= this._width; ++i) {
        u[++currentPos] -= halfWidth * (p[++nextPos] - p[++prevPos]);
        v[currentPos] -= halfHeight * (p[++nextRow] - p[++prevRow]);
      }
    }
  }
}

/**
 * This is a private constructor that's used to pass state from the UI, and to the renderer.
 * @param {Array} densities   An array of all the densities in the field.
 * @param {Array} velocitiesX An array of all the x velocities in the field.
 * @param {Array} velocitiesY An array of all the y velocities in the field.
 */
class Field {
  constructor(
    private _densities: number[],
    private _velocitiesX: number[],
    private _velocitiesY: number[],
    private _width: number,
    private _height: number,
    private _rowSize: number
  ) {}
  // Just exposing the fields here rather than using accessors is a
  // measurable win during display (maybe 5%) but makes the code ugly.

  // function key(x, y) { return (x + 1) + (y + 1) * _rowSize; } // The original way.
  key(x, y) {
    return x + 1 + (y + 1) * this._rowSize;
  } // The way that works.

  setDensity(x, y, density) {
    this._densities[this.key(x, y)] = density;
  }

  getDensity(x, y) {
    return this._densities[this.key(x, y)];
  }

  // this.setVelocity = function(x, y, xv, yv) { // The original way.
  setVelocity(x, y, velocityX, velocityY) {
    // The way that works.
    this._velocitiesX[this.key(x, y)] = velocityX;
    this._velocitiesY[this.key(x, y)] = velocityY;
  }

  getXVelocity(x, y) {
    return this._velocitiesX[this.key(x, y)];
  }

  getYVelocity(x, y) {
    return this._velocitiesY[this.key(x, y)];
  }

  width() {
    return this._width;
  }
  height() {
    return this._height;
  }
}
