/**
 * Created by gongxun on 15/8/3.
 */

var mainLayer = BaseTestLayer.extend({
    ctor: function () {
        this._super();
        var file = "res/cocostudio/ccs_main.json";
        cc.log("ccs.load : %s", file);
        var json = ccs.load(file);
        this.ccsNode = json.node;
        this.addChild(this.ccsNode);
        this.resetSize(this.ccsNode);

        //back button
        var Button_back = ccui.helper.seekWidgetByName(this.ccsNode, "Button_back");
        Button_back.addTouchEventListener(this.touchBackEvent,this);

        //userInfo
        var Image_info = ccui.helper.seekWidgetByName(this.ccsNode, "Image_info");
        Image_info.addTouchEventListener(this.touchUserInfoEvent,this);

        //login
        ccui.helper.seekWidgetByName(this.ccsNode, "Button_Login").addTouchEventListener(this.touchLoginEvent, this);

        this.updataUserInfo();
    },
    onEnter: function () {
        this._super();

        mo.eventHelper.add("updataUserInfo", this, this.updataUserInfo);
        mo.eventHelper.add("updataSeverList", this, this.updataSeverList);

        //获取信息
        if (mo.serverList == null && cc.sys.isNative){
            //mo.httpRequestHelper.sendGetInfo();
        }

        if (!cc.sys.isNative){
            this.updataSeverList();
        }
    },
    onExit: function() {
        mo.eventHelper.remove(this);

        this._super();
    },
    touchBackEvent: function (sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED){

            mo.layerHelper.intoLoginLayer();
        }
    },
    touchUserInfoEvent: function (sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED){
            mo.layerHelper.intoUserInfoLayer();
        }
    },
    touchLoginEvent: function (sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED){

            var sps = cc.Sprite.create();

            var customClass = cc.CustomClass.create();
            var msg = customClass.helloMsg()
            cc.log("customClass's msg is : " + msg)

            return;
            cc.loader.loadImg("http://img3.dwstatic.com/lol/1508/302709384371/1438754676362.jpg", {isCrossOrigin : false}, function(err,img){
                if(err){
                    cc.log(err);
                }
                else{
                    var logo = new cc.Sprite(img);
                    logo.setPosition(200,330);
                    mo.mainScene.addChild(logo, 2);
                }
            });
            return;


            //var url = "http://img3.dwstatic.com/lol/1508/302709384371/1438754676362.jpg";
            //var url = "http://www.acfun.tv/a/ac2076637";
            var url = "http://httpbin.org/image/png";

            mo.httpRequestHelper.sendGetImg(url);
            return;

            return;
            mo.layerHelper.intoLoginLayer();
        }
    },
    updataUserInfo : function (){
        if (mo.httpSessionid){
            ccui.helper.seekWidgetByName(this.ccsNode, "Image_info").setVisible(true);
            ccui.helper.seekWidgetByName(this.ccsNode, "Button_Login").setVisible(false);

            ccui.helper.seekWidgetByName(this.ccsNode, "Text_nick").setString(mo.userInfo.nickname);
            ccui.helper.seekWidgetByName(this.ccsNode, "Text_diamonds").setString("钻石:" + mo.userInfo.diamond);
        }
        else{
            ccui.helper.seekWidgetByName(this.ccsNode, "Image_info").setVisible(false);
            ccui.helper.seekWidgetByName(this.ccsNode, "Button_Login").setVisible(true);

        }
    },
    updataSeverList : function(){
        var ListView_list = ccui.helper.seekWidgetByName(this.ccsNode, "ListView_list");
        ListView_list.removeAllItems();

        if (!cc.sys.isNative){
            for(var i = 0; i < 3; i++){

                ListView_list.pushBackCustomItem(new gameWidget());
            }

            ListView_list.pushBackCustomItem(new gameNotWidget());

            return;
        }

        for (var i = 0; i < mo.serverList.length; i++){
            var data = mo.serverList[i];
            cc.log(data.area_id);
            cc.log(data.game_id);
            cc.log(data.name);
            cc.log(data.version);
            cc.log(data.icon);

            var game = new gameWidget();
            game.setGameInfo(data);
            ListView_list.pushBackCustomItem(game);
        }

        ListView_list.pushBackCustomItem(new gameNotWidget());
    }
});

mo.serverList = null;