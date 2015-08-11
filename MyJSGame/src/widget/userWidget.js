/**
 * Created by gongxun on 15/8/7.
 */

var userWidget = BaseWidget.extend({
    json : null,
    gameName : null,
    mainNode : null,

    ctor: function () {
        this._super();

        this.setContentSize(cc.size(613, 146));

        var file = "res/cocostudio/ccs_widget_user.json";
        cc.log("ccs.load : %s", file);
        var json = ccs.load(file);
        this.ccsNode = json.node;

        //prize
        ccui.helper.seekWidgetByName(this.ccsNode, "Button_prize").addTouchEventListener(this.touchPrizeEvent,this);

        //game
        ccui.helper.seekWidgetByName(this.ccsNode, "Button_game").addTouchEventListener(this.touchGameEvent,this);

        this.addChild(this.ccsNode);
    },
    setGameInfo : function (json, main){
        this.json = json;
        var gameId = json.game_id;
        var areaId = json.area_id;
        var sessionKey = json.session_key;
        this.mainNode = main;

        //gameName
        for(var i = 0; i < mo.serverList.length; i++){
            if (gameId == mo.serverList[i].game_id && areaId == mo.serverList[i].area_id){
                gameName = mo.serverList[i].name;
                this.json.game_name = gameName;
                break;
            }
        }


        //info
        if (this.json.userinfo){
            this.setUserInfo(this.json.userinfo);
        }
        else{
            var post = "sessionid=" + sessionKey + "&r=1002";
            mo.httpRequestHelper.sendGetUserInfo(post, this.setUserInfo, this);
        }

        //exchange
        if (this.json.exchangeInfo){
            this.setExchangeInfo(this.json.exchangeInfo);
        }
        else{
            var post = "sessionid=" + sessionKey;
            mo.httpRequestHelper.sendGetUserExchangeInfo(post, this.setExchangeInfo, this);
        }
    },
    touchPrizeEvent: function (sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED){
            var Panel_game = ccui.helper.seekWidgetByName(this.ccsNode, "Panel_game");
            var Panel_prize = ccui.helper.seekWidgetByName(this.ccsNode, "Panel_prize");

            Panel_game.setVisible(false);
            Panel_prize.setVisible(true);
        }
    },
    touchGameEvent: function (sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED){
            var Panel_game = ccui.helper.seekWidgetByName(this.ccsNode, "Panel_game");
            var Panel_prize = ccui.helper.seekWidgetByName(this.ccsNode, "Panel_prize");

            Panel_game.setVisible(true);
            Panel_prize.setVisible(false);

        }
    },
    setUserInfo : function (json){
        this.json.userinfo = json;
        //coin
        ccui.helper.seekWidgetByName(this.ccsNode, "Text_coin").setString(mo.gameHelper.getValueForIitems(0, json.profile.items, json.profile.items_num));

        //tickets
        ccui.helper.seekWidgetByName(this.ccsNode, "Text_tickets").setString(mo.gameHelper.getValueForIitems(1, json.profile.items, json.profile.items_num));

        //coupons
        ccui.helper.seekWidgetByName(this.ccsNode, "Text_coupons").setString(mo.gameHelper.getValueForIitems(2, json.profile.items, json.profile.items_num));

        //rank
        this.setRankInfo("Text_match0", json.orders.jifen);
        this.setRankInfo("Text_match1", json.orders.jinying);
        this.setRankInfo("Text_match2", json.orders.dashi);
        this.setRankInfo("Text_match3", json.orders.zhengba);
        this.setRankInfo("Text_rank0", json.orders.zhanli);
        this.setRankInfo("Text_rank1", json.orders.caifu);
        this.setRankInfo("Text_rank2", json.orders.meili);

    },
    setExchangeInfo : function(json){
        this.json.exchangeInfo = json;

        var xoffset = 138;
        var maxh = 415, yoffert = 130;

        for(var i = 0; i < this.json.exchangeInfo.length; i++){
            var layout = new ccui.Layout();
            layout.setPosition(cc.p(i % 2 == 0 ? xoffset : 370, maxh - parseInt(i / 2) * yoffert));

            var image = new ccui.ImageView();
            image.setContentSize(cc.size(150, 125));
            layout.addChild(image);

            var text = new ccui.Text();
            text.setAnchorPoint(cc.p(0, 0.5));
            text.setColor(cc.color.YELLOW);
            text.setString("X " + json[i].num);
            text.setFontSize(20);
            text.setPosition(cc.p(80, -40));
            layout.addChild(text);

            var jsbHelper = new cc.CustomClass();
            jsbHelper.loadHttpImage(image, json[i].product_pic, cc.size(150, 125));

            ccui.helper.seekWidgetByName(this.ccsNode, "Panel_prize").addChild(layout);
        }

    },
    setRankInfo : function (name, value){
        if (value){
            ccui.helper.seekWidgetByName(this.ccsNode, name).setString("第" + value + "名");
        }
    }
});