/**
 * This file initializes the game
 */

'use strict';

window.onload = function() {
    var MainController = require('./controllers/main');
    new MainController().init();

    var event = new Event('resize');
    window.dispatchEvent(event);
};