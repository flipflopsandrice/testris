/**
 * This controller handles the main logic
 */

var mainController = function() {

    var gameController  = require('./game');
    var inputController = require('./input');
    var soundController = require('./sound');
    var worldView       = require('./../views/world');

    this.playing    = false;

    this.tickLength = 1000;
    this.tickTimer  = false;
    this.tickStart  = false;
    this.tickPhases = {
        300000:  1.5,
        600000:  2.0,
        900000:  2.5,
        1200000: 3.0,
        1500000: 3.5,
        1800000: 4.5,
        2100000: 5.5
    };

    this.controllers = {
        game: false,
        input: false,
        sound: false
    };

    this.views = {
        world: false
    };

    this.init = function() {
        this.controllers.sound = new soundController(this);
        this.controllers.game  = new gameController(this);
        this.controllers.input = new inputController(this);
        this.views.world       = new worldView();

        this.bootup();
    };

    this.bootup = function() {
        this.views.world.init( this.playing );

        this.controllers.sound.init();
        this.controllers.input.init();
    };

    this.start = function() {
        this.playing = true;

        this.controllers.game.init();
        this.controllers.input.init();

        this.views.world.init(this.playing);

        this.tick();
    };


    this.tick = function() {
        if (!this.tickTimer) {
            this.setTickTimer(1);
            this.tickStart = new Date();
        }


        for(var ms in this.tickPhases) {
            var now = new Date();

            if (this.tickStart.getTime() + parseInt(ms) <= now.getTime()) {
                this.setTickTimer(this.tickPhases[ms]);
                delete this.tickPhases[ms];
                this.controllers.sound.play('levelup');
            }
        }

        this.controllers.game.move(0, 1);
    };

    this.setTickTimer = function(factor) {
        if (this.tickTimer)
            clearInterval( this.tickTimer );

        this.tickTimer = setInterval(this.tick.bind(this), this.tickLength / factor);
    };

    this.stop = function() {
        this.playing = false;
        clearInterval( this.tickTimer );
        this.tickTimer = false;
        this.detach();
        this.bootup();
    };

    this.detach = function() {
        this.controllers.game.detach();
        this.controllers.sound.stop();
    };

    return this;
};

module.exports = mainController;


