(function(Vector) {
    if (!window.QUnit) {
        alert("Object window.QUnit does not exist");
        return false;
    }

    module("class Vector");

    test("new Vector", function() {
        var like_vector = Vector.prototype;
        like_vector.x = 0;
        like_vector.y = 0;
        deepEqual(new Vector(0, 0), like_vector, "new Vector(0, 0)");

        like_vector.x = 5;
        like_vector.y = 15;
        deepEqual(new Vector(5, 15), like_vector, "new Vector(5, 15)");

        like_vector.x = -4;
        like_vector.y = -9;
        deepEqual(new Vector(-4, -9), like_vector, "new Vector(-4, -9)");


        var vector_for_clone = new Vector(-11, 118);
        deepEqual(
                new Vector(null, null, vector_for_clone),
                vector_for_clone,
                "new Vector(null, null, clone)"
                );
    });

    test("Vector static attributes and  methods", function() {
        var coef_to_radians = (1 / 180) * Math.PI;
        var coef_to_degrees = 1 / coef_to_radians;

        equal(
                Vector.prototype.TO_RADIANS,
                coef_to_radians,
                "Vector.prototype.TO_RADIANS"
                );
        equal(
                Vector.prototype.TO_DEGREES,
                coef_to_degrees,
                "Vector.prototype.TO_DEGREES"
                );
    });

    test("Vector instance native attributes and methods", function() {
        var vect = new Vector(16, 14);
        deepEqual(vect.copy(), vect, "vect.copy()");

        vect = new Vector(16, 14);
        deepEqual(vect.plus(26, -29), new Vector(42, -15), "vect.plus(dx, dy)");

        vect = new Vector(16, 14);
        deepEqual(
                vect.plusVector(new Vector(-5, 2)),
                new Vector(11, 16),
                "vect.plusVector(v)"
                );

        deepEqual(
                new Vector(0, 4).plus(11, 18),
                new Vector(0, 4).plusVector(new Vector(11, 18)),
                "vect.plus(dx, dy) === vect.plusVector(v)"
                );

        vect = new Vector(12, -8);
        deepEqual(
                vect.sub(4, -8),
                new Vector(8, 0),
                "vect.sub(dx, dy)"
                );

        vect = new Vector(12, -8);
        deepEqual(
                vect.subVector(new Vector(7, 14)),
                new Vector(5, -22),
                "vect.subVector(v)"
                );

        deepEqual(
                new Vector(-4, 1).sub(18, -6),
                new Vector(-4, 1).subVector(new Vector(18, -6)),
                "vect.sub(dx, dy) === vect.subVector(v)"
                );

        vect = new Vector(11, 15);
        deepEqual(
                vect.mul(4),
                new Vector(44, 60),
                "vect.mul(scalar > 0)"
                );

        vect = new Vector(17, -5);
        deepEqual(
                vect.mul(0),
                new Vector(0, 0),
                "vect.mul(0)"
                );

        vect = new Vector(1, 16);
        deepEqual(
                vect.mul(-2),
                new Vector(-2, -32),
                "vect.mul(scalar < 0)"
                );

        vect = new Vector(5, 4);
        deepEqual(
                vect.lengthPower2(),
                5 * 5 + 4 * 4,
                "vect.lengthPower2()"
                );

        vect = new Vector(0, 0);
        deepEqual(
                vect.lengthPower2(),
                0,
                "vect(0, 0).lengthPower2()"
                );

        vect = new Vector(5, 4);
        deepEqual(
                vect.length(),
                Math.sqrt(5 * 5 + 4 * 4),
                "vect.length()"
                );

        vect = new Vector(0, 0);
        deepEqual(
                vect.length(),
                0,
                "vect(0, 0).length()"
                );

        vect = new Vector(3, 4);
        deepEqual(
                vect.getNorm(),
                new Vector(3 / 5, 4 / 5),
                "vect.getNorm()"
                );

        vect = new Vector(0, 0);
        deepEqual(
                vect.getNorm(),
                new Vector(0, 0),
                "vect(0, 0).getNorm()"
                );

        vect = new Vector(1, 1);
        deepEqual(
                vect.getAngle(),
                Math.PI / 4,
                "vect(1, 1).getAngle()"
                );

        vect = new Vector(-5, 0);
        deepEqual(
                vect.getAngle(),
                Math.PI,
                "vect(-5, 0).getAngle()"
                );

        vect = new Vector(3, 0);
        deepEqual(
                vect.getAngle(),
                0,
                "vect(3, 0).getAngle()"
                );

        vect = new Vector(-2, -2);
        deepEqual(
                vect.getAngle(),
                5 * Math.PI / 4,
                "vect(-2, -2).getAngle()"
                );

        vect = new Vector(2, 0);
        deepEqual(
                vect.rotateToAngle(Math.PI),
                new Vector(-2, 0),
                "vect(2, 0).rotateToAngle(Math.PI)"
                );

        vect = new Vector(2, 2);
        deepEqual(
                vect.rotateToAngle(Math.PI / 2),
                new Vector(-2, 2),
                "vect(2, 2).rotateToAngle(Math.PI / 2)"
                );
    });
})(window.Vector);

(function(Sprite) {
    module("class Sprite");

    test("new Sprite", function() {
        var sp = new Sprite("img/test.png", 16, 24, 400, [3, 5, 8], true);
        var like_sprite = Sprite.prototype;
        like_sprite.src = "img/test.png";
        like_sprite.oneImgWidth = 16;
        like_sprite.oneImgHeight = 24;
        like_sprite.changeInterval = 400;
        like_sprite.imgSequence = [3, 5, 8];
        like_sprite.repeat = true;
        like_sprite._isfirstRepeat = true;
        like_sprite._currentSeqIndex = 0;
        like_sprite._imgSequenceLength = like_sprite.imgSequence.length;
        like_sprite._spriteMap = new Image();
        like_sprite._spriteMap.src = like_sprite.src;
        like_sprite._lastUpdateTime = sp._lastUpdateTime;
        deepEqual(
                sp,
                like_sprite,
                "new Sprite('img/test.png', 16, 24, 400, [3, 5, 8], true)"
                );
    });
})(window.Sprite);

(function(Unit, Sprite, Vector) {
    module("class Unit");

    test("new Unit, time for create", function() {
        var temp_unit;

        var time_start = Date.now();
        for (var i = 0; i < 100; i++) {
            temp_unit = new Unit(
                    new Sprite(
                            "img/test.png",
                            16,
                            24,
                            400,
                            [3, 5, 8],
                            true
                            ),
                    new Vector(16, 8),
                    100,
                    150);
        }
        var time_end = Date.now();

        ok(
                time_end - time_start <= 500,
                "Create 100 instances of Unit class <= 500ms (5 ms/instances)"
                );
    });

    test("Unit static attributes and  methods", function() {
        equal(
                Unit.prototype.getWorldWidth(),
                0,
                "Unit.prototype.getWorldWidth()"
                );

        equal(
                Unit.prototype.getWorldHeight(),
                0,
                "Unit.prototype.getWorldHeight()"
                );

        equal(
                Unit.prototype.coordSysDX,
                0,
                "Unit.prototype.coordSysDX"
                );

        equal(
                Unit.prototype.coordSysDY,
                0,
                "Unit.prototype.coordSysDY"
                );
        
        Unit.prototype.setCoordSysDX(50);
        equal(
                Unit.prototype.coordSysDX,
                50,
                "Unit.prototype.coordSysDX"
                );
        
        Unit.prototype.setCoordSysDY(90);
        equal(
                Unit.prototype.coordSysDY,
                90,
                "Unit.prototype.coordSysDY"
                );
        
        equal(
                Unit.prototype.convToMonitorX(20),
                70,
                "Unit.prototype.convToMonitorX(x)"
                );
        
        equal(
                Unit.prototype.convToMonitorY(5),
                85,
                "Unit.prototype.convToMonitorY(y)"
                );
        
        
        equal(
                Unit.prototype.convToCartesianX(64),
                14,
                "Unit.prototype.convToCartesianX(x)"
                );
        
        equal(
                Unit.prototype.convToCartesianY(14),
                76,
                "Unit.prototype.convToCartesianY(y)"
                );
    });
    
//    test("Unit instance native attributes and methods", function() {
//    });
})(window.Unit, window.Sprite, window.Vector);
