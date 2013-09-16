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

        // private variables
        var _update = function(field) {},
            _render = function(field) {},

            _iterations = 10, dt = 0.1,

            _densities, _oDensities,
            _velocitiesX, _oVelocitiesX,
            _velocitiesY, _oVelocitiesY,

            _width, _height,

            _rowSize, _size;

        // public/privelaged methods
        this.setUpdateCallback = function(callback) { _update = callback; };
        this.setRenderCallback = function(callback) { _render = callback; };

        this.iterations = function() { return _iterations; };
        this.setIterations = function(i) { if (0 < i && i <= 100) { _iterations = i; } };

        this.setResolution = function (w, h) {
            var res = w * h;
            if ( ! (res && (0 < res && res < 1000000)) ||
                _width === w || _height === h) { return; }

            _width = w;
            _height = h;
            _reset();
        };

        this.step = function () {
            _queryUI(_oDensities, _oVelocitiesX, _oVelocitiesY);

            _velocityStep(_velocitiesX, _velocitiesY, _oVelocitiesX, _oVelocitiesY, dt);
            _densityStep(_densities, _oDensities, _velocitiesX, _velocitiesY, dt);

            _render(new Field(_densities, _velocitiesX, _velocitiesY));
        };

        // private methods
        function _reset() {
            _rowSize = _width + 2;
            _size = (_width + 2) * (_height + 2);

            _densities = new Array(_size);
            _oDensities = new Array(_size);

            _velocitiesX = new Array(_size);
            _oVelocitiesX = new Array(_size);

            _velocitiesY = new Array(_size);
            _oVelocitiesY = new Array(_size);

            for (var i = 0; i < _size; i++) {
                _oDensities[i] = _oVelocitiesX[i] = _oVelocitiesY[i] =
                _densities[i] = _velocitiesX[i] = _velocitiesY[i] = 0;
            }
        }

        function _queryUI(d, u, v) {
            for (var i = 0; i < _size; i++) { d[i] = u[i] = v[i] = 0.0; }
            _update(new Field(d, u, v));
        }

        function _velocityStep(u, v, u0, v0, dt) {
            _addFields(u, u0, dt);
            _addFields(v, v0, dt);

            u = [u0, u0 = u][0];
            v = [v0, v0 = v][0];

            _diffuse2(u,u0,v,v0, dt);
            _project(u, v, u0, v0);

            u = [u0, u0 = u][0];
            v = [v0, v0 = v][0];

            _advect(1, u, u0, u0, v0, dt);
            _advect(2, v, v0, u0, v0, dt);

            _project(u, v, u0, v0);
        }

        function _densityStep(x, x0, u, v, dt) {
            _addFields(x, x0, dt);
            _diffuse(0, x0, x, dt );
            _advect(0, x, x0, u, v, dt );
        }

        function _addFields(x, s, dt) {
            for (var i = 0; i < _size; ++i) {
                x[i] += dt*s[i];
            }
        }

        function _setBound(b, x) {
            var i, j,
                maxEdge = (_height + 1) * _rowSize;

            if (b === 1) {
                for (i = 1; i <= _width; ++i) {
                    x[i] =  x[i + _rowSize];
                    x[i + maxEdge] = x[i + _height * _rowSize];
                }

                for (j = 1; j <= _height; ++j) {
                    x[j * _rowSize] = -x[1 + j * _rowSize];
                    x[(_width + 1) + j * _rowSize] = -x[_width + j * _rowSize];
                }
            } else if (b === 2) {
                for (i = 1; i <= _width; ++i) {
                    x[i] = -x[i + _rowSize];
                    x[i + maxEdge] = -x[i + _height * _rowSize];
                }

                for (j = 1; j <= _height; ++j) {
                    x[j * _rowSize] =  x[1 + j * _rowSize];
                    x[(_width + 1) + j * _rowSize] =  x[_width + j * _rowSize];
                }
            } else {
                for (i = 1; i <= _width; ++i) {
                    x[i] = x[i + _rowSize];
                    x[i + maxEdge] = x[i + _height * _rowSize];
                }

                for (j = 1; j <= _height; ++j) {
                    x[j * _rowSize] =  x[1 + j * _rowSize];
                    x[(_width + 1) + j * _rowSize] = x[_width + j * _rowSize];
                }
            }

            x[0]                 = 0.5 * (x[1] + x[_rowSize]);
            x[maxEdge]           = 0.5 * (x[1 + maxEdge] + x[_height * _rowSize]);
            x[(_width+1)]         = 0.5 * (x[_width] + x[(_width + 1) + _rowSize]);
            x[(_width+1)+maxEdge] = 0.5 * (x[_width + maxEdge] + x[(_width + 1) + _height * _rowSize]);
        }

        function _linearSolve(b, x, x0, a, c) {
            var i, j, k,
                lastRow, currentRow, nextRow,
                lastX, invC;

            if (a === 0 && c === 1) {
                for (j = 1; j <= _height; ++j) {
                    currentRow = j * _rowSize;
                    ++currentRow;
                    for (i = 0; i < _width; ++i) {
                        x[currentRow] = x0[currentRow];
                        ++currentRow;
                    }
                }
                _setBound(b, x);
            } else {
                invC = 1 / c;
                for (k = 0; k < _iterations; ++k) {
                    for (j = 1; j <= _height; ++j) {
                        lastRow = (j - 1) * _rowSize;
                        currentRow = j * _rowSize;
                        nextRow = (j + 1) * _rowSize;
                        lastX = x[currentRow];
                        ++currentRow;
                        for (i = 1; i <= _width; ++i) {
                            lastX = x[currentRow] = (x0[currentRow] + a * (lastX + x[++currentRow] + x[++lastRow] + x[++nextRow])) * invC;
                        }
                    }
                    _setBound(b, x);
                }
            }
        }

        function _diffuse(b, x, x0, dt) {
            var a = 0;
            _linearSolve(b, x, x0, a, 1 + 4 * a);
        }

        function _linearSolve2(x, x0, y, y0, a, c) {
            var i, j, k,
                lastRow, currentRow, nextRow,
                lastX, lastY, invC;

            if (a === 0 && c === 1) {
                for (j = 1; j <= _height; ++j) {
                    currentRow = j * _rowSize;
                    ++currentRow;
                    for (i = 0; i < _width; ++i) {
                        x[currentRow] = x0[currentRow];
                        y[currentRow] = y0[currentRow];
                        ++currentRow;
                    }
                }
                _setBound(1, x);
                _setBound(2, y);
            } else {
                invC = 1 / c;
                for (k = 0; k < _iterations; ++k) {
                    for (j = 1; j <= _height; ++j) {
                        lastRow = (j - 1) * _rowSize;
                        currentRow = j * _rowSize;
                        nextRow = (j + 1) * _rowSize;
                        lastX = x[currentRow];
                        lastY = y[currentRow];
                        ++currentRow;
                        for (i = 1; i <= _width; ++i) {
                            lastX = x[currentRow] = (x0[currentRow] + a * (lastX + x[currentRow] + x[lastRow] + x[nextRow])) * invC;
                            lastY = y[currentRow] = (y0[currentRow] + a * (lastY + y[++currentRow] + y[++lastRow] + y[++nextRow])) * invC;
                        }
                    }
                    _setBound(1, x);
                    _setBound(2, y);
                }
            }
        }

        function _diffuse2(x, x0, y, y0, dt) {
            var a = 0;
            _linearSolve2(x, x0, y, y0, a, 1 + 4 * a);
        }

        function _advect(b, d, d0, u, v, dt) {
            var i, j,
                pos,
                x, y,
                i0, i1,
                j0, j1,
                s0, s1,
                t0, t1,
                row1, row2;

            var Wdt0 = dt * _width;
            var Hdt0 = dt * _height;
            var Wp5 = _width + 0.5;
            var Hp5 = _height + 0.5;

            for (j = 1; j<= _height; ++j) {
                pos = j * _rowSize;
                for (i = 1; i <= _width; ++i) {
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

                    row1 = j0 * _rowSize;
                    row2 = j1 * _rowSize;

                    d[pos] = s0 * (t0 * d0[i0 + row1] + t1 * d0[i0 + row2]) + s1 * (t0 * d0[i1 + row1] + t1 * d0[i1 + row2]);
                }
            }
            _setBound(b, d);
        }

        function _project(u, v, p, div) {
            var i, j,
                prevRow, currentRow, nextRow,
                prevValue, nextValue,
                prevPos, currentPos, nextPos;

            var h = -0.5 / Math.sqrt(_width * _height);

            for (j = 1; j <= _height; ++j) {

                prevRow = (j - 1) * _rowSize;
                currentRow = j * _rowSize;
                nextRow = (j + 1) * _rowSize;

                prevValue = currentRow - 1;
                nextValue = currentRow + 1;

                for (i = 1; i <= _width; ++i) {
                    div[++currentRow] = h * (u[++nextValue] - u[++prevValue] + v[++nextRow] - v[++prevRow]);
                    p[currentRow] = 0;
                }
            }

            _setBound(0, div);
            _setBound(0, p);

            _linearSolve(0, p, div, 1, 4 );

            var wScale = 0.5 * _width;
            var hScale = 0.5 * _height;

            for (j = 1; j<= _height; ++j) {

                prevPos = j * _rowSize - 1;
                currentPos = j * _rowSize;
                nextPos = j * _rowSize + 1;

                prevRow = (j - 1) * _rowSize;
                currentRow = j * _rowSize;
                nextRow = (j + 1) * _rowSize;

                for (i = 1; i<= _width; ++i) {
                    u[++currentPos] -= wScale * (p[++nextPos] - p[++prevPos]);
                    v[currentPos]   -= hScale * (p[++nextRow] - p[++prevRow]);
                }
            }

            _setBound(1, u);
            _setBound(2, v);
        }



        /**
         * This is a private constructor that's used to pass state from the UI, and to the renderer.
         * @param {Array} densities   An array of all the densities in the field.
         * @param {Array} velocitiesX An array of all the x velocities in the field.
         * @param {Array} velocitiesY An array of all the y velocities in the field.
         */
        function Field(densities, velocitiesX, velocitiesY) {
            // Just exposing the fields here rather than using accessors is a
            // measurable win during display (maybe 5%) but makes the code ugly.

            // function key(x, y) { return (x + 1) + (y + 1) * _rowSize; } // The original way.
            function key(x, y) { return (x + 1) + (y + 1) * _rowSize; } // The way that works.

            this.setDensity = function(x, y, density) {
                densities[key(x, y)] = density;
            };

            this.getDensity = function(x, y) {
                return densities[key(x, y)];
            };

            // this.setVelocity = function(x, y, xv, yv) { // The original way.
            this.setVelocity = function(x, y, velocityX, velocityY) { // The way that works.
                velocitiesX[key(x, y)] = velocityX;
                velocitiesY[key(x, y)] = velocityY;
            };

            this.getXVelocity = function(x, y) {
                return velocitiesX[key(x, y)];
            };

            this.getYVelocity = function(x, y) {
                return velocitiesY[key(x, y)];
            };

            this.width = function() { return _width; };
            this.height = function() { return _height; };
        }
    }

    return Fluid;

});

/* ================================================================================================================== */
