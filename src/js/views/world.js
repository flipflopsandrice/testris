/**
 * The world renderer. This renders the game.
 */

var worldView = function() {

    var uiView   = require('./ui'),
        gridView = require('./grid'),
        openView = require('./open');

    this.element = false;
    this.context = false;

    this.playing = false;
    this.interface = {
        ui: false,
        grid: false,
        open: false
    };
    this.score = 0;

    this.init = function( playing ) {
        this.playing = playing;
        this.element = document.getElementById('world');
        this.context = this.element.getContext("2d");

        this.interface.ui   = new uiView();
        this.interface.grid = new gridView();
        this.interface.open = new openView();

        this.addListeners();
        this.resize();
    };

    this.addListeners = function() {
        window.addEventListener('resize', this.resize.bind(this));
    };

    this.resize = function() {
        var ratioWidth = 640,
            ratioHeight = 360;

        if (window.innerWidth < window.innerHeight) {
            ratioWidth = 360;
            ratioHeight = 640;
        }

        var scale_width  = window.innerWidth / ratioWidth,
            scale_height = window.innerHeight / ratioHeight,
            scale        = Math.min(scale_width, scale_height);

        var newWidth  = ratioWidth * scale,
            newHeight = ratioHeight * scale;

        if (this.context.canvas.width != newWidth ||
            this.context.canvas.height != newHeight) {
            this.context.canvas.width = newWidth;
            this.context.canvas.height = newHeight;

            var marginTop = Math.round(this.context.canvas.height / 2);
            var marginLeft = Math.round(this.context.canvas.width / 2);

            this.context.canvas.offsetX = (window.innerWidth - this.context.canvas.width) / 2;
            this.context.canvas.offsetY = (window.innerHeight - this.context.canvas.height) / 2;

            this.element.style.marginTop = "-" + marginTop + "px";
            this.element.style.marginLeft = "-" + marginLeft + "px";
        }

        this.draw()
    };


    this.draw = function(data, score, block, blockID, nextBlock) {
        if (score)
            this.score = score;

        if (this.playing) {
            this.interface.grid.draw(this.context, data, score, block, blockID, nextBlock);
            this.interface.ui.draw(this.context, score);
        } else {
            this.interface.open.draw(this.context, this.score);
        }
    };

    return this;
};

module.exports = worldView;