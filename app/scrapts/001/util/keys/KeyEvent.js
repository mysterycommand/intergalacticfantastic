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

    // var eventKeys = Object.keys(new KeyboardEvent(null));

    var KeyEvent = function KeyEvent(type, originalEvent) {
        var keyEvent = new CustomEvent(type);

        eventKeys.forEach(function(key) {
            keyEvent[key] = originalEvent[key];
        });
        keyEvent.originalEvent = originalEvent;

        return keyEvent;
    };

    KeyEvent.PRESS = 'press';
    KeyEvent.TAP = 'tap';
    KeyEvent.HOLD = 'hold';
    KeyEvent.DOUBLE_TAP = 'dbltap';
    KeyEvent.RELEASE = 'release';

    return KeyEvent;

});

/* ================================================================================================================== */
