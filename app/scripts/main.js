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
        var w = canvas.width = main.offsetWidth;
        var h = canvas.height = main.offsetHeight;
        var ctx = canvas.getContext('2d');
        // console.log(main);
        // console.log(canvas);
        // console.log(ctx);

        var mouseDown = false;
        var touches = [];
        function onDown(event) {
            // console.log(event.type, event);
            event.preventDefault();
            mouseDown = true;
            touches = event.touches || [{
                pageX: event.pageX,
                pageY: event.pageY
            }];
            canvas.addEventListener('mousemove', onMove);
            canvas.addEventListener('touchmove', onMove);
        }
        function onMove(event) {
            // console.log(event.type, event);
            event.preventDefault();
            touches = event.touches || [{
                pageX: event.pageX,
                pageY: event.pageY
            }];
        }
        function onUp(event) {
            // console.log(event.type);
            event.preventDefault();
            mouseDown = false;
            touches = event.touches || [{
                pageX: event.pageX,
                pageY: event.pageY
            }];
            canvas.removeEventListener('mousemove', onMove);
            canvas.removeEventListener('touchmove', onMove);
        }

        canvas.addEventListener('mousedown', onDown);
        canvas.addEventListener('mouseup', onUp);

        canvas.addEventListener('touchstart', onDown);
        canvas.addEventListener('touchend', onUp);

        var forEach = Array.prototype.forEach;

        var requestId = null;
        var isRunning = false;
        var then, now, d;
        var render = function(time) {
            requestId = window.requestAnimationFrame(render);

            if (!then) { then = time; }
            now = time;
            d = now - then;
            then = now;

            ctx.clearRect(0, 0, w, h);

            ctx.fillStyle = 'grey';
            ctx.fillRect(50, 50, w - 100, h - 100);

            if ( ! mouseDown) { return; }

            forEach.call(touches, function(touch) {
                if ( ! touch.hex) {
                    var str = (Math.random() * (0xFFFFFF + 1) << 0).toString(16),
                        hex = '#' + (new Array(7 - str.length).join('0') + str);
                    touch.hex = hex;
                }

                ctx.fillStyle = touch.hex;
                ctx.beginPath();
                ctx.arc(touch.pageX, touch.pageY, 100, 0, Math.PI * 2, false);
                ctx.fill();
                ctx.closePath();
            });
        };
        requestId = window.requestAnimationFrame(render);

    });

});

/* ================================================================================================================== */
