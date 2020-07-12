/** ================================================================================================================ **/
/**
 * @fileOverview
 *
 * @author Matt Hayes <matt@mysterycommand.com>
 * @version 0.0.1
 */
/* ================================================================================================================== */

define([

    'util/keys/Keys',
    'util/keys/KeypadEvent'

], function (

    Keys,
    KeypadEvent

) {

    'use strict';

    var Keypad = function Keypad() {
        this.keysTapTimeoutIds = {};
        this.keysDblTapTimeoutIds = {};

        window.addEventListener('keydown', this.onKeyDown.bind(this));
        window.addEventListener('keyup', this.onKeyUp.bind(this));
    };

    Keypad.prototype.onKeyDown = function(event) {
        // event.preventDefault();

        if (Keys.keysUp[event.which]) {
            this.onKeyDblTap(event);
            return;
        }
        if (Keys.keysDown[event.which]) { return; }
        this.onKeyTap(event);
    };

    Keypad.prototype.onKeyTap = function(event) {
        Keys.keysDown[event.which] = Date.now();
        Keys.keysUp[event.which] = 0;

        var e = KeypadEvent.make(KeypadEvent.TAP, event);
        window.dispatchEvent(e);

        this.keysTapTimeoutIds[event.which] = window.setTimeout(this.onKeyTapTimeout.bind(this), 200, event);
    };

    Keypad.prototype.onKeyTapTimeout = function(event) {
        var e = KeypadEvent.make(KeypadEvent.TAP_HOLD, event);
        window.dispatchEvent(e);
    };

    Keypad.prototype.onKeyDblTap = function(event) {
        Keys.keysDown[event.which] = Date.now();
        Keys.keysUp[event.which] = 0;

        var e = KeypadEvent.make(KeypadEvent.DOUBLE_TAP, event);
        window.dispatchEvent(e);

        this.keysDblTapTimeoutIds[event.which] = window.setTimeout(this.onKeyDblTapTimeout.bind(this), 200, event);
    };

    Keypad.prototype.onKeyDblTapTimeout = function(event) {
        var e = KeypadEvent.make(KeypadEvent.DOUBLE_TAP_HOLD, event);
        window.dispatchEvent(e);
    };

    Keypad.prototype.onKeyUp = function(event) {
        // event.preventDefault();

        Keys.keysDown[event.which] = 0;
        Keys.keysUp[event.which] = Date.now();

        var e = KeypadEvent.make(KeypadEvent.RELEASE, event);
        window.dispatchEvent(e);

        if (this.keysTapTimeoutIds[event.which]) { window.clearTimeout(this.keysTapTimeoutIds[event.which]); }
        if (this.keysDblTapTimeoutIds[event.which]) { window.clearTimeout(this.keysDblTapTimeoutIds[event.which]); }

        window.setTimeout(this.onKeyUpTimeout.bind(this), 200, event);
    };

    Keypad.prototype.onKeyUpTimeout = function(event) {
        Keys.keysUp[event.which] = 0;
    };

    return Keypad;

});

/* ================================================================================================================== */
