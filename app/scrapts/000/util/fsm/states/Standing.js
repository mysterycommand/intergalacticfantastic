/** ================================================================================================================ **/
/**
 * @fileOverview
 *
 * @author Matt Hayes <matt@mysterycommand.com>
 * @version 0.0.1
 */
/* ================================================================================================================== */

define([

    'util/keys/Keys'

], function (

    Keys

) {

    'use strict';

    var Standing = function Standing(machine) {
        this.context = machine;
    };

    Standing.prototype.onKeyTap = function(event) {
        // console.log(this.context.currentState, event.type);
        switch (event.which) {
            case Keys.LEFT:
            case Keys.RIGHT:
                this.context.setState('walking');
                break;

            case Keys.UP:
                this.context.setState('jumping');
                break;

            case Keys.DOWN:
                this.context.setState('ducking');
                break;
        }
    };

    Standing.prototype.onKeyTapHold = function(event) {
        // console.log(this.context.currentState, event.type);
    };

    Standing.prototype.onKeyDblTap = function(event) {
        // console.log(this.context.currentState, event.type);
    };

    Standing.prototype.onKeyDblTapHold = function(event) {
        // console.log(this.context.currentState, event.type);
    };

    Standing.prototype.onKeyRelease = function(event) {
        // console.log(this.context.currentState, event.type);
        // if (Keys.keysDown[Keys.RIGHT] || Keys.keysDown[Keys.LEFT]) {
        //     this.context.setState(this.context.previousState);
        // } else if (Keys.keysDown[Keys.DOWN]) {
        //     this.context.setState('ducking');
        // }
    };

    return Standing;

});

/* ================================================================================================================== */
