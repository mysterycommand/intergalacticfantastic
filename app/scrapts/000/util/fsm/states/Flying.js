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

    var Flying = function Flying(machine) {
        this.context = machine;
    };

    Flying.prototype.onKeyTap = function(event) {
        console.log(this.context.currentState, event.type);
    };

    Flying.prototype.onKeyTapHold = function(event) {
        console.log(this.context.currentState, event.type);
    };

    Flying.prototype.onKeyDblTap = function(event) {
        console.log(this.context.currentState, event.type);
    };

    Flying.prototype.onKeyDblTapHold = function(event) {
        console.log(this.context.currentState, event.type);
    };

    return Flying;

});

/* ================================================================================================================== */
