/** ================================================================================================================ **/
/**
 * @fileOverview
 *
 * @author Matt Hayes <matt@mysterycommand.com>
 * @version 0.0.1
 */
/* ================================================================================================================== */

define([
], function (
) {

    'use strict';

    var forEach = Array.prototype.forEach;

    function zeroArray(size) {
        /* jshint newcap: false */
        // Taken from: http://stackoverflow.com/questions/1295584/most-efficient-way-to-create-a-zero-filled-javascript-array
        // Might not be super efficient to do it this way, but should work for now.
        // TODO: investigate for optimizability.
        return Array.apply(null, Array(size)).map(Number.prototype.valueOf, 0);
    }

    function Field(w, h, ds, vx, vy) {
        if ( ! w || ! h) { throw new Error('w and h are required'); }

        this._width = w;
        this._height = h;

        if (ds && ds.length !== this.size) { throw new Error('Expected ds to have a size of ' + this.size + ' instead found ' + ds.length + '.'); }
        if (vx && vx.length !== this.size) { throw new Error('Expected vx to have a size of ' + this.size + ' instead found ' + vx.length + '.'); }
        if (vy && vy.length !== this.size) { throw new Error('Expected vy to have a size of ' + this.size + ' instead found ' + vy.length + '.'); }

        this._ds = new Float32Array(ds || zeroArray(this.size));
        this._vx = new Float32Array(vx || zeroArray(this.size));
        this._vy = new Float32Array(vy || zeroArray(this.size));
    }

    Field.prototype = Object.create(Object.prototype, {
        constructor: {
            configurable: true,
            enumerable: true,
            writable: false,
            value: Field
        },
        width: {
            configurable: true,
            enumerable: true,
            get: function() {
                return this._width;
            }
        },
        height: {
            configurable: true,
            enumerable: true,
            get: function() {
                return this._height;
            }
        },
        size: {
            configurable: true,
            enumerable: true,
            get: function() {
                return (this._width + 2) * (this._height + 2);
            }
        },
        rows: {
            configurable: true,
            enumerable: true,
            get: function() {
                return (this._width + 2);
            }
        },
        empty: {
            configurable: true,
            enumerable: true,
            writable: false,
            value: function() {
                this._ds.set(zeroArray(this.size));
                this._vx.set(zeroArray(this.size));
                this._vy.set(zeroArray(this.size));
            }
        },
        setDensity: {
            configurable: true,
            enumerable: true,
            writable: false,
            value: function(x, y, d) {
                var i = (x + 1) + (y + 1) * this.rows;
                this._ds[i] = d;
            }
        },
        getDensity: {
            configurable: true,
            enumerable: true,
            writable: false,
            value: function(x, y) {
                var i = (x + 1) + (y + 1) * this.rows;
                return this._ds[i];
            }
        },
        setVelocity: {
            configurable: true,
            enumerable: true,
            writable: false,
            value: function(x, y, vx, vy) {
                var i = (x + 1) + (y + 1) * this.rows;
                this._vx[i] = vx;
                this._vy[i] = vy;
            }
        },
        getVelocityX: {
            configurable: true,
            enumerable: true,
            writable: false,
            value: function(x, y) {
                var i = (x + 1) + (y + 1) * this.rows;
                return this._vx[i];
            }
        },
        getVelocityY: {
            configurable: true,
            enumerable: true,
            writable: false,
            value: function(x, y) {
                var i = (x + 1) + (y + 1) * this.rows;
                return this._vy[i];
            }
        },
        addFieldDensities: {
            configurable: true,
            enumerable: true,
            writable: false,
            value: function(field) {
                if (this.size !== field.size) { throw new Error('Cannot add fields of differing sizes: ' + this.size + ', ' + field.size); }
                for (var i = 0; i < field.size; ++i) {
                    this._ds[i] += field._ds[i];
                    if (this._ds[i] > 1) { this._ds[i] = 1; }
                }
            }
        },
        subFieldDensities: {
            configurable: true,
            enumerable: true,
            writable: false,
            value: function(field) {
                if (this.size !== field.size) { throw new Error('Cannot add fields of differing sizes: ' + this.size + ', ' + field.size); }
                for (var i = 0; i < field.size; ++i) {
                    this._ds[i] -= field._ds[i];
                    if (this._ds[i] < 0) { this._ds[i] = 0; }
                }
            }
        },
        addLinearDensity: {
            configurable: true,
            enumerable: true,
            writable: false,
            value: function(value) {
                for (var i = 0; i < this.size; ++i) {
                    this._ds[i] += value;
                    if (this._ds[i] > 1) { this._ds[i] = 1; }
                }
            }
        },
        subLinearDensity: {
            configurable: true,
            enumerable: true,
            writable: false,
            value: function(value) {
                for (var i = 0; i < this.size; ++i) {
                    this._ds[i] -= value;
                    if (this._ds[i] < 0) { this._ds[i] = 0; }
                }
            }
        }
    });

    return Field;

});

/* ================================================================================================================== */
