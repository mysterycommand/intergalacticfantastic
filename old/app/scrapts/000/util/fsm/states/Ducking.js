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

    var Ducking = function Ducking(machine) {
        this.context = machine;
    };

    Ducking.prototype.onKeyTap = function(event) {
        // console.log(this.context.currentState, event.type);
        switch (event.which) {
            case Keys.LEFT:
            case Keys.RIGHT:
                this.context.setState('crawling');
                break;

            case Keys.UP:
                this.context.setState('standing');
                break;
        }
    };

    Ducking.prototype.onKeyTapHold = function(event) {
        // console.log(this.context.currentState, event.type);
    };

    Ducking.prototype.onKeyDblTap = function(event) {
        // console.log(this.context.currentState, event.type);
    };

    Ducking.prototype.onKeyDblTapHold = function(event) {
        // console.log(this.context.currentState, event.type);
    };

    Ducking.prototype.onKeyRelease = function(event) {
        // console.log(this.context.currentState, event.type);
        // if (Keys.keysDown[Keys.RIGHT] || Keys.keysDown[Keys.LEFT]) {
        //     this.context.setState(this.context.previousState);
        // } else {
        //     this.context.setState('standing');
        // }
    };

    return Ducking;

});

/* ================================================================================================================== */
