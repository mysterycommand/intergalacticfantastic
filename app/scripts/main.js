/** ================================================================================================================ **/
/**
 * @fileOverview
 *
 * @author Matt Hayes <matt@mysterycommand.com>
 * @version 0.0.1
 */
/* ================================================================================================================== */

require([

    'jquery',
    // 'dynamics/Field',
    'dynamics/Fluid',
    'polyfill/window.requestAnimationFrame'

], function (

    $,
    // Field,
    Fluid

) {

    'use strict';
    if (window.$) { window.$.noConflict(true); }
    // if (window._) { window._.noConflict(); }
    var IS_TOUCH = window.Modernizr.touch;
    var RESOLUTION = (IS_TOUCH) ? 16 : 8;

    $(function() {

        var main = document.getElementById('js-main'),

            canvas = document.getElementById('js-canvas'),
            cavnasCtx = canvas.getContext('2d'),

            buffer = document.createElement('canvas'),
            bufferCtx = buffer.getContext('2d'),

            canvasWidth = canvas.width = main.offsetWidth / RESOLUTION | 0,
            canvasHeight = canvas.height = main.offsetHeight / RESOLUTION | 0,

            displayWidth = canvasWidth * RESOLUTION,
            displayHeight = canvasHeight * RESOLUTION,

            x, y, ox, oy;

        canvas.style.width = displayWidth + 'px';
        canvas.style.height = displayHeight + 'px';

    });

});

/* ================================================================================================================== */
