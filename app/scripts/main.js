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
    'dynamics/Fluid',
    'polyfill/window.requestAnimationFrame'

], function (

    $,
    Fluid

) {

    'use strict';
    if (window.$) {
        window.$.noConflict(true);
        delete window.jQuery;
        delete window.$;
    }

    if (window._) {
        window._.noConflict();
        delete window._;
    }

    var IS_TOUCH = window.Modernizr.touch;
    var RESOLUTION = (IS_TOUCH) ? 8 : 8;

    $(function() {



        /**
         * Main setup stuff.
         */
        var main = document.getElementById('js-main'),

            canvas = document.getElementById('js-canvas'),
            canvasCtx = canvas.getContext('2d'),

            buffer = document.createElement('canvas'),
            bufferCtx = buffer.getContext('2d'),

            canvasWidth = canvas.width = main.offsetWidth / RESOLUTION | 0, // 64, //
            canvasHeight = canvas.height = main.offsetHeight / RESOLUTION | 0, // 48, //

            displayWidth = canvasWidth * RESOLUTION,
            displayHeight = canvasHeight * RESOLUTION;

        canvas.style.width = displayWidth + 'px';
        canvas.style.height = displayHeight + 'px';



        /**
         * Event handlers.
         */
        var x, y, ox, oy,
            pointerDown = false;

        function onDown(event) {
            // console.log(event.type, event);
            event.preventDefault();
            pointerDown = true;

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



        /**
         * Fluids.
         */
        var fluid = new Fluid(canvas),
            dx, dy, len, px, py, i,
            bufferData, data, j,
            cx, cy, cd,

            r = 128 + (Math.random() * 127 | 0),
            g = 128 + (Math.random() * 127 | 0),
            b = 128 + (Math.random() * 127 | 0);

        function update(f) {
            if ( ! (pointerDown &&
                 (0 <= ox && ox < displayWidth &&
                  0 <= oy && oy < displayHeight))) { return; }

            dx = x - ox;
            dy = y - oy;

            len = (Math.sqrt(dx * dx + dy * dy) + 0.5) | 0;
            if (len < 1) { len = 1; }

            for (i = 0; i < len; ++i) {
                px = (((ox + dx * (i / len)) / displayWidth) * canvasWidth) | 0;
                py = (((oy - dy * (i / len)) / displayHeight) * canvasHeight) | 0;

                f.setVelocity(px, py, dx, dy);
                f.setDensity(px, py, 25);
            }

            ox = x;
            oy = y;
        }

        function render(f) {
            bufferData = bufferCtx.createImageData(canvasWidth, canvasHeight);
            data = bufferData.data;

            for (j = 3; j < data.length; j += 4) {
                // set the alpha channel to 100% alpha
                data[j] = 255;
            }

            for (cx = 0; cx < canvasWidth; ++cx) {
                for (cy = 0; cy < canvasHeight; ++cy) {
                    cd = f.getDensity(cx, cy);
                    data[4 * (cy * canvasWidth + cx) + 1] = cd * 127;
                    // data[4 * (cy * canvasWidth + cx) + 1] = cel * g;
                    // data[4 * (cy * canvasWidth + cx) + 2] = cel * b;
                }
            }

            canvasCtx.putImageData(bufferData, 0, 0);
        }

        fluid.setUICallback(update);
        fluid.setDisplayFunction(render);
        fluid.setResolution(canvasWidth, canvasHeight);



        /**
         * Render loop.
         */
        var requestId = -1,
            isRunning = false,
            then, now, d;

        function loop(time) {
            fluid.update();

            then || (then = time);
            now = time;
            d = now - then;
            then = now;

            isRunning ? animate() : stop();
        }

        function animate() {
            isRunning = true;
            requestId = window.requestAnimationFrame(loop);
        }

        function stop() {
            isRunning = false;
            window.cancelAnimationFrame(requestId);
        }

        if ( ! IS_TOUCH) {
            window.addEventListener('keyup', function(event) {
                if (event.which !== 32) { return; }
                isRunning ? stop() : animate();
                // if (isRunning) { stop(); }
                // else { fluid.update(); }
            });
        }

        animate();



    });

});

/* ================================================================================================================== */
