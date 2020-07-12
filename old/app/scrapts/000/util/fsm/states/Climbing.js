/** ================================================================================================================ **/
/**
 * @fileOverview
 *
 * @author Matt Hayes <matt@mysterycommand.com>
 * @version 0.0.1
 */
/* ================================================================================================================== */

define([
], function (
) {

    'use strict';

    var Climbing = function Climbing(machine) {
        this.context = machine;
    };

    Climbing.prototype.onKeyTap = function(event) {
        console.log(this.context.currentState, event.type);
    };

    Climbing.prototype.onKeyTapHold = function(event) {
        console.log(this.context.currentState, event.type);
    };

    Climbing.prototype.onKeyDblTap = function(event) {
        console.log(this.context.currentState, event.type);
    };

    Climbing.prototype.onKeyDblTapHold = function(event) {
        console.log(this.context.currentState, event.type);
    };

    return Climbing;

});

/* ================================================================================================================== */
