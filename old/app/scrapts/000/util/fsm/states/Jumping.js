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

    var Jumping = function Jumping(machine) {
        this.context = machine;
    };

    Jumping.prototype.onKeyTap = function(event) {
        // console.log(this.context.currentState, event.type);
    };

    Jumping.prototype.onKeyTapHold = function(event) {
        // console.log(this.context.currentState, event.type);
    };

    Jumping.prototype.onKeyDblTap = function(event) {
        // console.log(this.context.currentState, event.type);
    };

    Jumping.prototype.onKeyDblTapHold = function(event) {
        // console.log(this.context.currentState, event.type);
    };

    Jumping.prototype.onKeyRelease = function(event) {
        // console.log(this.context.currentState, event.type);
        // if (Keys.keysDown[Keys.RIGHT] || Keys.keysDown[Keys.LEFT]) {
        //     this.context.setState(this.context.previousState);
        // }
    };

    return Jumping;

});

/* ================================================================================================================== */
