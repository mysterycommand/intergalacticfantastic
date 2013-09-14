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

    function Particle(ds, vx, vy) {
        this.ods = this.ds = ds || 0;
        this.ovx = this.vx = vx || 0;
        this.ovy = this.vy = vy || 0;
    }

    Particle.prototype = Object.create(Object.prototype, {
        constructor: {
            configurable: true,
            enumerable: true,
            writable: false,
            value: Particle
        }
    });

    return Particle;

});

/* ================================================================================================================== */
