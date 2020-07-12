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

    var Crawling = function Crawling(machine) {
        this.context = machine;
    };

    Crawling.prototype.onKeyTap = function(event) {
        // console.log(this.context.currentState, event.type);
        switch (event.which) {
            case Keys.LEFT:
                if (Keys.keysDown[Keys.RIGHT]) {
                    this.context.setState('ducking');
                }
                break;

            case Keys.RIGHT:
                if (Keys.keysDown[Keys.LEFT]) {
                    this.context.setState('ducking');
                }
                break;

            case Keys.UP:
                this.context.setState('walking');
                break;
        }
    };

    Crawling.prototype.onKeyTapHold = function(event) {
        console.log(this.context.currentState, event.type);
    };

    Crawling.prototype.onKeyDblTap = function(event) {
        console.log(this.context.currentState, event.type);
    };

    Crawling.prototype.onKeyDblTapHold = function(event) {
        console.log(this.context.currentState, event.type);
    };

    Crawling.prototype.onKeyRelease = function(event) {
        // console.log(this.context.currentState, event.type);
        // if (Keys.keysDown[Keys.RIGHT] || Keys.keysDown[Keys.LEFT]) {
        //     this.context.setState(this.context.previousState);
        // } else if (Keys.keysDown[Keys.DOWN]) {
        //     this.context.setState('ducking');
        // }
    };

    return Crawling;

});

/* ================================================================================================================== */
