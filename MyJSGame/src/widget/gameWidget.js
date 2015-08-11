/**
 * Created by gongxun on 15/8/5.
 */

var gameWidget = BaseWidget.extend({
    json : null,
    mainNode : null,

    ctor: function () {
        this._super();

        this.setContentSize(cc.size(613, 146));

        var file = "res/cocostudio/ccs_widget_game.json";
        cc.log("ccs.load : %s", file);
        var json = ccs.load(file);
        this.ccsNode = json.node;

        ccui.helper.seekWidgetByName(this.ccsNode, "Image_main").addTouchEventListener(this.touchBackEvent,this);

        ccui.helper.seekWidgetByName(this.ccsNode, "Button").addTouchEventListener(this.touchIntoEvent,this);

        this.addChild(this.ccsNode);
    },
    setGameInfo : function (json, main){
        this.json = json;
        this.mainNode = main;

        //info
        var info = "拥有玩家:" + json.user_num + "\n\n" + "版本号:\n" + json.version;
        ccui.helper.seekWidgetByName(this.ccsNode, "Text_info").setString(info);

        //gmaename
        ccui.helper.seekWidgetByName(this.ccsNode, "Text_name").setString(json.name);

        //icon
        var jsbHelper = cc.CustomClass();
        jsbHelper.loadHttpImage(ccui.helper.seekWidgetByName(this.ccsNode, "Image_icon"), json.icon, cc.size(120, 120));
    },
    touchBackEvent: function (sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED){
            if (this.json)
            {
                var gameinfolayer = new gameInfoLayer();
                gameinfolayer.setGameInfo(this.json);
                this.mainNode.addChild(gameinfolayer);
            }
        }
    },
    touchIntoEvent: function (sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED){
            var pkg = this.json.pkg_name;
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                var temp = pkg.split("://");
                pkg = "com.youxi16." + temp[0];
            }
            var jsbHelper = cc.CustomClass();
            var isOpen = jsbHelper.openOther(pkg);
            if (!isOpen){
                ccui.helper.seekWidgetByName(this.ccsNode, "Text_buton").setString("下载");
            }
        }
    },
});