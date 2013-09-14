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

    function Field(d, u, v) {
    }

    Field.prototype = Object.create(Object.prototype, {
        constructor: {
            configurable: true,
            enumerable: true,
            writable: false,
            value: Field
        }
    });

    return Field;

});

/* ================================================================================================================== */
