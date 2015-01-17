/**
 * Этот конструктор объявляет геометрическую модель вектора вектора.
 * @public
 * @param {Number} x
 * @param {Number} y
 * @param {Vector} forClone
 * @returns {Vector}
 */
var Vector = function(x, y, forClone) {
    /**
     * @private
     * @type Number
     */
    this.x = x || 0;
    /**
     * @private
     * @type Number
     */
    this.y = y || 0;
    
    forClone = forClone || null;

    if (forClone) {
        this.setFromVector(forClone);
    }
};

Vector.prototype = {
    /**
     * Коэффициент перевода угла в радианы
     * @public
     * @type @exp;Math@pro;PI|Number
     */
    TO_RADIANS: (1 / 180) * Math.PI,
    /**
     * Коэффициент перевода угла в градусы
     * @public
     * @type Number|@exp;Math@pro;P
     */
    TO_DEGREES: (1 / Math.PI) * 180,
    /**
     * Возвращает копию этого объекта.
     * @public
     * @returns {Vector}
     */
    copy: function() {
        return new Vector(this.getX(), this.getY());
    },
    /**
     * Увеличение x и y на скаляры.
     * @public
     * @param {Number} dx
     * @param {Number} dy
     * @returns {Vector}
     */
    plus: function(dx, dy) {
        this.x += dx;
        this.y += dy;
        return this;
    },
    /**
     * Сложение векторов.
     * @public
     * @param {Vector} v
     * @returns {Vector}
     */
    plusVector: function(v) {
        this.x += v.getX();
        this.y += v.getY();
        return this;
    },
    /**
     * Уменьшение вектора.
     * @public
     * @param {Number} x
     * @param {Number} y
     * @returns {Vector}
     */
    sub: function(x, y) {
        this.x -= x;
        this.y -= y;
        return this;
    },
    /**
     * Вычитание векторов.
     * @public
     * @param {Vector} v
     * @returns {Vector}
     */
    subVector: function(v) {
        this.x -= v.getX();
        this.y -= v.getY();
        return this;
    },
    /**
     * Умножение вектора на скаляр.
     * @public
     * @param {Number} scalar
     * @returns {Vector}
     */
    mul: function(scalar) {
        this.x *= scalar;
        this.y *= scalar;

        return this;
    },
    /**
     * Получить длину вектора.
     * @public
     * @returns {Number}
     */
    length: function() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    },
    /**
     * Возвращает квадрат длины вектора.
     * Работает быстрее чем len.
     * @public
     * @returns {Number} Квадрат длины вектора.
     */
    lengthPower2: function() {
        return (this.x * this.x + this.y * this.y);
    },
    /**
     * Получить норализованый вектор.
     * Возвращает нормализованную копию вектора.
     * @public
     * @returns {Vector} Нормализованная копия вектоа this.
     */
    getNorm: function() {
        /**
         * @type Vector
         */
        var norm = this.copy();

        var normLen = norm.length();
        if (normLen !== 0) {
            norm.x /= normLen;
            norm.y /= normLen;
        }

        return norm;
    },
    /**
     * Возвращает угол в радианах, вектора относительно оси x.
     * @public
     * @returns {Number}
     */
    getAngle: function() {
        var angle;
        angle = Math.atan2(this.y, this.x);

        if (angle < 0) {
            angle += 2 * Math.PI;
        }

        return angle;
    },
    /**
     * Поворот вектора на угол.
     * @public
     * @param {Number} angle Угол поворота в радианах.
     * @returns {Vector}
     */
    rotateToAngle: function(angle) {
        var x, y, newX, newY, sin, cos;
        x = this.x;
        y = this.y;
        
        sin = Math.sin(angle);
        sin = sin.toFixed(12);
        sin = parseFloat(sin);
        
        cos = Math.cos(angle);
        cos = cos.toFixed(12);
        cos = parseFloat(cos);
        
        newX = (x * cos) - (y * sin);
        newY = (x * sin) + (y * cos);

        this.x = newX;
        this.y = newY;

        return this;
    },
    /**
     * @public
     * @returns {Number}
     */
    getX: function() {
        return this.x;
    },
    /**
     * @public
     * @returns {Number}
     */
    getY: function() {
        return this.y;
    },
    /**
     * @public
     * @param {Number} x
     * @param {Number} y
     * @returns {undefined}
     */
    set: function(x, y) {
        this.x = x;
        this.y = y;
    },
    /**
     * @public
     * @param {Vector} v
     * @returns {undefined}
     */
    setFromVector: function(v) {
        this.x = v.getX();
        this.y = v.getY();
    },
    /**
     * @public
     * @param {Number} x
     * @returns {undefined}
     */
    setX: function(x) {
        this.x = x;
    },
    /**
     * @public
     * @param {Number} y
     * @returns {undefined}
     */
    setY: function(y) {
        this.y = y;
    },
    /**
     * @public
     * @returns {String}
     */
    toString: function() {
        /**
         * @type Array
         */
        var temp = [];
        
        temp.push("x:\t" + this.x);
        temp.push("y:\t" + this.y);
        temp.push("length:\t" + this.length());
        temp.push("angle:\t" + this.getAngle());
        
        return "Vector: {" + temp.join(", ") + "}";
    }
};


