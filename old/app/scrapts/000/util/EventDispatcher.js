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

    var EventDispatcher = function EventDispatcher() {
        this.eventTarget = new EventTarget();
    };

    EventDispatcher.prototype.addEventListener = function(type, listener, useCapture) {
        this.eventTarget.addEventListener(type, listener, useCapture);
    };

    EventDispatcher.prototype.removeEventListener = function(type, listener, useCapture) {
        this.eventTarget.removeEventListener(type, listener, useCapture);
    };

    EventDispatcher.prototype.dispatchEvent = function(event) {
        event.target = this;
        this.eventTarget.dispatchEvent(event);
    };

    return EventDispatcher;

});

/* ================================================================================================================== */
