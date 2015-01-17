/**
 * 
 * @param {Sprite} sprite
 * @param {Vector} velocity Измеряется в px / second
 * @param {Number} cartesianX
 * @param {Number} cartesianY
 * @returns {Unit}
 */
var Unit = function(sprite, velocity, cartesianX, cartesianY) {
    sprite = sprite || null;

    if (!sprite) {
        throw "Unit: (!sprite)";
    }

    this.type = null;
    /**
     * Флаг, показывающий, можно ли удалять объект
     * @type Boolean
     */
    this.void = false;
    
    /**
     * Количество очков здоровья
     * @type Number
     */
    this.health = 1;
    
    /**
     * Сила объекта
     * @type Number
     */
    this.force = 1;
    
    /**
     * Время жизни в милисекундах
     * @type Number
     */
    this.lifeTime = null;
    /**
     * Время, когда объект был создан.
     * Обновляется при вызове метода .setLifeTime()
     */
    this.createTime = Date.now();

    this.cartesianX = cartesianX || 0;
    this.cartesianY = cartesianY || 0;

    this.minMoveX = null;
    this.maxMoveX = null;
    this.minMoveY = null;
    this.maxMoveY = null;

    /**
     * Скорость тела. 
     * Измеряется в px / second
     * @type Vector
     */
    this.velocity = velocity || new Vector(0, 0);
    /**
     * @type Vector
     */
    this.maxVelocity = new Vector(5000, 5000);
    /**
     * Силы действующие на тело
     * @type Vector
     */
    this.forces = [];
    /**
     * Ограничивающий круг
     */
    this.limitingCircle = null;

    this.сanvasContext = null;

    /**
     * @type Sprite
     */
    this.sprite = sprite;

    this._isPrinted = false;
    Unit.prototype.instanceCount++;
    this.id = Unit.prototype.instanceCount;
};

Unit.prototype = {
    debug: false,
    debugToggle: function(){
        if(Unit.prototype.debug) {
            Unit.prototype.debug = false;
        } else {
            Unit.prototype.debug = true;
        }
    },
    instanceCount: 0,
    worldWidth: 0,
    worldHeight: 0,
    setWorldWH: function(worldWidth, worldHeight) {
        Unit.prototype.worldWidth = worldWidth || 0;
        Unit.prototype.worldHeight = worldHeight || 0;
    },
    getWorldWidth: function() {
        return Unit.prototype.worldWidth;
    },
    getWorldHeight: function() {
        return Unit.prototype.worldHeight;
    },
    setCanvasContext: function(сanvasContext) {
        this.сanvasContext = сanvasContext;
    },
    getCanvasContext: function() {
        return this.сanvasContext;
    },
    print: function(сanvasContext) {
        if (!this._isPrinted) {
            this.сanvasContext = сanvasContext;
            this.draw();
        }
    },
    draw: function(timeNow) {
        var timeNow = timeNow || Date.now();
        
        if(this.lifeTime !== null && (timeNow - this.createTime > this.lifeTime)) {
            // Если время жизни объекта истекло
            this.setVoid(true);
            return false;
        }

        this.sprite.drawSprite(
                this.convToMonitorX(this.cartesianX),
                this.convToMonitorY(this.cartesianY),
                this.сanvasContext,
                timeNow
                );
        
        if(this.debug) {
            this.drawCircle("yellow");
        }
    },
    drawCircle: function(color) {
        var color = color || "yellow";
        
        var ctx = this.сanvasContext;
        
        ctx.strokeStyle = color;

        var cx = this.convToMonitorX(this.limitingCircle.x);
        var cy = this.convToMonitorY(this.limitingCircle.y);
        
        var r = this.limitingCircle.r;
        var w, h = w = 2 * r;

        ctx.beginPath();
        var lx = cx - w / 2,
                rx = cx + w / 2,
                ty = cy - h / 2,
                by = cy + h / 2;
        var magic = 0.551784;
        var xmagic = magic * w / 2;
        var ymagic = h * magic / 2;
        ctx.moveTo(cx, ty);
        ctx.bezierCurveTo(cx + xmagic, ty, rx, cy - ymagic, rx, cy);
        ctx.bezierCurveTo(rx, cy + ymagic, cx + xmagic, by, cx, by);
        ctx.bezierCurveTo(cx - xmagic, by, lx, cy + ymagic, lx, cy);
        ctx.bezierCurveTo(lx, cy - ymagic, cx - xmagic, ty, cx, ty);
        ctx.stroke();
    },
    
    /**
     * 
     * @param {Boolean} bool_void
     * @returns {undefined}
     */
    setVoid: function(bool_void) {
        this.void = Boolean(bool_void);
    },
    isVoid: function() {
        return this.void;
    },
    
    /**
     * 
     * @param {Number} lifeTime
     * @returns {undefined}
     */
    setLifeTime: function(lifeTime) {
        this.createTime = Date.now();
        this.lifeTime = lifeTime;
    },
    
    /**
     * Установить количество очков здоровья
     * @param {Number} health
     * @returns {undefined}
     */
    setHealth: function(health) {
        this.health = health;
    },
    /**
     * 
     * @param {Number} force
     * @returns {undefined}
     */
    setForce: function(force) {
        this.force = force;
    },
    getForce: function() {
        return this.force;
    },
    /**
     * Нанести урон
     * @param {Number} demage
     * @returns {Number} return this.health;
     */
    demage: function(demage) {
        var demage = demage || 0;
        if(demage > 0) {
            this.health -= demage;
        }
        if(this.health < 0) {
            this.health = 0;
        }
        return this.health;
    },
    
    coordSysDX: 0,
    coordSysDY: 0,
    setCoordSysDX: function(dX) {
        Unit.prototype.coordSysDX = dX;
    },
    setCoordSysDY: function(dY) {
        Unit.prototype.coordSysDY = dY;
    },
    convToMonitorX: function(cartesianX) {
        return cartesianX + Unit.prototype.coordSysDX;
    },
    convToMonitorY: function(cartesianY) {
        return Unit.prototype.coordSysDY - cartesianY;
    },
    convToCartesianX: function(monitorX) {
        return monitorX - Unit.prototype.coordSysDX;
    },
    convToCartesianY: function(monitorY) {
        return Unit.prototype.coordSysDY - monitorY;
    },
    /**
     * 
     * @param {Number} x
     * @param {Number} y
     * @param {Number} r
     * @returns {Boolean}
     */
    addLimitingCircle: function(x, y, r) {
        if (typeof x === "undefined" || typeof y === "undefined" || typeof r === "undefined") {
            return false;
        }
        var x = x;
        var y = y;
        var r = r;
        var d = 2 * r;

        this.limitingCircle = {"x": x, "y": y, "r": r, "d": d};
    },
    getLimitingCircleX: function() {
        return this.limitingCircle.x;
    },
    getLimitingCircleY: function() {
        return this.limitingCircle.y;
    },
    getId: function() {
        return this.id;
    },
    /**
     * 
     * @param {Unit} unit
     * @returns {undefined}
     */
    isCollision: function(unit) {
        var unit = unit || null;
        if (!unit) {
            return false;
        }

        var radiusSumm = this.limitingCircle.r + unit.limitingCircle.r;
        var vect = new Vector(this.limitingCircle.x - unit.limitingCircle.x
                , this.limitingCircle.y - unit.limitingCircle.y);

        if (vect.lengthPower2() <= radiusSumm * radiusSumm) {
            return true;
        }

        return false;
    },
    /**
     * 
     * @param {Vector} velocity
     * @returns {undefined}
     */
    setVelocity: function(velocity) {
        this.velocity = velocity || new Vector(0, 0);
    },
    /**
     * 
     * @param {Vector} dVelocity
     * @returns {undefined}
     */
    addVelocity: function(dVelocity) {
        var tempVelocity = new Vector(null, null, this.velocity);
        tempVelocity.plusVector(dVelocity);

        if (tempVelocity.getX() * tempVelocity.getX() <= this.maxVelocity.getX() * this.maxVelocity.getX()
                && tempVelocity.getY() * tempVelocity.getY() <= this.maxVelocity.getY() * this.maxVelocity.getY()) {
            this.velocity.plusVector(dVelocity);
        }
    },
    /**
     * 
     * @param {Vector} maxVelocity
     * @returns {undefined}
     */
    setMaxVelocity: function(maxVelocity) {
        this.maxVelocity = maxVelocity;
    },
    getMaxVelocity: function() {
        return this.maxVelocity;
    },
    /**
     * 
     * @returns {Vector}
     */
    getVelocity: function() {
        return this.velocity;
    },
    addForce: function(time, value, deleteble) {
        var time = time || 0;
        var value = value || new Vector(0, 0);
        var deleteble = deleteble || true;

        this.forces.push(
                {
                    "time": time,
                    "value": value,
                    "deleteble": deleteble,
                    "total": new Vector(0, 0)
                }
        );

        return (this.forces.length - 1);
    },
    removeForce: function(index) {
        if (index >= 0 && index < this.forces.length) {
            if (this.forces[index].deleteble) {
                this.velocity.subVector(this.forces[index].total);
            }
            this.forces.splice(index, 1);
        }
    },
    useForces: function() {
        for (var i in this.forces) {
            if (this.forces[i].time > 0) {
                this.velocity.plusVector(this.forces[i].value);
                this.forces[i].time--;
                this.forces[i].total.plusVector(this.forces[i].value);
            } else {
                this.removeForce(i);
            }
        }
    },
    getCartesianX: function() {
        return this.cartesianX;
    },
    getCartesianY: function() {
        return this.cartesianY;
    },
    setCartesianX: function(cartesianX) {
        if(this.minMoveX !== null && cartesianX > this.minMoveX && cartesianX < this.maxMoveX) {
            this.limitingCircle.x = cartesianX + (this.limitingCircle.x - this.cartesianX);
            this.cartesianX = cartesianX;
        }
    },
    setCartesianY: function(cartesianY) {
        if(this.minMoveY !== null && cartesianY > this.minMoveX && cartesianY < this.maxMoveY) {
            this.limitingCircle.y = cartesianY + (this.limitingCircle.y - this.cartesianY);
            this.cartesianY = cartesianY;
        }
    },
    /**
     * Ограничивающая фигура достигла границы мира.
     * Только еслти объект полностью вышел за границы мира своими ограничивающими фигурами
     * @returns {Boolean}
     */
    isWorldBorder: function() {
        if (this.isWorldBorderX() || this.isWorldBorderY()) {
            return true;
        }

        return false;
    },
    isWorldBorderX: function(dx) {
        var minX = 5;
        var maxX = 5;
        var dx = dx || 0;

        if (this.limitingCircle) {
            minX = this.limitingCircle.x + this.limitingCircle.r + dx;
            maxX = this.limitingCircle.x - this.limitingCircle.r + dx;
        }

        if (minX > 0 && maxX < this.worldWidth) {
            return false;
        }

        return true;
    },
    isWorldBorderY: function(dy) {
        var minY = 5;
        var maxY = 5;
        var dy = dy || 0;

        if (this.limitingCircle) {
            minY = this.limitingCircle.y + this.limitingCircle.r + dy;
            maxY = this.limitingCircle.y - this.limitingCircle.r + dy;
        }

        if (minY > 0 && maxY < this.worldHeight) {
            return false;
        }

        return true;
    },
    /**
     * 
     * @param {Number} minMoveX
     * @returns {undefined}
     */
    setMinMoveX: function(minMoveX) {
        this.minMoveX = minMoveX;
    },
    /**
     * 
     * @param {Number} maxMoveX
     * @returns {undefined}
     */
    setMaxMoveX: function(maxMoveX) {
        this.maxMoveX = maxMoveX;
    },
    /**
     * 
     * @param {Number} minMoveY
     * @returns {undefined}
     */
    setMinMoveY: function(minMoveY) {
        this.minMoveY = minMoveY;
    },
    /**
     * 
     * @param {Number} maxMoveY
     * @returns {undefined}
     */
    setMaxMoveY: function(maxMoveY) {
        this.maxMoveY = maxMoveY;
    },
    /**
     * 
     * @param {Number} cartesianDX
     * @param {Number} cartesianDY
     * @param {Sprite} sprite
     * @param {Number} deltaTimePer1000
     * @returns {boolean}
     */
    move: function(cartesianDX, cartesianDY, sprite, deltaTimePer1000) {
        /**
         * Время прошедшее с последнего вызова, в милисекундах деленых на тысячу.
         * См. this.velocity, она измеряется в px / second
         * @type Number|null
         */
        var deltaTimePer1000 = deltaTimePer1000 || 0;
        /**
         * @type Sprite
         */
        var sprite = sprite || null;
        /**
         * @type Number
         */
        var cartesianDX = cartesianDX || 0;
        cartesianDX *= deltaTimePer1000;
        /**
         * @type Number
         */
        var cartesianDY = cartesianDY || 0;
        cartesianDY *= deltaTimePer1000;

        if (!deltaTimePer1000) {
            return false;
        }

        if (sprite) {
            this.setSprite(sprite);
        }

        // Изменяем координаты
        if (cartesianDX) {
            this.cartesianX += cartesianDX;

            if (this.limitingCircle !== null) {
                this.limitingCircle.x += cartesianDX;
            }
        }

        if (cartesianDY) {
            this.cartesianY += cartesianDY;

            if (this.limitingCircle !== null) {
                this.limitingCircle.y += cartesianDY;
            }
        }
        // /Изменяем координаты

        // Если объект вышел за границы мира, возвращаем его обратно
        if (this.minMoveX !== null && this.maxMoveX !== null) {
            var minX = this.limitingCircle.x - this.limitingCircle.r;
            var maxX = this.limitingCircle.x + this.limitingCircle.r;

            if (cartesianDX && (minX < this.minMoveX || maxX > this.maxMoveX)) {
                this.cartesianX -= cartesianDX;

                if (this.limitingCircle !== null) {
                    this.limitingCircle.x -= cartesianDX;
                }
            }
        }

        if (this.minMoveY !== null && this.maxMoveY !== null) {
            var minY = this.limitingCircle.y - this.limitingCircle.r;
            var maxY = this.limitingCircle.y + this.limitingCircle.r;

            if (cartesianDY && (minY < this.minMoveY || maxY > this.maxMoveY)) {
                this.cartesianY -= cartesianDY;

                if (this.limitingCircle !== null) {
                    this.limitingCircle.y -= cartesianDY;
                }
            }
        }
        // /Если объект вышел за границы мира, возвращаем его обратно

        return true;
    },
    moveToStep: function(deltaTimePer1000) {
        /**
         * См метод .move
         */
        var deltaTimePer1000 = deltaTimePer1000 || null;
        this.move(this.velocity.getX(), this.velocity.getY(), null, deltaTimePer1000);
    },
    moveToVector: function(deltaVector, deltaTimePer1000) {
        /**
         * См метод .move
         */
        var deltaTimePer1000 = deltaTimePer1000 || null;
        this.move(deltaVector.getX(), deltaVector.getY(), null);
    },
    /**
     * 
     * @param {Sprite} sprite
     * @returns {undefined}
     */
    setSprite: function(sprite) {
        if (sprite) {
            this.sprite = sprite;
        }
    },
    /**
     * 
     * @param {String} type
     * @returns {undefined}
     */
    setType: function(type) {
        this.type = type;
    },
    getType: function() {
        return this.type;
    },
    removeHtml: function() {
        /*pass*/
    }
};
