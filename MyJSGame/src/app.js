//

var mainScene = cc.Scene.extend({
    onEnter:function () {
        this._super();

        ///初始化一些设置的地方
        mo.mainScene = this;

        mo.fileHelper.create();


        //加载登录界面
        this.addChild(new mainLayer());
    },
    onExit: function() {
        ccs.actionManager.releaseActions();
        this._super();
    }
});

