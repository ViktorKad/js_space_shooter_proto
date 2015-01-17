function main() {
    // Скорость в px / second 
    /**
     * @type Vector[]
     */
    window.unitsVelocity = {
        player: new Vector(0, 0),
        star: new Vector(-100, 0),
        enemy: new Vector(-100, 0),
        bullet: new Vector(150, 0),
        bulletM: new Vector(250, 0),
        bulletL: new Vector(1300, 0),
        bulletSTop: new Vector(300, 60),
        bulletSCenter: new Vector(300, 0),
        bulletSDown: new Vector(300, -60)
    };

    window.htmlBody = document.getElementById("body");

    window.fpsSpan = document.getElementById("fps_span");

    // Подготовка мира
    window.gameCanvas = document.getElementById('canvas_game_board');
    gameCanvas.width = gameCanvas.offsetWidth;
    gameCanvas.height = gameCanvas.offsetHeight;

    window.gameCtx = window.gameCanvas.getContext('2d');
    clearGameWorld(gameCtx);
    // /Подготовка мира

    // Установка параметров мира
    Unit.prototype.setCoordSysDX(0);
    Unit.prototype.setCoordSysDY(gameCanvas.offsetHeight);
    Unit.prototype.setWorldWH(gameCanvas.offsetWidth, gameCanvas.offsetHeight);

    window.scoreSpan = document.getElementById("score_span");
    window.playerScore = 0;
    window.scoreSpan.innerHTML = playerScore;

    window.ammunitionSpan = document.getElementById("ammunition_span");
    window.playerAmmunition = 100;
    window.ammunitionSpan.innerHTML = playerAmmunition;

    window.deltaAmmunationSpan = document.getElementById("delta_ammunition_span");
    deltaAmmunationSpan.innerHTML = "";

    window.weaponSpan = document.getElementById("weapon_span");
    window.playerWeapon = "M";
    window.weaponSpan.innerHTML = playerWeapon;

    /**
     * Набор звезд и объектов которые не должны ни с чем соприкасаться
     * @type Unit[]
     */
    window.poolStars = [];
    /**
     * Набор врагов
     * @type Unit[]
     */
    window.poolEnemies = [];
    /**
     * Набор снарядов игрока
     * @type Unit[]
     */
    window.poolBullets = [];
    /**
     * Набор бонусов
     * @type Unit[]
     */
    window.poolStuff = [];
    /**
     * Набор подписей
     * @type Unit[]
     */
    window.poolLabels = [];

    // Создание игрока
    /**
     * @type Unit
     */
    window.player = new Unit(Assets.hero, unitsVelocity.player, 30, 100);

    player.addLimitingCircle(player.getCartesianX() + 16, player.getCartesianY() - 16, 16);

    player.setMaxVelocity(new Vector(300, 300));
    player.setMinMoveX(0);
    player.setMaxMoveX(player.getWorldWidth() / 4);
    player.setMinMoveY(0);
    player.setMaxMoveY(player.getWorldHeight());

    // /Создание игрока

    // Создание первых звезд
    poolStars.push(new Unit(Assets.star1, unitsVelocity.star, player.getWorldWidth() * 0.2, random(50, player.getWorldHeight() - 50)));
    poolStars.push(new Unit(Assets.star2, unitsVelocity.star, player.getWorldWidth() * 0.4, random(50, player.getWorldHeight() - 50)));
    (function() {
        var index = poolStars.length - 1;
        poolStars[index].addLimitingCircle(poolStars[index].getCartesianX() + 16, poolStars[index].getCartesianY() - 16, 16);

        index = poolStars.length - 2;
        poolStars[index].addLimitingCircle(poolStars[index].getCartesianX() + 16, poolStars[index].getCartesianY() - 16, 16);
    })();
    createStar(gameCtx);
    createStar(gameCtx);
    createStar(gameCtx);
    // /Создание первых звезд

    player.print(gameCtx);
    for (var i in poolStars) {
        poolStars[i].print(gameCtx);
    }
    for (var i in poolEnemies) {
        poolEnemies[i].print(gameCtx);
    }
    for (var i in poolBullets) {
        poolBullets[i].print(gameCtx);
    }
    for (var i in poolStuff) {
        poolStuff[i].print(gameCtx);
    }
    for (var i in poolLabels) {
        poolLabels[i].print(gameCtx);
    }

    // Пользовательский ввод
    window.poolKeysPress = {
        down: false,
        top: false,
        left: false,
        right: false,
        fire: false
    };
    
    document.addEventListener('keydown', function(e) {
        var e = e || event;
        if (e.keyCode === 40) {
            poolKeysPress.down = true;
        } else if (e.keyCode === 38) {
            poolKeysPress.top = true;
        } else if (e.keyCode === 37) {
            poolKeysPress.left = true;
        } else if (e.keyCode === 39) {
            poolKeysPress.right = true;
        } else if (e.keyCode === 32 || e.keyCode === 17) {
            poolKeysPress.fire = true;
        }
    });

    document.addEventListener('keyup', function(e) {
        var e = e || event;
        if (e.keyCode === 40) {
            poolKeysPress.down = false;
        } else if (e.keyCode === 38) {
            poolKeysPress.top = false;
        } else if (e.keyCode === 37) {
            poolKeysPress.left = false;
        } else if (e.keyCode === 39) {
            poolKeysPress.right = false;
        } else if (e.keyCode === 32 || e.keyCode === 17) {
            poolKeysPress.fire = false;
        }
    });
    // /Пользовательский ввод
}

var _isGameStarted = false;

function startGame() {
    window.lastIterationTime = Date.now();
    window.lastRepaintTime = Date.now();
    window.lastPlayerFireTime = Date.now();
    window.lastCreateStarTime = Date.now();
    window.lastCreateStuffTime = Date.now();
    window.lastCreateEnemyTime = Date.now();
    window.lastFpsTime = Date.now();

    gameIteration();
    if (_isGameStarted) {
        return false;
    }

    _isGameStarted = true;

    return true;
}

function pauseGame() {
    clearTimeout(window.gameIterationSetIntervalId);
    fpsSpan.innerHTML = "0";
    _isGameStarted = false;
}

function btnStartPause() {
    if (_isGameStarted) {
        pauseGame();
    } else {
        startGame();
    }
}

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function createEmemy(canvasContext) {
    if (random(0, 100) > 70) {
        unitsVelocity.enemy = new Vector(-random(80, 200), 0);
        poolEnemies.push(new Unit(Assets.enemy, unitsVelocity.enemy, player.getWorldWidth() - 50, random(50, player.getWorldHeight() - 50)));

        var index = poolEnemies.length - 1;
        poolEnemies[index].addLimitingCircle(poolEnemies[index].getCartesianX() + 16, poolEnemies[index].getCartesianY() - 16, 16);

        poolEnemies[index].print(canvasContext);
        
        poolEnemies[index].setHealth(2);
    }
}

function createStar(canvasContext) {
    var rand = random(1, 99);

    if (rand > 70) {
        poolStars.push(new Unit(Assets.star1, unitsVelocity.star, player.getWorldWidth() - 50, random(50, 400)));

        var index = poolStars.length - 1;
        poolStars[index].addLimitingCircle(poolStars[index].getCartesianX() + 16, poolStars[index].getCartesianY() - 16, 16);
        poolStars[index].print(canvasContext);

    } else if (rand > 40) {
        poolStars.push(new Unit(Assets.star2, unitsVelocity.star, player.getWorldWidth() - 50, random(50, 400)));

        var index = poolStars.length - 1;
        poolStars[index].addLimitingCircle(poolStars[index].getCartesianX() + 16, poolStars[index].getCartesianY() - 16, 16);
        poolStars[index].print(canvasContext);
    } else {
        /*pass*/
    }
}

function createStuff(canvasContext) {
    var rand = random(1, 99);

    if (rand > 66) {
        poolStuff.push(new Unit(Assets.staffS, unitsVelocity.star, player.getWorldWidth() - 50, random(50, 400)));
        var index = poolStuff.length - 1;
        poolStuff[index].addLimitingCircle(poolStuff[index].getCartesianX() + 16, poolStuff[index].getCartesianY() - 16, 16);
        poolStuff[index].print(canvasContext);

        poolStuff[index].setType("S");
    } else if (rand > 33) {
        poolStuff.push(new Unit(Assets.staffM, unitsVelocity.star, player.getWorldWidth() - 50, random(50, 400)));
        var index = poolStuff.length - 1;
        poolStuff[index].addLimitingCircle(poolStuff[index].getCartesianX() + 16, poolStuff[index].getCartesianY() - 16, 16);
        poolStuff[index].print(canvasContext);

        poolStuff[index].setType("M");
    } else {
        poolStuff.push(new Unit(Assets.staffL, unitsVelocity.star, player.getWorldWidth() - 50, random(50, 400)));
        var index = poolStuff.length - 1;
        poolStuff[index].addLimitingCircle(poolStuff[index].getCartesianX() + 16, poolStuff[index].getCartesianY() - 16, 16);
        poolStuff[index].print(canvasContext);

        poolStuff[index].setType("L");
    }
}

/**
 * Вренмя последнего выстрела
 * @type Number
 */
window.lastFireTime = 0;
function heroFire(canvasContext) {
    // Лимит времени выстрела
    var timeNow = Date.now();
    if (timeNow - lastFireTime < 150) {
        return false;
    }
    lastFireTime = timeNow;
    // /Лимит времени выстрела

    if (playerWeapon === "S") {
        if (window.playerAmmunition <= 0) {
            return false;
        }
        window.ammunitionSpan.innerHTML = --window.playerAmmunition;

        poolBullets.push(new Unit(Assets.bulletS, unitsVelocity.bulletSCenter, player.getCartesianX() + 32, player.getCartesianY()));
        var index = poolBullets.length - 1;
        poolBullets[index].addLimitingCircle(poolBullets[index].getCartesianX() + 16, poolBullets[index].getCartesianY() - 16, 5);
        poolBullets[index].print(canvasContext);

        if (window.playerAmmunition <= 0) {
            return false;
        }
        window.ammunitionSpan.innerHTML = --window.playerAmmunition;

        poolBullets.push(new Unit(Assets.bulletS, unitsVelocity.bulletSDown, player.getCartesianX() + 16, player.getCartesianY()));
        index = poolBullets.length - 1;
        poolBullets[index].addLimitingCircle(poolBullets[index].getCartesianX() + 16, poolBullets[index].getCartesianY() - 16, 5);
        poolBullets[index].print(canvasContext);

        if (window.playerAmmunition <= 0) {
            return false;
        }
        window.ammunitionSpan.innerHTML = --window.playerAmmunition;

        poolBullets.push(new Unit(Assets.bulletS, unitsVelocity.bulletSTop, player.getCartesianX() + 16, player.getCartesianY()));
        index = poolBullets.length - 1;
        poolBullets[index].addLimitingCircle(poolBullets[index].getCartesianX() + 16, poolBullets[index].getCartesianY() - 16, 5);
        poolBullets[index].print(canvasContext);
    } else if (playerWeapon === "L") {
        if (window.playerAmmunition <= 0) {
            return false;
        }
        window.ammunitionSpan.innerHTML = --window.playerAmmunition;

        poolBullets.push(new Unit(Assets.bulletL, unitsVelocity.bulletL, player.getCartesianX() + 32, player.getCartesianY()));
        var index = poolBullets.length - 1;
        poolBullets[index].addLimitingCircle(poolBullets[index].getCartesianX() + 16, poolBullets[index].getCartesianY() - 16, 3);
        poolBullets[index].print(canvasContext);
        
        poolBullets[index].setForce(3);
    } else {
        if (window.playerAmmunition <= 0) {
            return false;
        }
        window.ammunitionSpan.innerHTML = --window.playerAmmunition;

        poolBullets.push(new Unit(Assets.bulletM, unitsVelocity.bulletM, player.getCartesianX() + 32, player.getCartesianY()));
        var index = poolBullets.length - 1;
        poolBullets[index].addLimitingCircle(poolBullets[index].getCartesianX() + 16, poolBullets[index].getCartesianY() - 16, 5);
        poolBullets[index].print(canvasContext);
    }
}

function clearGameWorld(canvasContext) {
    canvasContext.clearRect(0, 0, gameCanvas.offsetWidth, gameCanvas.offsetHeight);
}

function repaintAll() {
    var i;

    clearGameWorld(gameCtx);

    player.draw();

    for (i in poolEnemies) {
        poolEnemies[i].draw();
    }

    for (i in poolBullets) {
        poolBullets[i].draw();
    }

    for (i in poolStars) {
        poolStars[i].draw();
    }

    for (i in poolStuff) {
        poolStuff[i].draw();
    }

    for (i in poolLabels) {
        poolLabels[i].draw();
    }
}

/**
 * Если произошло столкновение врага с игровом, возвращает true
 * @returns {Boolean}
 */
function collisionChecker() {
    for (var enemy in poolEnemies) {
        var isExists = true;
        // collisions
        for (var bullet in poolBullets) {
            if (poolBullets[bullet].isCollision(poolEnemies[enemy])) {
                
                poolBullets[bullet].setVoid(true);
                
                var health = poolEnemies[enemy].demage(poolBullets[bullet].getForce());
                if(health) {
                    // Если объект еще содержит здоровье
                    
                    // Добавляем микровзрыв в месте соприкосновения, вместо патрона
                    var demagePoint = {
                        x: poolBullets[bullet].getCartesianX(),
                        y: poolBullets[bullet].getCartesianY(),
                        v: poolBullets[bullet].getVelocity(),
                        limitX: poolBullets[bullet].getLimitingCircleX(),
                        limitY: poolBullets[bullet].getLimitingCircleY()
                    };
                    
                    poolStars.push(new Unit(Assets.enemyExplosion, demagePoint.v, demagePoint.x, demagePoint.y));
                    poolStars[poolStars.length - 1].addLimitingCircle(demagePoint.limitX, demagePoint.limitY, 4);
                    poolStars[poolStars.length - 1].print(gameCtx);
                    poolStars[poolStars.length - 1].setLifeTime(200);
                    // /Добавляем микровзрыв в месте соприкосновения, вместо патрона
                    continue;
                }
                
                // Добавление взрыва и обломков
                var spirit = {
                    x: poolEnemies[enemy].getCartesianX(),
                    y: poolEnemies[enemy].getCartesianY(),
                    v: poolEnemies[enemy].getVelocity(),
                    limitX: poolEnemies[enemy].getLimitingCircleX(),
                    limitY: poolEnemies[enemy].getLimitingCircleY()
                };
                
                // Добавляем взрыв
                poolStars.push(new Unit(Assets.enemyExplosion, spirit.v, spirit.x, spirit.y));
                poolStars[poolStars.length - 1].addLimitingCircle(spirit.limitX, spirit.limitY, 4);
                poolStars[poolStars.length - 1].print(gameCtx);
                poolStars[poolStars.length - 1].setLifeTime(400);
                // /Добавляем взрыв
                
                // Добавляем обломки, вместо уничтоженного корабля
                if (random(1, 50) > 35) {
                    poolStuff.push(new Unit(Assets.enemyBroken, spirit.v, spirit.x, spirit.y));
                    poolStuff[poolStuff.length - 1].setType("+10");
                    poolStuff[poolStuff.length - 1].addLimitingCircle(spirit.limitX, spirit.limitY, 8);
                    poolStuff[poolStuff.length - 1].print(gameCtx);
                }
                // /Добавляем обломки, вместо уничтоженного корабля

                poolEnemies[enemy].setVoid(true);
                
                isExists = false;
                
                scoreSpan.innerHTML = ++playerScore;
            }
        }

        if (!isExists) {
            continue;
        }

        if (player.isCollision(poolEnemies[enemy])) {
            alert("You are lose");
            return true;
        }

        // Удаление элементов вышедших за границы мира
        if (poolEnemies[enemy].isWorldBorder()) {
            poolEnemies[enemy].setVoid(true);
        }
    }

    for (var i in poolBullets) {
        if (poolBullets[i].isWorldBorder()) {
            poolBullets[i].setVoid(true);
        }
    }

    for (var i in poolStars) {
        if (poolStars[i].isWorldBorder()) {
            poolStars[i].setVoid(true);
        }
    }

    for (var i in poolStuff) {
        if (poolStuff[i].isWorldBorder()) {
            poolStuff[i].setVoid(true);
        }

        if (player.isCollision(poolStuff[i])) {
            if (poolStuff[i].getType() === "+10") {
                playerAmmunition += 10;

                // Добавляем объект надпись +10
                poolLabels.push(new Unit(Assets.labelPlus10, new Vector(0, 25), poolStuff[i].getCartesianX(), poolStuff[i].getCartesianY()));
                poolLabels[poolLabels.length - 1].setType("+10");
                poolLabels[poolLabels.length - 1].addLimitingCircle(poolStuff[i].getLimitingCircleX(), poolStuff[i].getLimitingCircleX(), 16);
                poolLabels[poolLabels.length - 1].print(gameCtx);
                poolLabels[poolLabels.length - 1].setLifeTime(800);
                // /Добавляем объект надпись +10

                deltaAmmunationSpan.innerHTML = "&nbsp;&nbsp;&nbsp;+10";
            } else {
                playerWeapon = poolStuff[i].getType() || "M";
                weaponSpan.innerHTML = playerWeapon;

                playerAmmunition += 50;

                // Добавляем объект надпись +50
                poolLabels.push(new Unit(Assets.labelPlus50, new Vector(0, 25), poolStuff[i].getCartesianX(), poolStuff[i].getCartesianY()));
                poolLabels[poolLabels.length - 1].setType("+10");
                poolLabels[poolLabels.length - 1].addLimitingCircle(poolStuff[i].getLimitingCircleX(), poolStuff[i].getLimitingCircleX(), 16);
                poolLabels[poolLabels.length - 1].print(gameCtx);
                poolLabels[poolLabels.length - 1].setLifeTime(800);
                // /Добавляем объект надпись +50

                deltaAmmunationSpan.innerHTML = "&nbsp;&nbsp;&nbsp;+50";
            }
            setTimeout('deltaAmmunationSpan.innerHTML = ""', 500);

            ammunitionSpan.innerHTML = playerAmmunition;

            poolStuff[i].setVoid(true);
        }
    }
}

// Все они переопределяются в gameStart();
window.lastIterationTime = 0;
window.lastRepaintTime = 0;
window.lastPlayerFireTime = 0;
window.lastCreateStarTime = 0;
window.lastCreateStuffTime = 0;
window.lastCreateEnemyTime = 0;
window.lastFpsTime = 0;

// Будет содержать id интервала вызова gameIteration()
window.gameIterationSetIntervalId = null;

/**
 * Количество кадров в секунду
 * @type Number
 */
window.fps = 0;

function gameIteration() {
    var timeNow = Date.now();
    /**
     * Время прошедшее с последней перерисовки экрана
     * @type Number
     */
    var repaintInterval = timeNow - lastRepaintTime;


    // Пользовательский ввод
    if (poolKeysPress.down) {
        player.addVelocity(new Vector(0, -10));
        player.setSprite(Assets.heroTurnRight);
    } else if (!poolKeysPress.left && !poolKeysPress.top && !poolKeysPress.right) {
        player.setSprite(Assets.hero);
        player.setVelocity(new Vector(0, 0));
    }
    if (poolKeysPress.top) {
        player.addVelocity(new Vector(0, 10));
        player.setSprite(Assets.heroTurnLeft);
    } else if (!poolKeysPress.down && !poolKeysPress.left && !poolKeysPress.right) {
        player.setSprite(Assets.hero);
        player.setVelocity(new Vector(0, 0));
    }
    if (poolKeysPress.left) {
        player.addVelocity(new Vector(-10, 0));
        player.setSprite(Assets.hero);
    } else if (!poolKeysPress.down && !poolKeysPress.top && !poolKeysPress.right) {
        player.setSprite(Assets.hero);
        player.setVelocity(new Vector(0, 0));
    }
    if (poolKeysPress.right) {
        player.addVelocity(new Vector(10, 0));
        player.setSprite(Assets.hero);
    } else if (!poolKeysPress.down && !poolKeysPress.top && !poolKeysPress.left) {
        player.setSprite(Assets.hero);
        player.setVelocity(new Vector(0, 0));
    }
    if (poolKeysPress.fire) {
        player.setSprite(Assets.heroFire);
        heroFire(gameCtx);
    } else if (!poolKeysPress.down && !poolKeysPress.top) {
        player.setSprite(Assets.hero);
    }
    // /Пользовательский ввод

    // Перерисовка объектов
    if (repaintInterval >= 11/*Chrome~80fps*/) {
        fps++;

        repaintAll();
        lastRepaintTime = timeNow;
    }
    // /Перерисовка объектов

    //Проверка столкновений
    if (collisionChecker()) {
        // Значит, произошло столкновение врага с игроком
        return false;
    }

    // Создание новых объектов
    if (timeNow - lastCreateEnemyTime >= 300) {
        createEmemy(gameCtx);
        lastCreateEnemyTime = timeNow;
    }
    if (timeNow - lastCreateStarTime >= 800) {
        createStar(gameCtx);
        lastCreateStarTime = timeNow;
    }
    if (timeNow - lastCreateStuffTime >= 10000) {
        createStuff(gameCtx);
        lastCreateStuffTime = timeNow;
    }
    // /Создание новых объектов

    // Изменение позиций объектов
    var deltaTimePer1000 = (timeNow - lastIterationTime) / 1000;

    player.useForces();
    player.moveToStep(deltaTimePer1000);

    for (var i in poolEnemies) {
        poolEnemies[i].useForces();
        poolEnemies[i].moveToStep(deltaTimePer1000);

        if (poolEnemies[i].isVoid()) {
            // Удаление пустых объектов
            poolEnemies[i].removeHtml();
            delete poolEnemies[i];
            poolEnemies.splice(i, 1);
        }
    }

    for (i in poolBullets) {
        poolBullets[i].useForces();
        poolBullets[i].moveToStep(deltaTimePer1000);

        if (poolBullets[i].isVoid()) {
            // Удаление пустых объектов
            poolBullets[i].removeHtml();
            delete poolBullets[i];
            poolBullets.splice(i, 1);
        }
    }

    for (i in poolStars) {
        poolStars[i].useForces();
        poolStars[i].moveToStep(deltaTimePer1000);

        if (poolStars[i].isVoid()) {
            // Удаление пустых объектов
            poolStars[i].removeHtml();
            delete poolStars[i];
            poolStars.splice(i, 1);
        }
    }

    for (i in poolStuff) {
        poolStuff[i].useForces();
        poolStuff[i].moveToStep(deltaTimePer1000);

        if (poolStuff[i].isVoid()) {
            // Удаление пустых объектов
            poolStuff[i].removeHtml();
            delete poolStuff[i];
            poolStuff.splice(i, 1);
        }
    }

    for (i in poolLabels) {
        poolLabels[i].useForces();
        poolLabels[i].moveToStep(deltaTimePer1000);

        if (poolLabels[i].isVoid()) {
            // Удаление пустых объектов
            poolLabels[i].removeHtml();
            delete poolLabels[i];
            poolLabels.splice(i, 1);
        }
    }
    // /Изменение позиций объектов

    // Обновление счетчика fps, раз в 2 секунды
    if (timeNow - lastFpsTime >= 2000) {
        fpsSpan.innerHTML = Math.floor((fps - fps * (timeNow - lastFpsTime - 2000) / 100) / 2);
        fps = 0;
        lastFpsTime = timeNow;
    }
    // /Обновление счетчика fps

    lastIterationTime = timeNow;

    window.gameIterationSetIntervalId = setTimeout("gameIteration();", 10);
}
