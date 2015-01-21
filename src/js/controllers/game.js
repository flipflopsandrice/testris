/**
 * This controller handles the game logic & checking
 */

var gameController = function(mainController) {

    var gridModel  = require('../models/grid');
    var blockModel = require('../models/block');

    this.mainController = mainController;
    this.grid      = false;
    this.block     = false;
    this.blockID   = 0;
    this.score     = 0;
    this.nextBlock = false;
    this.blockingEnabled = false;

    this.init = function() {
        this.grid = new gridModel();
        this.score = 0;
    };

    this.move = function(moveX, moveY) {

        if (!this.grid)
            this.init();

        var blockMoved = false;

        if (this.fieldEmpty())
            this.spawnBlock();
        else
            blockMoved = this.moveBlock(moveX, moveY);

        !blockMoved && this.checkScorableConditions();

        this.mainController.views.world.draw(this.grid, this.score, this.block, this.blockID, this.nextBlock);
    };

    this.checkScorableConditions = function() {

        var fullRows = [];

        for(var row = 0; row < this.grid.length; row++) {
            if (this.grid[row].indexOf(0) < 0) {
                this.score += 10;
                fullRows.push(row);
            }
        }

        var newRow = [];
        var offset = 0;
        for (var i = 0; i < this.grid[0].length; i++) newRow[i] = 0;

        for (var i=0; i<fullRows.length; i++) {
            this.grid.splice(fullRows[i], 1);
            this.grid.unshift(Object.create(newRow));
            offset++;
        }

        if (fullRows.length > 0)
            this.mainController.controllers.sound.play('score');
    };

    this.spawnBlock = function() {

        this.block = this.nextBlock ? this.nextBlock : new blockModel();

        this.nextBlock    = new blockModel();
        var injectCol = Math.round((this.grid[0].length * .5) - (this.block.shape[0].length * .5));
        this.blockID  = new Date().getTime();

        if (this.checkOverlap(this.block.shape, this.blockID, 0, injectCol)) {
            this.gameOver();
        } else {
            this.injectBlock(0, injectCol);
        }
    };

    this.injectBlock = function(intoRow, intoCol) {
        for (var row = 0; row < this.block.shape.length; row++) {
            for (var col = 0; col < this.block.shape[row].length; col++) {
                if (this.block.shape[row][col] > 0 &&
                    typeof this.grid[row + intoRow] !== "undefined" &&
                    typeof this.grid[row + intoRow][col + intoCol] !== "undefined") {
                    this.grid[row + intoRow][col + intoCol] = this.blockID;
                }
            }
        }
    };

    this.rotate = function() {

        var newBlock = [];
        for (var row = 0; row < this.block.shape[0].length; row++) {
            for (var col = this.block.shape.length - 1; col >= 0; col--) {
                if (typeof newBlock[row] === "undefined")
                    newBlock[row] = [];

                newBlock[row][col] = this.block.shape[col][row];
            }
            newBlock[row].reverse();
        }

        var shapePos = { top: -1, left: -1 };

        for (var row = 0; row < this.grid.length; row++) {
            if ((col = this.grid[row].indexOf( this.blockID )) > -1) {
                shapePos.top = row;
                shapePos.left = col;
                break;
            }
        }

        if (shapePos.top < 0 ||
            shapePos.left < 0) {
            return false;
        }

        shapePos.top  = (shapePos.top  + Math.floor(this.block.shape.length/2)) - Math.floor(newBlock.length/2);
        shapePos.left = (shapePos.left + Math.floor(this.block.shape[0].length/2)) - Math.floor(newBlock[0].length/2) - this.block.shape[0].indexOf( 1 );

        if (this.checkOverlap(newBlock, this.blockID, shapePos.top, shapePos.left)) {
            return false;
        }

        this.block.shape = newBlock;

        // Remove old block from grid
        for (var row = 0; row < this.grid.length; row++) {
            for (var col = 0; col < this.grid[row].length; col++) {
                if (this.grid[row][col] == this.blockID) {
                    this.grid[row][col] = 0;
                }
            }
        }

        // Inject block in new position and redraw
        this.injectBlock(shapePos.top, shapePos.left);
        this.mainController.views.world.draw(this.grid, this.score, this.block, this.blockID, this.nextBlock);
        this.mainController.controllers.sound.play('rotate');
    };

    this.moveBlock = function(moveX, moveY) {

        if (this.blockingEnabled) return false;

        this.blockingEnabled = true;

        // Check if can move
        var canMove = true;
        var cantMoveDown = false;
        var currentRow = 0;
        var currentCol = 0;

        for (var row = 0; row < this.grid.length; row++) {

            if (!canMove) break;

            if ((currentCol = this.grid[row].indexOf( this.blockID )) > -1) {

                blockInnerOffset = this.block.shape[0].indexOf( 1 );

                currentRow = row;
                var blockBottomRow = row + this.block.shape.length;

                // Check if end of level reached
                if (blockBottomRow >= this.grid.length) {
                    canMove = false;
                    cantMoveDown = true;
                } else if (this.checkOverlap(this.block.shape, this.blockID, currentRow + moveY, (currentCol  - blockInnerOffset) + moveX)) {
                    canMove = false;
                    moveY && (cantMoveDown = true);
                }

                break;
            }
        }

        if (!canMove) {
            this.blockingEnabled = false;

            if (cantMoveDown && currentRow == 0) {
                this.gameOver();
            } else if (cantMoveDown) {
                this.spawnBlock();
            }

            this.mainController.controllers.sound.play('cantmove');

            return false;
        }

        // Clear block
        for (var row = 0; row < this.grid.length; row++) {
            for (var col = 0; col < this.grid[row].length; col++) {
                if (this.grid[row][col] == this.blockID) {
                    this.grid[row][col] = 0;
                }
            }
        }

        var injectRow = currentRow + moveY;
        var injectCol = currentCol - this.block.shape[0].map(function(v, k) { return v > 0 ? 1 : 0; }).indexOf(1) + moveX;

        this.injectBlock(injectRow, injectCol);

        if (moveX)
            this.mainController.controllers.sound.play('move');

        if (moveY)
            this.mainController.controllers.sound.play('down');

        this.blockingEnabled = false;

        return true;
    };

    this.checkOverlap = function(blockShape, blockID, top, left) {

        if (top+blockShape.length > this.grid.length ||
            left+blockShape[0].length > this.grid[0].length ||
            left < 0) {
            return true;
        }

        for (var row=0; row < blockShape.length; row++) {
            for (var col=0; col < blockShape[row].length; col++) {

                if (typeof this.grid[top+row] === "undefined" ||
                    typeof this.grid[top+row][left+col] === "undefined")
                {
                    continue;
                }

                if (blockShape[row][col] != 0 &&
                    this.grid[top+row][left+col] != blockID &&
                    this.grid[top+row][left+col] != 0)
                {
                    return true;
                }
            }
        }

        return false;
    };

    this.fieldEmpty = function() {
        return this.grid.filter( function(e) {
            return e.filter(function(k) {
                return k > 0;
            }).length;
            return v;
        }).length < 1;
    };

    this.gameOver = function() {
        this.mainController.controllers.sound.stop();

        this.mainController.stop();
    }

    this.detach = function() {
        //remove listeners
    };

    this.pad = function pad(string) {
        string = string.toString();
        var width= 3,
            padding = '0';
        return (width <= string.length) ? string : pad( padding + string )
    };

    return this;
};

module.exports = gameController;