/**
 * Created by gongxun on 15/8/3.
 */

var userInfoLayer = BaseTestLayer.extend({
    editBoxUserName : null,
    editBoxPwd : null,

    ctor: function () {
        this._super();
        var node,
            file = "res/cocostudio/ccs_userInfo.json";
        cc.log("ccs.load : %s", file);
        var json = ccs.load(file);
        node = json.node;
        this.addChild(node);
        this.resetSize(node);

        //back button
        var Button_back = ccui.helper.seekWidgetByName(node, "Button_back");
        Button_back.addTouchEventListener(this.touchBackEvent,this);

        //设置用户信息
        this.updataUserInfo();
    },
    onEnter: function () {
        this._super();

        mo.eventHelper.add("updataUserInfo", this, this.updataUserInfo);
    },
    onExit: function() {
        mo.eventHelper.remove(this);

        this._super();
    },
    touchBackEvent: function (sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED){
            mo.layerHelper.intoMainLayer();
        }
    },
    updataUserInfo : function(){

    }
});

mo.userInfo = {};

mo.userInfo.nickname = "";
mo.userInfo.login_name = "";
mo.userInfo.diamond = 0;
