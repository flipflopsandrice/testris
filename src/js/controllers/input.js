/**
 * This controller handles the user input
 */

var inputController = function(mainController) {

    this.mainController = mainController;

    this.keypressListener = false;
    this.clickListener    = false;

    this.init = function() {
        this.addListeners();
    };

    this.addListeners = function() {
        if (!this.keypressListener) {
            this.keypressListener = this.keypress.bind(this);
            window.addEventListener('keydown', this.keypressListener);
        }

        if (!this.clickListener) {
            this.clickListener = this.click.bind(this);
            window.addEventListener('click', this.clickListener);
            window.addEventListener('touchstart', this.clickListener);
        }
    };

    this.keypress = function(e) {

        if (this.mainController.playing) {
            if ([37, 39].indexOf(e.keyCode) > -1) {
                this.execute("move", (38 - e.keyCode) * -1);
            }

            if (40 === e.keyCode) {
                this.execute("down");
            }

            if (38 === e.keyCode) {
                this.execute("rotate");
            }

            if (27 == e.keyCode) {
                this.mainController.stop();
            }

        } else {
            if (32 == e.keyCode) {
                this.mainController.start();
            }
        }
    };

    this.click = function(e) {
        if (this.mainController.playing) {
            var x = event.pageX,
                y = event.pageY;

            var button = this.mainController.views.world.interface.grid.buttonAt(
                x - this.mainController.views.world.context.canvas.offsetX,
                y - this.mainController.views.world.context.canvas.offsetY
            );

            if (button) {
                this.execute(button.name, button.param);
            }
        } else {
            this.mainController.start();
        }
    };

    this.execute = function(command, param) {
        switch(command) {
            case "move":
                this.mainController.controllers.game.move( param, 0 );
                break;
            case "down":
                this.mainController.controllers.game.move( 0, 1 );
                break;
            case "rotate":
                this.mainController.controllers.game.rotate();
                break;
        }
    };

    this.detach = function() {
        window.removeEventListener('keydown',   this.keypressListener);
        window.removeEventListener('click',     this.clickListener);
        window.removeEventListener('touchstart',this.clickListener);
    };

    return this;
};

module.exports = inputController;