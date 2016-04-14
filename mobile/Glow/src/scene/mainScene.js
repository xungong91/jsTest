
var MainScene = cc.Scene.extend({
    ctor:function () {
        this._super();
    },
    onEnter:function () {
        this._super();

        var layer = new MenuLayer();
        this.addChild(layer);
    }
});
