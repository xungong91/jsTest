/**
 * Created by gongxun on 15/8/3.
 */

var userInfoLayer = BaseTestLayer.extend({
    PageView : null,
    pageSelectSprite : null,

    ctor: function () {
        this._super();
        mo.runLayerName =
        {
            name : "userInfoLayer",
            ptr : this
        };

        var file = "res/cocostudio/ccs_userInfo.json";
        cc.log("ccs.load : %s", file);
        var json = ccs.load(file);
        this.ccsNode = json.node;
        this.addChild(this.ccsNode);
        this.resetSize(this.ccsNode);

        //back button
        var Button_back = ccui.helper.seekWidgetByName(this.ccsNode, "Button_back");
        Button_back.addTouchEventListener(this.touchBackEvent,this);

        var Button_exchange = ccui.helper.seekWidgetByName(this.ccsNode, "Button_exchange");
        Button_exchange.addTouchEventListener(this.touchExchangeEvent,this);

        //page
        this.PageView = ccui.helper.seekWidgetByName(this.ccsNode, "PageView");
        this.pageSelectSprite = new pageSelectSprite();
        this.pageSelectSprite.setPageNotListener(this.PageView);
        this.pageSelectSprite.setPosition(cc.p(0, -450));
        ccui.helper.seekWidgetByName(this.ccsNode, "Panel_center").addChild(this.pageSelectSprite);

    },
    onEnter: function () {
        this._super();

        //设置用户信息
        this.updataUserInfo();
    },
    onExit: function() {
        this._super();
    },
    touchBackEvent: function (sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED){
            this.getParent().removeChild(this);
        }
    },
    touchExchangeEvent: function (sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED){
            mo.layerHelper.intoLoginLayer();
        }
    },
    updataUserInfo : function(){
        ccui.helper.seekWidgetByName(this.ccsNode, "Text_userid").setString("账号:" + mo.userInfo.userId);
        ccui.helper.seekWidgetByName(this.ccsNode, "Text_nick").setString(mo.userInfo.nickname);
        ccui.helper.seekWidgetByName(this.ccsNode, "Text_diamonds").setString("钻石:" + mo.userInfo.diamond);
        ccui.helper.seekWidgetByName(this.ccsNode, "Image_head").loadTexture("res/cocostudio/head" + mo.userInfo.head + ".png");

        //游戏信息
        this.PageView.addEventListener(this.pageViewEvent, this);
        this.PageView.removeAllPages();

        for (var i = 0; i < mo.games.length; i++){
            var Layout = new ccui.Layout();
            this.PageView.addPage(Layout);

            var userw = new userWidget();
            userw.setGameInfo(mo.games[i], this);

            Layout.addChild(userw);
        }
        this.pageViewEvent(this.PageView, ccui.PageView.EVENT_TURNING);
    },
    pageViewEvent: function (sender, type) {
        switch (type) {
            case ccui.PageView.EVENT_TURNING:
                var vip = "";
                if (mo.games[this.PageView.getCurPageIndex()].userinfo && mo.games[this.PageView.getCurPageIndex()].userinfo.vip_level) {
                    vip = "   VIP" + mo.games[this.PageView.getCurPageIndex()].userinfo.vip_level;
                }

                ccui.helper.seekWidgetByName(this.ccsNode, "Text_vip").setString(mo.games[this.PageView.getCurPageIndex()].game_name + vip);
                this.pageSelectSprite.setSelectSprite();
                break;
            default:
                break;
        }
    }
});

mo.userList = null;

mo.userInfo = {};

mo.userInfo.userId = "";
mo.userInfo.nickname = "";
mo.userInfo.login_name = "";
mo.userInfo.head = "head_0_0";
mo.userInfo.diamond = 0;
