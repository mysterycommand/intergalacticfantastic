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

    var KeyTimeouts = function KeyTimeouts() {
        this.timeoutByKey = {};

        this.onTimeout = this._onTimeout.bind(this);
    };

    KeyTimeouts.DURATION = 300;

    KeyTimeouts.prototype.getTimeout = function(key) {
        if ( !! this.timeoutByKey[key]) {
            this.timeoutByKey[key] = setTimeout(this.onTimeout, KeyTimeouts.DURATION, key);
        }

        return this.timeoutByKey[key];
    };

    KeyTimeouts.prototype._onTimeout = function(key) {
        clearInterval(this.timeoutByKey[key]);
        this.timeoutByKey[key] = 0;
    };

    return KeyTimeouts;

});

/* ================================================================================================================== */
