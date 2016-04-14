/**
 * Created by gongxun on 16/4/14.
 */


var GameScene = cc.Scene.extend({
    ctor:function () {
        this._super();
    },
    onEnter:function () {
        this._super();

        var layer = new GameLayer();
        this.addChild(layer);
    }
});

var GameLayer = cc.Layer.extend({
    ctor:function () {
        this._super();
    },
    onEnter:function () {
        this._super();

        var winSize = cc.director.getWinSize();

        var bg = new cc.Sprite("FruitAttack/res/background.jpg");
        bg.setPosition(winSize.width / 2, winSize.height / 2);
        this.addChild(bg);

        var btn = new cc.MenuItemImage(
            "FruitAttack/res/btn/btnStartGameNor.png",
            "FruitAttack/res/btn/btnStartGameDown.png",
            function () {
                mo.sceneHelper.runSceneMain();
            }, this);
        btn.setPosition(winSize.width / 2, winSize.height / 3);

        var menu = new cc.Menu(btn);
        menu.setPosition(0, 0);
        this.addChild(menu);
    }
});
