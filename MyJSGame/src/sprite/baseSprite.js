/**
 * Created by gongxun on 15/8/5.
 */

var BaseSprite = cc.Sprite.extend({
    ctor: function () {
        if (arguments.length === 0) {
            this._super();
        } else {
            this._super.apply(this, arguments);
        }
    },
    onExit: function () {
        this._super();
    },
    onEnter: function () {
        this._super();
    }
});