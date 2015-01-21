/**
 * This renders the UI
 */

var uiView = function() {
    this.context = false;
    this.score = false;

    this.draw = function(context, score) {

        this.context = context;
        this.score = score;

        this.drawBasics();
    };

    this.drawBasics = function() {

        this.context.fillStyle = "#ffffff";
        this.context.fillRect( 0, 0, this.context.canvas.width, this.context.canvas.height );

        this.context.font = '10pt monospace';
        this.context.fillStyle = '#000000';
        this.context.fillText('TESTRIS - hit space or tap to start', 25, 25);

        if (this.score) {
            this.context.font = '10pt monospace';
            this.context.fillStyle = '#000000';
            this.context.fillText('Your score was: ' + this.score, 25, 50);
        }
    };

    return this;
};

module.exports = uiView;
