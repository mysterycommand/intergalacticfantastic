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
    'dynamics/Field',
    'polyfill/window.requestAnimationFrame'

], function (

    $,
    Field

) {

    'use strict';
    if (window.$) { window.$.noConflict(true); }
    // if (window._) { window._.noConflict(); }
    var IS_TOUCH = window.Modernizr.touch;

    $(function() {

        var main = document.getElementById('js-main');
        var canvas = document.getElementById('js-canvas');
        var res = (IS_TOUCH) ? 16 : 8;
        var w = canvas.width = Math.floor(main.offsetWidth / res);
        var h = canvas.height = Math.floor(main.offsetHeight / res);

        var displayW = w * res;
        var displayH = h * res;
        canvas.style.width = displayW + 'px';
        canvas.style.height = displayH + 'px';

        var canvasCtx = canvas.getContext('2d');
        canvasCtx.imageSmoothingEnabled = false;
        // console.log(main);
        // console.log(canvas);
        // console.log(canvasCtx);

        var pointerDown = false;
        var ox, oy, x, y;
        // var str, hex;

        function onDown(event) {
            // console.log(event.type, event);
            event.preventDefault();
            pointerDown = true;

            // str = (Math.random() * (0xFFFFFF + 1) << 0).toString(16);
            // hex = '#' + (new Array(7 - str.length).join('0') + str);
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

        var oldField = new Field(w, h);
        var field;

        var render = function(time) {
            requestId = window.requestAnimationFrame(render);

            if (!then) { then = time; }
            now = time;
            d = now - then;
            then = now;

            oldField.subLinearDensity(0.0025);
            draw(oldField);

            if ( ! pointerDown) { return; }

            field = new Field(w, h);
            update(field);

            oldField.addFieldDensities(field);
        };

        var dx, dy, len, px, py, i;
        function update(field) {
            if ((0 <= ox && ox < displayW) &&
                (0 <= oy && oy < displayH)) {
                dx = x - ox;
                dy = y - oy;
                len = (Math.sqrt(dx * dx + dy * dy) + 0.5) | 0;
                if (len < 1) { len = 1; }

                for (i = 0; i < len; ++i) {
                    px = (((ox + dx * (i / len)) / displayW) * w) | 0;
                    py = (((oy + dy * (i / len)) / displayH) * h) | 0;

                    field.setDensity(px, py, 0.1);
                }
                ox = x;
                oy = y;
            }
        }

        var buffer = document.createElement('canvas');
        var bufferCtx = buffer.getContext('2d');
        bufferCtx.imageSmoothingEnabled = false;
        // This is the 'clampData' check. It passes in WebKit, so I'm not worrying about it.
        // bufferData = bufferCtx.createImageData(w, h);
        // bufferData.data[0] = 256;
        // console.log(bufferData.data[0] > 255);

        var bufferData, data, row, col, cel, k;
        function draw(field) {
            bufferData = bufferCtx.createImageData(w, h);
            data = bufferData.data;
            for (k = 0; k < data.length; ++k) { // set the whole buffer to 100% alpha white
            // for (k = 3; k < data.length; k+=4) { // set the alpha channel to 100% alpha
                data[k] = 255;
            }

            for (col = 0; col < w; ++col) {
                for (row = 0; row < h; ++row) {
                    cel = field.getDensity(col, row) * 255;
                    data[4 * (row * w + col) + 0] -= cel;
                    data[4 * (row * w + col) + 1] -= cel;
                    data[4 * (row * w + col) + 2] -= cel;
                }
            }

            canvasCtx.putImageData(bufferData, 0, 0);
        }

        function start() {
            requestId = window.requestAnimationFrame(render);
            isRunning = true;
        }

        function stop() {
            window.cancelAnimationFrame(requestId);
            // canvasCtx.clearRect(0, 0, w, h);
            isRunning = false;
        }

        if (IS_TOUCH) {
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
