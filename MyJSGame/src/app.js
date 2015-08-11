//

var mainScene = cc.Scene.extend({
    onEnter:function () {
        this._super();

        ///初始化一些设置的地方
        mo.mainScene = this;
        mo.fileHelper.create();

        //android返回
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyReleased: function (key, event) {
                if (key == cc.KEY.back) {
                    if (mo.runLayerName.name == "userInfoLayer"){
                        mo.runLayerName.ptr.getParent().removeChild(mo.runLayerName.ptr);
                        mo.runLayerName.name = "mainLayer";
                    }
                    else if (mo.runLayerName.name == "gameInfoLayer"){
                        mo.runLayerName.ptr.getParent().removeChild(mo.runLayerName.ptr);
                        mo.runLayerName.name = "mainLayer";
                    }
                    else if (mo.runLayerName.name == "regLayer"){
                        mo.layerHelper.intoLoginLayer();
                    }
                    else if (mo.runLayerName.name == "loginLayer"){
                        mo.layerHelper.intoMainLayer();
                    }
                    else if (mo.runLayerName.name == "mainLayer"){
                        cc.director.end();
                    }
                    else{
                        cc.director.end();
                    }
                }
            }
        }, this);

        //加载登录界面
        this.addChild(new mainLayer());

        //自动登录
        var userlogin = mo.fileHelper.getUserLogin();
        var username = userlogin.name;
        var pwd = userlogin.pwd;

        if (username != "" && pwd != "") {
            var pwdmd5 = hex_md5(pwd);
            var post = "third_login_name=" + username + "&third_password=" + pwdmd5;

            mo.httpRequestHelper.sendLogin(post,
                function (success) {
                    if (success) {
                    }
                    else {

                    }
                }, this);
        }
    },
    onExit: function() {
        ccs.actionManager.releaseActions();
        this._super();
    }
});

mo.runLayerName = null;
