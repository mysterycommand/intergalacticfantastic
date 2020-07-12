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

    var KeypadEvent = function KeypadEvent() {};

    // Apparently, extending KeyboardEvent is difficult if not impossible.
    KeypadEvent.make = function(type, srcEvent) {
        var e = new CustomEvent(type);

        e.altGraphKey = srcEvent.altGraphKey;
        e.altKey = srcEvent.altKey;
        e.charCode = srcEvent.charCode;
        e.ctrlKey = srcEvent.ctrlKey;
        e.keyCode = srcEvent.keyCode;
        e.keyIdentifier = srcEvent.keyIdentifier;
        e.location = srcEvent.location;
        e.metaKey = srcEvent.metaKey;
        e.shiftKey = srcEvent.shiftKey;
        e.timeStamp = Date.now();
        e.which = srcEvent.which;

        return e;
    };

    KeypadEvent.TAP = 'keytap';
    KeypadEvent.TAP_HOLD = 'keytaphold';
    KeypadEvent.DOUBLE_TAP = 'keydbltap';
    KeypadEvent.DOUBLE_TAP_HOLD = 'keydbltaphold';
    KeypadEvent.RELEASE = 'keyrelease';

    return KeypadEvent;

});

/* ================================================================================================================== */
