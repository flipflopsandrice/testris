/**
 * This contains a block
 */

var mobileTools = function() {

    this.isMobileDevice = function() {
        return !!('ontouchstart' in window);
    };

};

module.exports = mobileTools;