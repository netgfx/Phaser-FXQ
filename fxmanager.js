//
// MVC Architecture
/*
fx = new FX(fxName, parent/null, "content", "frames", fps, repeat);
fx.play("name");
*/
var FX = function(game) {

    var _this = this;
    var fxlist = {};
    var index = 0;
    this.group = null;
    if (game.fx === undefined) {
        game.fx = {};
    } else {

    }

    ////// private fn ///////
    function createFX(fxName, texture, firstFrame, frames, fps, repeat) {
        var fx;
        fx = game.add.sprite(0, 0, texture, firstFrame);
        fx.anchor.setTo(0.5, 0.5);
        animation = fx.animations.add(fxName, frames, fps, repeat);
        animation.killOnComplete = true;
        fx.kill();
        game.fx[fxName].group.add(fx);
    }

    function createGroup(groupName, fxName) {
        this.group = game.add.group();
        this.group.name = groupName;

        window.console.log(game.fx);
        game.fx[fxName] = {
            obj: _this,
            group: this.group
        };
    }

    function addDelay(delay, fn, endFn, args) {
        var _timer = game.time.create(true);
        endFn = endFn || function () {
            game.time.events.remove(_timer);
        };
        _timer.start();
        _timer.onComplete.addOnce(endFn);
        _timer.add(delay, fn, this, args);
    }

    ///// public fn ///////
    this.addFX = function(options) {

        var date = new Date();
        var name = options.fxName || "fx" + index;
        var parent = options.parent || game;
        var texture = options.texture || null;
        var firstFrame = options.firstFrame || null;
        var frames = options.frames || [];
        var fps = options.fps || 24;
        var repeat = options.repeat || false;
        var create = options.preCreate || true;
        var groupName = options.groupName || "fx-"+String(date.getTime())

        _this.options = {
            "name": name,
            "parent": parent,
            "texture": texture,
            "firstFrame": firstFrame,
            "frames": frames,
            "fps": fps,
            "repeat": repeat,
            "create": create,
            "groupName": groupName
        };

        var obj;

        createGroup(groupName, name);
        window.console.log(_this, game.fx[name]);
        game.fx[name].options = _this.options;
        if (create === true) {
            // Phaser.Animation.generateFrameNames(firstFrame, 1, 22, '', 0)
            createFX(name, texture, firstFrame, frames, fps, repeat);
        }
        obj = this;
        return obj;
    };

    this.playDelayed = function(args) {

    }

    this.play = function(name, x, y, delay, scale, rotation, onCompleteFn) {
        var _delay = delay || {};
        if(_delay.enable === true) {
            addDelay(_delay.time, this.play, null, [name, x, y, scale, rotation]);
        }
        window.console.log(name, game.fx[name], game.fx[name].obj);
        var fx;
        var _group = game.fx[name].group;
        var _options = game.fx[name].options;
        var _rotation = rotation || 0;
        fx = _group.getFirstDead();

        // If there aren't any available, create a new one
        if (fx === null) {
            var animation;
            fx = game.add.sprite(0, 0, _options.texture, _options.firstFrame);
            fx.anchor.setTo(0.5, 0.5);
            animation = fx.animations.add(_options.name, _options.frames, _options.fps, _options.repeat);
            animation.killOnComplete = true;
            _group.add(fx);
        }

        fx.revive();
        scale = scale || 1;
        fx.x = x;
        fx.y = y;
        fx.scale.x = scale;
        fx.scale.y = scale;
        game.world.bringToTop(_group);

        fx.angle = rotation;
        // Play the animation
        fx.animations.play(_options.name);
        if(onCompleteFn) {
            window.console.log("animation completed");
            fx.animations.currentAnim.onComplete.addOnce(onCompleteFn, this);
        }
        return fx;
    };

    this.stopAnimation = function(name) {
        game.fx[name].group.getFirstAlive().animations.stop();
        game.fx[name].group.getFirstAlive().kill();
    };

    this.remove = function() {

    };

    this.destroy = function() {

    };

    return this;
};

