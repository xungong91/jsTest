/**
 * Created by gongxun on 16/3/30.
 */

var MenuLayer = cc.Layer.extend({
    ctor:function () {
        this._super();
    },
    onEnter:function () {
        this._super();

        //games
        var fruitAttack = new cc.MenuItemImage(
            "res/loading_logo.png",
            "res/loading_logo.png",
            function () {
                mo.sceneHelper.runSceneFruitAttack();
            }, this);
        fruitAttack.attr({
            x: mo.curSize.width / 2,
            y: mo.curSize.height - 100,
            anchorX: 0.5,
            anchorY: 0.5
        });

        var menu = new cc.Menu(fruitAttack);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu, 1);
    }
}) ;