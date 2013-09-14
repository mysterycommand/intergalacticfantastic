/** ================================================================================================================ **/
/**
 * @fileOverview
 *
 * @author Matt Hayes <matt@mysterycommand.com>
 * @version 0.0.1
 */
/* ================================================================================================================== */

define([

    // 'util/keys/Keys',
    'util/keys/KeyEvent'

], function (

    // Keys,
    KeyEvent

) {

    'use strict';

    var KeyManager = function KeyManager() {
        this.keysDown = {};
        this.keysTapped = {};

        this.onKeyDown = this._onKeyDown.bind(this);
        this.onKeyUp = this._onKeyUp.bind(this);

        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup', this.onKeyUp);
    };

    KeyManager.prototype.isValidKey = function(key) {
        return [
            // 8, // "Delete"
            // 9, // "Tab"
            13, // "Enter"
            16, // "Shift"
            17, // "Control"
            18, // "Alt"
            // 20, // "CapsLock"
            // 27, // "Esc"
            32, // "Space"
            37, // "Left"
            38, // "Up"
            39, // "Right"
            40 // "Down"
            // 91  // "Meta Left"
            // 93  // "Meta Right"
        ].indexOf(key) !== -1;
    };

    KeyManager.prototype.isDown = function(key) {
        return !! this.keysDown[key];
    };

    KeyManager.prototype._onKeyDown = function(event) {
        // console.log(event.type, event.which);
        if ( ! this.isValidKey(event.which)) { return; }
        if (this.isDown(event.which)) { return; }

        this.keysDown[event.which] = Date.now();
        window.dispatchEvent(new KeyEvent(KeyEvent.PRESS, event));
    };

    KeyManager.prototype._onKeyUp = function(event) {
        // console.log(event.type, event.which);
        if ( ! this.isValidKey(event.which)) { return; }

        window.dispatchEvent(new KeyEvent(KeyEvent.RELEASE, event));
    };

    return KeyManager;

});

/* ================================================================================================================== */
