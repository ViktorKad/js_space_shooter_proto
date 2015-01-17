/**
 * 
 * @param {Number} x
 * @param {Number} y
 * @param {Number} r
 * @returns {Circle}
 */
var Circle = function(x, y, r) {
    /**
     * @type Number
     */
    this.x = x;
    /**
     * @type Number
     */
    this.x = y;
    /**
     * @type Number
     */
    this.r = r;
    /**
     * @type Number
     */
    this.d = 2 * r;
};


Circle.prototype = {
    /**
     * 
     * @returns {Number}
     */
    getX: function() {
        return this.x;
    },
    /**
     * 
     * @returns {Number}
     */
    getY: function() {
        return this.y;
    },
    /**
     * 
     * @returns {Number}
     */
    getR: function() {
        return this.r;
    },
    /**
     * 
     * @returns {Number}
     */
    getD: function() {
        return this.d;
    },
    /**
     * 
     * @param {Number} x
     * @returns {undefined}
     */
    setX: function(x) {
        this.x = x;
    },
    /**
     * 
     * @param {Number} y
     * @returns {undefined}
     */
    setY: function(y) {
        this.y = y;
    },
    /**
     * 
     * @param {Number} r
     * @returns {undefined}
     */
    setR: function(r) {
        this.d = 2 * r;
        this.r = r;
    },
    /**
     * 
     * @param {Number} d
     * @returns {undefined}
     */
    setD: function(d) {
        this.r = d / 2;
        this.d = d;
    }
};