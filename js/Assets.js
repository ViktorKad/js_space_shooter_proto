var srcAssets = {
    background: "img/bg.png",
    hero: "img/hero-model-3.png",
    heroTurnLeft: "img/hero-model-3.png",
    heroTurnRight: "img/hero-model-3.png",
    heroFire: "img/hero-fire-2.png",
    enemy: "img/enemy-model-4.png",
    enemyBroken: "img/enemy-broken-model-2.png",
    bulletS: "img/bullet-S.png",
    bulletL: "img/bullet-L.png",
    bulletM: "img/bullet-M.png",
    star1: "img/star-1.png",
    star2: "img/star-2.png",
    staffS: "img/staff-S.png",
    staffL: "img/staff-L.png",
    staffM: "img/staff-M.png",
    enemyExplosion: "img/enemy-explosion.png",
    labelPlus10: "img/label-plus-10.png",
    labelPlus50: "img/label-plus-50.png",
    spriteTest: "img/sprite-test.png"
};

//TODO: Посмотри, подумай, перенеси
Assets = {
    hero: new Sprite(srcAssets.hero, 32, 32, 50, [0, 1, 2, 3], true),
    heroTurnLeft: new Sprite(srcAssets.heroTurnLeft, 32, 32, 50, [0, 1, 2, 3], true),
    heroTurnRight: new Sprite(srcAssets.heroTurnRight, 32, 32, 50, [0, 1, 2, 3], true),
    heroFire: new Sprite(srcAssets.heroFire, 32, 32, 50, [0, 1, 2, 3], true),
    enemy: new Sprite(srcAssets.enemy, 32, 32, 200, [0, 1, 2], true),
    enemyBroken: new Sprite(srcAssets.enemyBroken, 32, 32, 150, [0, 1, 2, 3, 4, 5, 6, 7], true),
    bulletS: new Sprite(srcAssets.bulletS, 32, 32, 200, [0], true),
    bulletL: new Sprite(srcAssets.bulletL, 32, 32, 200, [0], true),
    bulletM: new Sprite(srcAssets.bulletM, 32, 32, 50, [0, 1, 2, 3], true),
    star1: new Sprite(srcAssets.star1, 32, 32, 200, [0], true),
    star2: new Sprite(srcAssets.star2, 32, 32, 200, [0], true),
    staffS: new Sprite(srcAssets.staffS, 32, 32, 150, [0, 1, 2, 3, 4, 5, 6, 7], true),
    staffL: new Sprite(srcAssets.staffL, 32, 32, 150, [0, 1, 2, 3, 4, 5, 6, 7], true),
    staffM: new Sprite(srcAssets.staffM, 32, 32, 150, [0, 1, 2, 3, 4, 5, 6, 7], true),
    enemyExplosion: new Sprite(srcAssets.enemyExplosion, 32, 32, 30, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], false),
    labelPlus10: new Sprite(srcAssets.labelPlus10, 32, 32, 100, [0, 1, 2, 3], true),
    labelPlus50: new Sprite(srcAssets.labelPlus50, 32, 32, 100, [0, 1, 2, 3], true)
};
