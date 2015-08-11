/**
 * Created by gongxun on 15/8/3.
 */

var mainLayer = BaseTestLayer.extend({
    pageSelectSprite : null,

    ctor: function () {
        this._super();
        mo.runLayerName =
        {
            name : "mainLayer",
            ptr : this
        };
        
        var file = "res/cocostudio/ccs_main.json";
        cc.log("ccs.load : %s", file);
        var json = ccs.load(file);
        this.ccsNode = json.node;
        this.addChild(this.ccsNode);
        this.resetSize(this.ccsNode);

        //userInfo
        var Image_info = ccui.helper.seekWidgetByName(this.ccsNode, "Image_info");
        Image_info.addTouchEventListener(this.touchUserInfoEvent,this);

        //login
        ccui.helper.seekWidgetByName(this.ccsNode, "Button_Login").addTouchEventListener(this.touchLoginEvent, this);

        //select
        var PageView_huidong = ccui.helper.seekWidgetByName(this.ccsNode, "PageView_huidong");
        this.pageSelectSprite = new pageSelectSprite();
        this.pageSelectSprite.setPage(PageView_huidong);
        this.pageSelectSprite.setPosition(cc.p(0, 210));
        ccui.helper.seekWidgetByName(this.ccsNode, "Panel_center").addChild(this.pageSelectSprite);

        //调整大小
        var ListView_list = ccui.helper.seekWidgetByName(this.ccsNode, "ListView_list");
        ListView_list.setContentSize(cc.size(613, parseInt((mo.curSize.y/2) + 70)));
    },
    onEnter: function () {
        this._super();

        mo.eventHelper.add("updataUserInfo", this, this.updataUserInfo);
        mo.eventHelper.add("updataSeverList", this, this.updataSeverList);

        //获取服务器信息
        if (mo.serverList == null && cc.sys.isNative){
            mo.httpRequestHelper.sendGetGameInfo();
        }

        this.updataUserInfo();
        this.updataSeverList();
    },
    onExit: function() {
        mo.eventHelper.remove(this);

        this._super();
    },
    touchUserInfoEvent: function (sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED){
            this.addChild(new userInfoLayer());
        }
    },
    touchLoginEvent: function (sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED){
            mo.layerHelper.intoLoginLayer();
        }
    },
    updataUserInfo : function (){
        if (mo.games){
            ccui.helper.seekWidgetByName(this.ccsNode, "Image_info").setVisible(true);
            ccui.helper.seekWidgetByName(this.ccsNode, "Button_Login").setVisible(false);

            ccui.helper.seekWidgetByName(this.ccsNode, "Text_nick").setString(mo.userInfo.nickname);
            ccui.helper.seekWidgetByName(this.ccsNode, "Text_diamonds").setString("钻石:" + mo.userInfo.diamond);
            ccui.helper.seekWidgetByName(this.ccsNode, "Image_head").loadTexture("res/cocostudio/head" + mo.userInfo.head + ".png");
        }
        else{
            ccui.helper.seekWidgetByName(this.ccsNode, "Image_info").setVisible(false);
            ccui.helper.seekWidgetByName(this.ccsNode, "Button_Login").setVisible(true);

        }
    },
    updataSeverList : function(){
        var ListView_list = ccui.helper.seekWidgetByName(this.ccsNode, "ListView_list");
        ListView_list.removeAllItems();

        //games
        for (var i = 0; i < mo.serverList.length; i++){
            var data = mo.serverList[i];

            var game = new gameWidget();
            game.setGameInfo(data, this);
            ListView_list.pushBackCustomItem(game);
        }

        ListView_list.pushBackCustomItem(new gameNotWidget());

        //ac
        this.setHuodongPage();
    },
    setHuodongPage : function(){
        var PageView_huidong = ccui.helper.seekWidgetByName(this.ccsNode, "PageView_huidong");
        PageView_huidong.removeAllPages();

        for(var i = 0; i < mo.acImages.length; i++){
            var layout = new ccui.Layout();
            PageView_huidong.addPage(layout);

            var image = new ccui.ImageView();
            image.setPosition(cc.p(306.5, 103));
            var jsbhelper = new cc.CustomClass();
            jsbhelper.loadHttpImage(image, mo.acImages[i], cc.size(613, 206));

            layout.addChild(image);
        }
        this.pageSelectSprite.setSelectSprite();
    }
});

mo.serverList = null;