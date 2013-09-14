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
    'polyfill/window.requestAnimationFrame'

], function (

    $

) {

    'use strict';
    if (window.$) { window.$.noConflict(true); }
    // if (window._) { window._.noConflict(); }

    $(function() {

        var main = document.getElementById('js-main');
        var canvas = document.getElementById('js-canvas');
        var res = 8;
        var w = canvas.width = Math.floor(main.offsetWidth / res);
        var h = canvas.height = Math.floor(main.offsetHeight / res);

        var displayW = w * res;
        var displayH = h * res;
        canvas.style.width = displayW + 'px';
        canvas.style.height = displayH + 'px';

        var ctx = canvas.getContext('2d');
        // console.log(main);
        // console.log(canvas);
        // console.log(ctx);

        var pointerDown = false;
        var ox, oy, x, y;
        var str, hex;

        function onDown(event) {
            // console.log(event.type, event);
            event.preventDefault();
            pointerDown = true;

            str = (Math.random() * (0xFFFFFF + 1) << 0).toString(16);
            hex = '#' + (new Array(7 - str.length).join('0') + str);
            ox = x = event.pageX;
            oy = y = event.pageY;

            canvas.addEventListener('mousemove', onMove);
            canvas.addEventListener('touchmove', onMove);
        }
        function onMove(event) {
            // console.log(event.type, event);
            event.preventDefault();

            x = event.pageX;
            y = event.pageY;
        }
        function onUp(event) {
            // console.log(event.type);
            event.preventDefault();
            pointerDown = false;

            canvas.removeEventListener('mousemove', onMove);
            canvas.removeEventListener('touchmove', onMove);
        }

        canvas.addEventListener('touchstart', onDown);
        canvas.addEventListener('mousedown', onDown);

        canvas.addEventListener('touchend', onUp);
        canvas.addEventListener('mouseup', onUp);

        var forEach = Array.prototype.forEach;
        var PI2 = Math.PI * 2;

        var requestId = null;
        var isRunning = false;
        var then, now, d;
        var dx, dy, len, px, py, i;
        var render = function(time) {
            requestId = window.requestAnimationFrame(render);

            if (!then) { then = time; }
            now = time;
            d = now - then;
            then = now;

            ctx.clearRect(0, 0, w, h);

            ctx.fillStyle = 'grey';
            ctx.fillRect(1, 1, w - 2, h - 2);

            if ( ! pointerDown) { return; }
            if ((0 <= ox && ox < displayW) &&
                (0 <= oy && oy < displayH)) {
                dx = x - ox;
                dy = y - oy;
                len = (Math.sqrt(dx * dx + dy * dy) + 0.5) | 0;
                if (len < 1) { len = 1; }

                // for (i = 0; i < len; ++i) {
                //     px =
                // }

                ctx.fillStyle = hex;
                ctx.beginPath();
                ctx.arc(x / res, y / res, 10 / res, 0, PI2, false);
                ctx.fill();
                ctx.closePath();
            }
        };

        function start() {
            requestId = window.requestAnimationFrame(render);
            isRunning = true;
        }

        function stop() {
            window.cancelAnimationFrame(requestId);
            ctx.clearRect(0, 0, w, h);
            isRunning = false;
        }

        if (window.Modernizr.touch) {
            start();
        } else {
            window.addEventListener('keyup', function(event) {
                if (event.which !== 32) { return; }
                isRunning ? stop() : start();
            });
        }

    });

});

/* ================================================================================================================== */
