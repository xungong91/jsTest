/**
 * Created by gongxun on 16/4/14.
 */

var GameUILayer = cc.Layer.extend({
    onStartFunc : null,
    ctor:function (onStart) {
        this._super();

        this.onStartFunc = onStart;
    },
    onEnter:function () {
        this._super();

        var btn = new cc.MenuItemImage(
            "FruitAttack/res/btn/btnStartGameNor.png",
            "FruitAttack/res/btn/btnStartGameDown.png",
            function () {
                this.onStartFunc();
            }, this);
        btn.setPosition(cc.winSize.width / 2, 30);

        var menu = new cc.Menu(btn);
        menu.setPosition(0, 0);
        this.addChild(menu);
    },
    getValue : function(test){
        test[0] += "呵呵";
    }
});
