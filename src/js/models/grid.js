/**
 * This contains the game grid
 */

var gridModel = function(rows, cols) {

    if (!rows) rows = 15;
    if (!cols) cols = 20;

    var grid = [];

    for (var y=0; y<rows; y++) {
        grid[y] = [];
        for (var x=0; x< cols; x++) {
            grid[y][x]=0;
        }
    }

    return grid;
};

module.exports = gridModel;