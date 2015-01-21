/**
 * This renders the grid
 */

var gridView = function() {

    var mobileTools = require('./../tools/mobile');
    this.mobileTools = new mobileTools();

    this.context   = false;
    this.data      = false;
    this.score     = 0;
    this.blocks    = {};
    this.nextBlock = false;

    this.buttons = [];

    this.positions = {
        orientation: 'h',
        block: {
            padding: 5
        },
        grid: {
            top: 0,
            left: 0,
            width: false,
            height: false
        },
        scoreboard: {
            top: 0,
            left: 0,
            width: false,
            height: false,
            padding: 20
        }
    };

    this.draw = function(context, data, score, activeBlock, activeBlockID, nextBlock) {
        this.context = context;

        if (nextBlock) this.nextBlock = nextBlock;
        if (activeBlockID && activeBlock) this.blocks[activeBlockID] = activeBlock;
        if (data) this.data = data;
        if (score) this.score = score;

        var canvas = {
            width: this.context.canvas.width,
            height: this.context.canvas.height
        };

        // detect and set game orientation
        if (canvas.width >= canvas.height) {
            this.positions.orientation = 'h';

            this.positions.grid.top = 0;
            this.positions.grid.left = 0;
            this.positions.grid.width = canvas.width * .75;
            this.positions.grid.height= canvas.height;

            this.positions.scoreboard.top = 0;
            this.positions.scoreboard.left = this.positions.grid.width;
            this.positions.scoreboard.width = canvas.width - this.positions.grid.width;
            this.positions.scoreboard.height= canvas.height;

        } else {
            this.positions.orientation = 'v';

            this.positions.grid.top = 0;
            this.positions.grid.left = 0;
            this.positions.grid.width = canvas.width;
            this.positions.grid.height= canvas.height *.50;

            this.positions.scoreboard.top = this.positions.grid.height;
            this.positions.scoreboard.left = 0;
            this.positions.scoreboard.width = canvas.width;
            this.positions.scoreboard.height= canvas.height - this.positions.grid.height;
        }

        this.drawBackground();
        this.drawScoreboard();
        this.drawData();
    };

    this.drawBackground= function() {
        this.context.fillStyle = "#444";
        this.context.fillRect( 0, 0, this.context.canvas.width, this.context.canvas.height );
    };

    this.drawScoreboard = function() {

        // draw scoreboard background
        this.context.fillStyle = "#1c1c1c";
        this.context.fillRect(
            this.positions.scoreboard.left,
            this.positions.scoreboard.top,
            this.positions.scoreboard.width,
            this.positions.scoreboard.height
        );

        // draw score
        this.context.font = '15pt monospace';
        this.context.fillStyle = '#FFFFFF';
        this.context.fillText(
            'Score: ' + this.score,
            this.positions.scoreboard.left + this.positions.scoreboard.padding,
            this.positions.scoreboard.top  + this.positions.scoreboard.padding
        );

        // draw next block, if available
        if (this.nextBlock) {
            this.context.font = '10pt monospace';
            this.context.fillStyle = '#999';
            this.context.fillText(
                'Next block ',
                this.positions.scoreboard.left + this.positions.scoreboard.padding,
                this.positions.scoreboard.top  + this.positions.scoreboard.padding + 25
            );

            var blockWidth  = Math.round(this.positions.scoreboard.width / 2 / this.nextBlock.shape[0].length);
            var blockHeight = blockWidth;

            if (this.positions.scoreboard.width > this.positions.scoreboard.height) {
                blockHeight = Math.round(this.positions.scoreboard.height / 3 / this.nextBlock.shape[0].length);
                blockWidth  = blockHeight;
            }

            // draw the actual block shape
            this.drawBlocks(
                this.positions.scoreboard.left + this.positions.scoreboard.padding,
                this.positions.scoreboard.top + 60,
                blockWidth,
                blockHeight,
                this.nextBlock.shape
            );
        }

        // draw control buttons for touch devices
        if (this.mobileTools.isMobileDevice()) {
            var btnWidth = (this.positions.scoreboard.width / 3) - (this.positions.scoreboard.width / 12),
                btnHeight = (this.positions.scoreboard.height  / 6),
                btnMarginRight = btnWidth * .1;

            var btnOffsetX = this.positions.scoreboard.left + this.positions.scoreboard.padding;

            if (this.positions.scoreboard.width > this.positions.scoreboard.height) {
                btnOffsetX += this.positions.scoreboard.width/2;
                btnWidth /=2;
                btnMarginRight/=2;
                btnHeight*=2;
            }

            if (btnWidth < btnHeight)
                btnHeight = btnWidth;
            else
                btnWidth = btnHeight;



            var btnOffsetY = this.positions.scoreboard.top + this.positions.scoreboard.height - this.positions.scoreboard.padding - btnHeight;

            this.addButton(
                'up', 'rotate',
                btnOffsetX + btnWidth + btnMarginRight,
                btnOffsetY - btnHeight - 10,
                btnWidth, btnHeight
            );

            this.addButton(
                'down', 'down',
                btnOffsetX + btnWidth + btnMarginRight,
                btnOffsetY,
                btnWidth, btnHeight
            );

            this.addButton(
                'left', 'move',
                btnOffsetX,
                btnOffsetY,
                btnWidth, btnHeight, -1
            );

            this.addButton(
                'right', 'move',
                btnOffsetX + btnWidth + btnMarginRight + btnWidth + btnMarginRight,
                btnOffsetY,
                btnWidth, btnHeight, 1
            );
        }
    };

    this.drawData = function() {

        if (!this.data) return false;

        var dataWidth = this.positions.grid.width;
        var blockWidth = Math.round(dataWidth / this.data[0].length);
        var blockHeight = Math.round(this.positions.grid.height / this.data.length);

        this.drawBlocks(
            this.positions.grid.top,
            this.positions.grid.left,
            blockWidth,
            blockHeight,
            this.data
        );
    };

    this.drawBlocks = function (offsetX, offsetY, blockWidth, blockHeight, blocks) {
        for (var row=0; row < blocks.length; row++) {
            for (var col=0; col < blocks[row].length; col++) {
                if (blocks[row][col] > 0) {
                    this.drawBlock(
                        offsetX + (col * blockWidth) - this.positions.block.padding,
                        offsetY + (row * blockHeight) - this.positions.block.padding,
                        blockWidth, blockHeight,
                        typeof this.blocks[ blocks[row][col]] === "object" ? this.blocks[ blocks[row][col]].color : this.nextBlock.color
                    )
                }
            }
        }
    };

    this.drawBlock = function(x, y, width, height, color) {

        this.context.fillStyle = color;
        this.context.fillRect(
            x + this.positions.block.padding,
            y + this.positions.block.padding,
            width - (this.positions.block.padding),
            height - (this.positions.block.padding)
        );
    };

    this.addButton = function(title, name, x, y, width, height, param) {

        var padding = 2;

        this.context.fillStyle = '#333';
        this.context.fillRect(x, y, width, height);

        this.context.fillStyle = '#555';
        this.context.fillRect(x+padding, y+padding, width-(padding*2), height-(padding*2));

        // mute button
        this.context.font = '7pt monospace';
        this.context.fillStyle = '#fff';
        this.context.fillText(name, x+5, y+height/2);

        this.buttons.push({
            title: title,
            x: x,
            y: y,
            width: width,
            height: height,
            name: name,
            param: param
        })
    };

    this.buttonAt = function (x,y) {
        for (var b=0; b<this.buttons.length; b++) {
            if ((x > this.buttons[b].x && x < this.buttons[b].x + this.buttons[b].width) &&
                (y > this.buttons[b].y && y < this.buttons[b].y + this.buttons[b].height)) {
                return this.buttons[b];
            }
        }
    }

    return this;
};

module.exports = gridView;
