/**
 * @param {String} src
 * @param {Number} [innerX]
 * @param {Number} [innerY]
 * @param {Number} [oneImgWidth]
 * @param {Number} [oneImgHeight]
 * @param {Number} [changeInterval]
 * @param {Array} [imgSequence]
 * @param {Boolean} [repeat]
 * @returns {Sprite}
 */
var Sprite = function(src, oneImgWidth, oneImgHeight, changeInterval, imgSequence, repeat) {
    /**
     * Ссылка на изображение с горизонтально нарисованными спрайтами (карту спрайтов)
     * @type String
     */
    this.src = src || null;
    if (!src) {
        throw "Sprite: {!src}";
    }
    /**
     * Ширина одного спрайта на карте
     * @type Number
     */
    this.oneImgWidth = oneImgWidth || 32;
    /**
     * Длина одного спрайта на карте
     * @type Number
     */
    this.oneImgHeight = oneImgHeight || 32;
    /**
     * Интервал смены изображений спрайтов, в милисекундах
     * @type Number
     */
    this.changeInterval = changeInterval || 200;
    /**
     * Массив с последовательностью смены изображений спрайта
     * @type Number[]
     */
    this.imgSequence = imgSequence || [0];
    /**
     * Необходимо ли повторять смену спрайтов после прохождения одного imgSequence
     * @type Boolean
     */
    this.repeat = repeat || true;
    /**
     * Флаг, показывающий что это первый проход анимации
     * @type Boolean
     */
    this._isfirstRepeat = true;
    /**
     * Текущий индекс в imgSequence
     * @type Number
     */
    this._currentSeqIndex = 0;

    /**
     * Длина массива imgSequence
     * @type Number
     */
    this._imgSequenceLength = this.imgSequence.length;
    /**
     * Js-объект с изображением (картой спрайтов)
     * @type Image
     */
    this._spriteMap = new Image();
    this._spriteMap.src = this.src;
    /**
     * Время последней смены спрайта
     * @type Number
     */
    this._lastUpdateTime = Date.now();
};

Sprite.prototype = {
    /**
     * 
     * @param {Number} positionX
     * @param {Number} positionY
     * @param {Object} canvasContext
     * @param {Number} timeNow
     * @returns {undefined}
     */
    drawSprite: function(positionX, positionY, canvasContext, timeNow) {
        var positionX = positionX || null;
        var positionY = positionY || null;
        var canvasContext = canvasContext || null;
        if (positionX === null || positionY === null || canvasContext === null) {
            return false;
        }
        
        var timeNow = timeNow || Date.now();
        
        var xPositionInImage = this.imgSequence[this._currentSeqIndex] * this.oneImgWidth;
        var yPositionInImage = 0;
        
        // http://www.w3schools.com/TAGs/canvas_drawimage.asp
        canvasContext.drawImage(
                this._spriteMap,
                xPositionInImage,
                yPositionInImage,
                this.oneImgWidth,
                this.oneImgHeight,
                positionX,
                positionY,
                this.oneImgWidth,
                this.oneImgHeight
                );
        
        //TODO: Сделать rapid используемым

        // Прибавка или обнуление _currentSeqIndex и _lastUpdateTime
        if(this.changeInterval < timeNow - this._lastUpdateTime) {
            this._lastUpdateTime = timeNow;
            this._currentSeqIndex++;
            
            if (this._currentSeqIndex >= this._imgSequenceLength) {
                this._currentSeqIndex = 0;
                this._isfirstRepeat = false;
            }
            
            if(!this._isfirstRepeat && !this.repeat) {
                /**
                 * Если не нужно повторять анимации, держим её на последнем кадре
                 */
                this._currentSeqIndex = this._imgSequenceLength - 1;
            }
        }
    }
};
