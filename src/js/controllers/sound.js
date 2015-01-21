/**
 * This controller handles the sound output
 */

var soundController = function(mainController) {

    this.mainController = mainController;
    this.howler = require('../../../bower_components/howler.js/howler.js');

    this.sounds = {};

    this.init = function() {

        this.sounds['rotate'] = new Howl({
            urls: ['res/audio/rotate.mp3'],
            volume:.3,
            loop: false
        });

        this.sounds['move'] = new Howl({
            urls: ['res/audio/move.mp3'],
            volume:.2,
            loop: false
        });

        this.sounds['down'] = new Howl({
            urls: ['res/audio/down.mp3'],
            volume:.2,
            loop: false
        });

        this.sounds['cantmove'] = new Howl({
            urls: ['res/audio/cantmove.mp3'],
            volume:.4,
            loop: false
        });

        this.sounds['score'] = new Howl({
            urls: ['res/audio/score.mp3'],
            volume:.4,
            loop: false
        });

        this.sounds['levelup'] = new Howl({
            urls: ['res/audio/levelup.mp3'],
            volume:.4,
            loop: false
        });
    };

    this.play = function(snd, fade) {
        if (snd) {
            if (fade) {
                this.sounds[snd].fade(0, .7, 1000);
            } else {
                this.sounds[snd].play();
            }
        }
    };

    this.stop = function(snd, fade) {
        if (snd) {
            if (fade) {
                this.sounds[snd].fade(.7, 0, 1000);
            } else {
                this.sounds[snd].stop();
            }
        } else {
            for (var snd in this.sounds) {
                this.sounds[snd].stop();
            }
        }
    };

    this.mute = function(mute) {
        Howler.volume( mute ? 0 : 1 );
    };

    return this;
};

module.exports = soundController;