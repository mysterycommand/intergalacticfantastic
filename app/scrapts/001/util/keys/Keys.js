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

    var Keys = function Keys() {};

    Keys.validKeys = [
        // 8, // "Delete"
        // 9, // "Tab"
        13, // "Enter"
        16, // "Shift"
        17, // "Control"
        18, // "Alt"
        // 20, // "CapsLock"
        // 27, // "Esc"
        32, // "Space"
        37, // "Left"
        38, // "Up"
        39, // "Right"
        40 // "Down"
        // 91  // "Meta Left"
        // 93  // "Meta Right"
    ];
    Keys.isValidKey = function(key) {
        return Keys.validKeys.indexOf(key) !== -1;
    };

    Keys.downList = [];
    Keys.downMap = {};
    Keys.down = function(key) {
        if ( ! Keys.isValidKey(key)) { return; }

        if (Keys.downList.indexOf(key)) {
            Keys.downMap[key] = Date.now();
            Keys.downList.push(key);
        }

        var i = Keys.upList.indexOf(key)
        if (i !== -1) {
            Keys.upMap[key] = 0;
            Keys.upList.splice(i, 1);
        }

        // console.log('downMap:', Keys.downMap);
        // console.log('downList:', Keys.downList);
        // console.log('');
    };
    Keys.isDown = function(key) {
        // console.log(( !! Keys.downMap[key]), Keys.downMap[key]);
        return ( !! Keys.downMap[key]);
    };

    Keys.upList = [];
    Keys.upMap = {};
    Keys.up = function(key) {
        if ( ! Keys.isValidKey(key)) { return; }

        if (Keys.upList.indexOf(key)) {
            Keys.upMap[key] = Date.now();
            Keys.upList.push(key);
        }

        var i = Keys.downList.indexOf(key)
        if (i !== -1) {
            Keys.downMap[key] = 0;
            Keys.downList.splice(i, 1);
        }

        // console.log('upMap:', Keys.upMap);
        // console.log('upList:', Keys.upList);
        // console.log('');
    };

    return Keys;

});

/* ================================================================================================================== */
