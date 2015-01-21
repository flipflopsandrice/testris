/**
 * This contains a block
 */

var blockModel = function() {

    var shapes = [
        [
            [1,0],
            [1,0],
            [1,1]
        ],
        [
            [0,1],
            [0,1],
            [1,1]
        ],
        [
            [1, 1, 1, 1]
        ],
        [
            [1,1,1],
            [0,1,0]
        ],
        [
            [1,1],
            [1,1]
        ],
        [
            [1,1,0],
            [0,1,1]
        ],
        [
            [0,1,1],
            [1,1,0]
        ],
    ]

    this.shape = shapes[ Math.floor(Math.random()*shapes.length) ];

    this.color = '#' + (function co(lor){ return (lor +=
        [3,4,5,6,7,8,9,'a','b','c','d','e','f'][Math.floor(Math.random()*13)])
        && (lor.length == 6) ?  lor : co(lor); })(''); // http://www.paulirish.com/2009/random-hex-color-code-snippets/
};

module.exports = blockModel;