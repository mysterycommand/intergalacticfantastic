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
`
    var Walking = function Walking(machine) {
        this.context = machine;
    };

    Walking.prototype.onKeyTap = function(event) {
        // console.log(this.context.currentState, event.type);
        switch (event.which) {
            case Keys.LEFT:
                if (Keys.keysDown[Keys.RIGHT]) {
                    this.context.setState('standing');
                }
                break;

            case Keys.RIGHT:
                if (Keys.keysDown[Keys.LEFT]) {
                    this.context.setState('standing');
                }
                break;

            case Keys.UP:
                this.context.setState('jumping');
                break;

            case Keys.DOWN:
                this.context.setState('crawling');
                break;
        }
    };

    Walking.prototype.onKeyTapHold = function(event) {
        // console.log(this.context.currentState, event.type);
    };

    Walking.prototype.onKeyDblTap = function(event) {
        // console.log(this.context.currentState, event.type);
    };

    Walking.prototype.onKeyDblTapHold = function(event) {
        // console.log(this.context.currentState, event.type);
    };

    Walking.prototype.onKeyRelease = function(event) {
        // console.log(this.context.currentState, event.type);
        // if (Keys.keysDown[Keys.RIGHT] || Keys.keysDown[Keys.LEFT]) {
        //     this.context.setState(this.context.previousState);
        // }
    };

    return Walking;

});

/* ================================================================================================================== */
