/** ================================================================================================================ **/
/**
 * @fileOverview
 *
 * @author Matt Hayes <matt@mysterycommand.com>
 * @version 0.0.1
 */
/* ================================================================================================================== */

define([

    'util/fsm/states/Standing',
    'util/fsm/states/Walking',
    'util/fsm/states/Running',
    'util/fsm/states/Climbing',
    'util/fsm/states/Jumping',
    'util/fsm/states/Flying',
    'util/fsm/states/Ducking',
    'util/fsm/states/Crawling',
    'util/fsm/states/Rolling'

], function (

    Standing,
    Walking,
    Running,
    Climbing,
    Jumping,
    Flying,
    Ducking,
    Crawling,
    Rolling

) {

    'use strict';

    var Machine = function Machine() {
        this.currentState = '';
        this.previousState = '';
        this.states = {
            'standing': new Standing(this),
            'walking': new Walking(this),
            'running': new Running(this),
            'climbing': new Climbing(this),
            'jumping': new Jumping(this),
            'flying': new Flying(this),
            'ducking': new Ducking(this),
            'crawling': new Crawling(this),
            'rolling': new Rolling(this)
        };

        this.setState('standing');
    };

    Machine.prototype.setState = function(state) {
        if (this.currentState === state) { return; }

        this.previousState = this.currentState || state;
        this.currentState = state;
    };

    Machine.prototype.onKeyTap = function(event) {
        if (event.which < 37 || event.which > 40) { return; }
        // console.log(event.type, event.which);
        this.states[this.currentState].onKeyTap(event);
    };

    Machine.prototype.onKeyTapHold = function(event) {
        if (event.which < 37 || event.which > 40) { return; }
        // console.log(event.type, event.which);
        this.states[this.currentState].onKeyTapHold(event);
    };

    Machine.prototype.onKeyDblTap = function(event) {
        if (event.which < 37 || event.which > 40) { return; }
        // console.log(event.type, event.which);
        this.states[this.currentState].onKeyDblTap(event);
    };

    Machine.prototype.onKeyDblTapHold = function(event) {
        if (event.which < 37 || event.which > 40) { return; }
        // console.log(event.type, event.which);
        this.states[this.currentState].onKeyDblTapHold(event);
    };

    Machine.prototype.onKeyRelease = function(event) {
        if (event.which < 37 || event.which > 40) { return; }
        // console.log(event.type, event.which);
        this.states[this.currentState].onKeyRelease(event);
    };

    return Machine;

});

/* ================================================================================================================== */
