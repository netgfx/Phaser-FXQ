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
    if (game.fx !== undefined) {
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
        this.group.add(fx);
    }

    function createGroup(groupName, fxName) {
        this.group = game.addGroup();
        this.group.name = groupName;

        game.fx[fxName] = {
            obj: this,
            group: this.group
        };
    }

    ///// public fn ///////
    this.addFX = function(options) {

        var date = new Date();
        var name = options.fxName || "fx" + index;
        var parent = options.parent || game;
        var texture = options.texture || null;
        var firstFrame = optiosn.firstFrame || null;
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
        if (create === true) {
            // Phaser.Animation.generateFrameNames(firstFrame, 1, 22, '', 0)
            createFX(name, texture, firstFrame, frames, fps, repeat);
        }
        obj = this;
        return obj;
    };

    this.play = function(x, y, scale, rotation, onCompleteFn) {
        var fx;
        var _rotation = rotation || 0;
        fx = this.group.getFirstDead();

        // If there aren't any available, create a new one
        if (fx === null) {
            var animation;
            fx = game.add.sprite(0, 0, this.options.texture, this.options.firstFrame);
            fx.anchor.setTo(0.5, 0.5);
            animation = fx.animations.add(this.options.name), this.options.frames, this.options.fps, this.options.repeat);
            animation.killOnComplete = true;
            this.group.add(fx);
        }

        fx.revive();
        scale = scale || 1;
        fx.x = x;
        fx.y = y;
        fx.scale.x = scale;
        fx.scale.y = scale;
        game.world.bringToTop(this.group);

        fx.angle = rotation;
        // Play the animation
        fx.animations.play(this.options.name);

        return fx;
    };

    this.remove = function() {

    };

    this.destroy = function() {

    };

    return this;
};
