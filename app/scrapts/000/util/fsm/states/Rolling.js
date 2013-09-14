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

    var Rolling = function Rolling(machine) {
        this.context = machine;
    };

    Rolling.prototype.onKeyTap = function(event) {
        console.log(this.context.currentState, event.type);
    };

    Rolling.prototype.onKeyTapHold = function(event) {
        console.log(this.context.currentState, event.type);
    };

    Rolling.prototype.onKeyDblTap = function(event) {
        console.log(this.context.currentState, event.type);
    };

    Rolling.prototype.onKeyDblTapHold = function(event) {
        console.log(this.context.currentState, event.type);
    };

    return Rolling;

});

/* ================================================================================================================== */
