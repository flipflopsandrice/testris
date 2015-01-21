/**
 * This renders the UI
 */

var uiView = function() {
    this.context = false;

    this.buttons = {};

    this.draw = function(context) {
        this.context = context;

        this.drawHeader();
    };

    this.drawHeader = function() {
        this.context.font = '10pt monospace';
        this.context.fillStyle = '#FFFFFF';
        this.context.fillText('TESTRIS', 25, 25);
    };

    return this;
};

module.exports = uiView;
