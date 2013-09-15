/** ================================================================================================================ **/
/**
 * @fileOverview
 *
 * @author Matt Hayes <matt@mysterycommand.com>
 * @version 0.0.1
 *
 * @description This is all going to be copied pretty near verbatim from Oliver's Simple Fluid Dynamics Simulator,
 * with only some changes for style (and because it's new to me).
 *
 * @see  http://nerget.com/fluidSim/
 */
/* ================================================================================================================== */

define([

    // 'dynamics/Field'

], function (

    // Field

) {

    'use strict';

    function Fluid(canvas) {
        var uiCallback = function(d,u,v) {},
            iterations = 10,
            // visc = 0.5,
            dt = 0.2,
            dens,
            odens,
            u,
            ou,
            v,
            ov,
            width,
            height,
            rowSize,
            size,
            displayFunc;

        function addFields(x, s, dt) {
            for (var i = 0; i < size; ++i) {
                x[i] += dt*s[i];
            }
        }

        function setBound(b, x) {
            var i, j;

            if (b === 1) {
                for (i = 1; i <= width; ++i) {
                    x[i] =  x[i + rowSize];
                    x[i + (height+1) *rowSize] = x[i + height * rowSize];
                }

                for (j = 1; j <= height; ++j) {
                    x[j * rowSize] = -x[1 + j * rowSize];
                    x[(width + 1) + j * rowSize] = -x[width + j * rowSize];
                }
            } else if (b === 2) {
                for (i = 1; i <= width; ++i) {
                    x[i] = -x[i + rowSize];
                    x[i + (height + 1) * rowSize] = -x[i + height * rowSize];
                }

                for (j = 1; j <= height; ++j) {
                    x[j * rowSize] =  x[1 + j * rowSize];
                    x[(width + 1) + j * rowSize] =  x[width + j * rowSize];
                }
            } else {
                for (i = 1; i <= width; ++i) {
                    x[i] =  x[i + rowSize];
                    x[i + (height + 1) * rowSize] = x[i + height * rowSize];
                }

                for (j = 1; j <= height; ++j) {
                    x[j * rowSize] =  x[1 + j * rowSize];
                    x[(width + 1) + j * rowSize] =  x[width + j * rowSize];
                }
            }

            var maxEdge = (height + 1) * rowSize;

            x[0]                 = 0.5 * (x[1] + x[rowSize]);
            x[maxEdge]           = 0.5 * (x[1 + maxEdge] + x[height * rowSize]);
            x[(width+1)]         = 0.5 * (x[width] + x[(width + 1) + rowSize]);
            x[(width+1)+maxEdge] = 0.5 * (x[width + maxEdge] + x[(width + 1) + height * rowSize]);
        }

        function linearSolve(b, x, x0, a, c) {
            var i, j, k,
                lastRow, currentRow, nextRow,
                lastX, invC;

            if (a === 0 && c === 1) {
                for (j = 1; j <= height; ++j) {
                    currentRow = j * rowSize;
                    ++currentRow;
                    for (i = 0; i < width; ++i) {
                        x[currentRow] = x0[currentRow];
                        ++currentRow;
                    }
                }
                setBound(b, x);
            } else {
                invC = 1 / c;
                for (k = 0; k < iterations; ++k) {
                    for (j = 1; j <= height; ++j) {
                        lastRow = (j - 1) * rowSize;
                        currentRow = j * rowSize;
                        nextRow = (j + 1) * rowSize;
                        lastX = x[currentRow];
                        ++currentRow;
                        for (i = 1; i <= width; ++i) {
                            lastX = x[currentRow] = (x0[currentRow] + a * (lastX + x[++currentRow] + x[++lastRow] + x[++nextRow])) * invC;
                        }
                    }
                    setBound(b, x);
                }
            }
        }

        function diffuse(b, x, x0, dt) {
            var a = 0;
            linearSolve(b, x, x0, a, 1 + 4 * a);
        }

        function linearSolve2(x, x0, y, y0, a, c) {
            var i, j, k,
                lastRow, currentRow, nextRow,
                lastX, lastY, invC;

            if (a === 0 && c === 1) {
                for (j = 1; j <= height; ++j) {
                    currentRow = j * rowSize;
                    ++currentRow;
                    for (i = 0; i < width; ++i) {
                        x[currentRow] = x0[currentRow];
                        y[currentRow] = y0[currentRow];
                        ++currentRow;
                    }
                }
                setBound(1, x);
                setBound(2, y);
            } else {
                invC = 1 / c;
                for (k = 0; k < iterations; ++k) {
                    for (j = 1; j <= height; ++j) {
                        lastRow = (j - 1) * rowSize;
                        currentRow = j * rowSize;
                        nextRow = (j + 1) * rowSize;
                        lastX = x[currentRow];
                        lastY = y[currentRow];
                        ++currentRow;
                        for (i = 1; i <= width; ++i) {
                            lastX = x[currentRow] = (x0[currentRow] + a * (lastX + x[currentRow] + x[lastRow] + x[nextRow])) * invC;
                            lastY = y[currentRow] = (y0[currentRow] + a * (lastY + y[++currentRow] + y[++lastRow] + y[++nextRow])) * invC;
                        }
                    }
                    setBound(1, x);
                    setBound(2, y);
                }
            }
        }

        function diffuse2(x, x0, y, y0, dt) {
            var a = 0;
            linearSolve2(x, x0, y, y0, a, 1 + 4 * a);
        }

        function advect(b, d, d0, u, v, dt) {
            var i, j,
                pos,
                x, y,
                i0, i1,
                j0, j1,
                s0, s1,
                t0, t1,
                row1, row2;

            var Wdt0 = dt * width;
            var Hdt0 = dt * height;
            var Wp5 = width + 0.5;
            var Hp5 = height + 0.5;

            for (j = 1; j<= height; ++j) {
                pos = j * rowSize;
                for (i = 1; i <= width; ++i) {
                    x = i - Wdt0 * u[++pos];
                    y = j - Hdt0 * v[pos];

                    if (x < 0.5) { x = 0.5; }
                    else if (x > Wp5) { x = Wp5; }

                    i0 = x | 0;
                    i1 = i0 + 1;

                    if (y < 0.5) { y = 0.5; }
                    else if (y > Hp5) { y = Hp5; }

                    j0 = y | 0;
                    j1 = j0 + 1;

                    s1 = x - i0;
                    s0 = 1 - s1;

                    t1 = y - j0;
                    t0 = 1 - t1;

                    row1 = j0 * rowSize;
                    row2 = j1 * rowSize;

                    d[pos] = s0 * (t0 * d0[i0 + row1] + t1 * d0[i0 + row2]) + s1 * (t0 * d0[i1 + row1] + t1 * d0[i1 + row2]);
                }
            }
            setBound(b, d);
        }

        function project(u, v, p, div) {
            var i, j,
                prevRow, currentRow, nextRow,
                prevValue, nextValue,
                prevPos, currentPos, nextPos;

            var h = -0.5 / Math.sqrt(width * height);

            for (j = 1; j <= height; ++j) {

                prevRow = (j - 1) * rowSize;
                currentRow = j * rowSize;
                nextRow = (j + 1) * rowSize;

                prevValue = currentRow - 1;
                nextValue = currentRow + 1;

                for (i = 1; i <= width; ++i) {
                    div[++currentRow] = h * (u[++nextValue] - u[++prevValue] + v[++nextRow] - v[++prevRow]);
                    p[currentRow] = 0;
                }
            }

            setBound(0, div);
            setBound(0, p);

            linearSolve(0, p, div, 1, 4 );

            var wScale = 0.5 * width;
            var hScale = 0.5 * height;

            for (j = 1; j<= height; ++j) {

                prevPos = j * rowSize - 1;
                currentPos = j * rowSize;
                nextPos = j * rowSize + 1;

                prevRow = (j - 1) * rowSize;
                currentRow = j * rowSize;
                nextRow = (j + 1) * rowSize;

                for (i = 1; i<= width; ++i) {
                    u[++currentPos] -= wScale * (p[++nextPos] - p[++prevPos]);
                    v[currentPos]   -= hScale * (p[++nextRow] - p[++prevRow]);
                }
            }

            setBound(1, u);
            setBound(2, v);
        }

        function densityStep(x, x0, u, v, dt) {
            // console.log('densityStep');
            addFields(x, x0, dt);
            diffuse(0, x0, x, dt );
            advect(0, x, x0, u, v, dt );
        }

        function swap(a, a0) {
            var tmp = a0;
            a0 = a;
            a = tmp;
        }

        function velocityStep(u, v, u0, v0, dt) {
            // console.log('velocityStep');
            addFields(u, u0, dt);
            addFields(v, v0, dt);

            var tmp;

            // swap(u, u0);
            tmp = u0;
            u0 = u;
            u = tmp;
            // swap(v, v0);
            tmp = v0;
            v0 = v;
            v = tmp;

            diffuse2(u,u0,v,v0, dt);
            project(u, v, u0, v0);

            // swap(u, u0);
            tmp = u0;
            u0 = u;
            u = tmp;
            // swap(v, v0);
            tmp = v0;
            v0 = v;
            v = tmp;

            advect(1, u, u0, u0, v0, dt);
            advect(2, v, v0, u0, v0, dt);

            project(u, v, u0, v0);
        }

        function reset() {
            rowSize = width + 2;
            size = (width + 2) * (height + 2);

            dens = new Array(size);
            odens = new Array(size);

            u = new Array(size);
            ou = new Array(size);

            v = new Array(size);
            ov = new Array(size);

            for (var i = 0; i < size; i++) {
                odens[i] = ou[i] = ov[i] = dens[i] = u[i] = v[i] = 0;
            }
        }

        function Field(dens, u, v) {
            // Just exposing the fields here rather than using accessors is a
            // measurable win during display (maybe 5%) but makes the code ugly.

            this.setDensity = function(x, y, d) {
                dens[(x + 1) + (y + 1) * rowSize] = d;
            };

            this.getDensity = function(x, y) {
                return dens[(x + 1) + (y + 1) * rowSize];
            };

            this.setVelocity = function(x, y, xv, yv) {
                u[(x + 1) + (y + 1) * rowSize] = xv;
                v[(x + 1) + (y + 1) * rowSize] = yv;
            };

            this.getXVelocity = function(x, y) {
                return u[(x + 1) + (y + 1) * rowSize];
            };

            this.getYVelocity = function(x, y) {
                return v[(x + 1) + (y + 1) * rowSize];
            };

            this.width = function() { return width; };
            this.height = function() { return height; };
        }

        this.setUICallback = function(callback) {
            uiCallback = callback;
        };
        function queryUI(d, u, v) {
            // console.log('queryUI');
            for (var i = 0; i < size; i++) {
                u[i] = v[i] = d[i] = 0.0;
            }

            uiCallback(new Field(d, u, v));
        }

        this.update = function () {
            queryUI(odens, ou, ov);

            velocityStep(u, v, ou, ov, dt);
            densityStep(dens, odens, u, v, dt);

            displayFunc(new Field(dens, u, v));
        };

        this.setDisplayFunction = function(func) {
            displayFunc = func;
        };

        this.iterations = function() { return iterations; };
        this.setIterations = function(iters) {
            if (iters > 0 && iters <= 100) {
                iterations = iters;
            }
        };

        this.setResolution = function (hRes, wRes) {
            var res = wRes * hRes;
            if ((res > 0 && res < 1000000) &&
                (wRes !== width || hRes !== height)) {
                width = wRes;
                height = hRes;
                reset();
                return true;
            }

            return false;
        };

        this.setResolution(64, 64);
    }

    return Fluid;

});

/* ================================================================================================================== */
