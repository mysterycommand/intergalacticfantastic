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

    var Running = function Running(machine) {
        this.context = machine;
    };

    Running.prototype.onKeyTap = function(event) {
        console.log(this.context.currentState, event.type);
    };

    Running.prototype.onKeyTapHold = function(event) {
        console.log(this.context.currentState, event.type);
    };

    Running.prototype.onKeyDblTap = function(event) {
        console.log(this.context.currentState, event.type);
    };

    Running.prototype.onKeyDblTapHold = function(event) {
        console.log(this.context.currentState, event.type);
    };

    return Running;

});

/* ================================================================================================================== */
