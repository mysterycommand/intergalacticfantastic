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
    'util/keys/KeyEvent',
    'util/keys/KeyManager',
    'polyfill/window.requestAnimationFrame'

], function (

    $,
    KeyEvent,
    KeyManager

) {

    'use strict';
    if (window.$) { window.$.noConflict(true); }
    // if (window._) { window._.noConflict(); }

    $(function() {

        // var c = document.getElementById('js-canvas').getContext('2d');
        // var k = new Keypad();
        // var m = new Machine();

        // console.log(window);

        // window.addEventListener(KeypadEvent.TAP, m.onKeyTap.bind(m));
        // window.addEventListener(KeypadEvent.TAP_HOLD, m.onKeyTapHold.bind(m));
        // window.addEventListener(KeypadEvent.DOUBLE_TAP, m.onKeyDblTap.bind(m));
        // window.addEventListener(KeypadEvent.DOUBLE_TAP_HOLD, m.onKeyDblTapHold.bind(m));
        // window.addEventListener(KeypadEvent.RELEASE, m.onKeyRelease.bind(m));

        // var requestId = null;
        // var isRunning = false;
        // var then, now, d;
        // var render = function(time) {
        //     requestId = window.requestAnimationFrame(render);

        //     if (!then) { then = time; }
        //     now = time;
        //     d = now - then;
        //     then = now;

        //     c.fillStyle = 'gray';
        //     c.fillRect(50, 50, 860, 440);

        //     c.fillStyle = 'black';
        //     c.font = '24px "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif';
        //     c.textAlign = 'center';
        //     c.textBaseline = 'middle';
        //     c.fillText(m.currentState, 480, 270);

        //     // console.log(d);
        // };
        // requestId = window.requestAnimationFrame(render);



        // var ed = new EventDispatcher();
        // ed.addEventListener('test', function(event){ console.log(event.target, event); })
        // ed.dispatchEvent(new CustomEvent('test'));

        function onFoo(event) { console.log(event); }

        var proto = Object.getPrototypeOf(window);
        while ( ! proto.hasOwnProperty('addEventListener')) {
            proto = Object.getPrototypeOf(proto);
        }

        function EventDispatcher() {}

        // EventDispatcher.prototype = Object.create(Object.prototype, {
        //     addEventListener: {
        //         configureable: true,
        //         enumerable: true,
        //         writable: false,
        //         value: function(type, listener, useCapture) {
        //             useCapture = !! useCapture;
        //             proto.addEventListener.call(this, type, listener, useCapture);
        //         }
        //     },
        //     removeEventListener: {
        //         configureable: true,
        //         enumerable: true,
        //         writable: false,
        //         value: function(type, listener, useCapture) {
        //             useCapture = !! useCapture;
        //             proto.removeEventListener.call(this, type, listener, useCapture);
        //         }
        //     },
        //     dispatchEvent: {
        //         configureable: true,
        //         enumerable: true,
        //         writable: false,
        //         value: function(event) {
        //             proto.dispatchEvent.call(this, event);
        //         }
        //     }
        // });

        var ed = new EventDispatcher();
        // ed.addEventListener('foo', onFoo);
        // ed.dispatchEvent(new CustomEvent('foo'));

        console.log(ed);
        console.log($('#js-main')[0]);

        proto.addEventListener.call(this, 'click', onFoo);



        // // what now?
        // var km = new KeyManager();
        // var type = function(event) { console.log(event.type, event.which); };

        // console.log(window);

        // window.addEventListener(KeyEvent.PRESS, type);
        // window.addEventListener(KeyEvent.TAP, type);
        // window.addEventListener(KeyEvent.HOLD, type);
        // window.addEventListener(KeyEvent.RELEASE, type);
        // window.addEventListener(KeyEvent.DOUBLE_TAP, type);



    });

});

/* ================================================================================================================== */
