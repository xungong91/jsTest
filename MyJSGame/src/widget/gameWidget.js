/**
 * Created by gongxun on 15/8/5.
 */

var gameWidget = BaseWidget.extend({
    ctor: function () {
        this._super();

        this.setContentSize(cc.size(613, 146));

        var file = "res/cocostudio/ccs_widget_game.json";
        cc.log("ccs.load : %s", file);
        var json = ccs.load(file);
        this.ccsNode = json.node;

        this.addChild(this.ccsNode);
    },
    setGameInfo : function (json){

        //info
        var info = "当前在线:8888\n\n" + "版本号:\n" + json.version;
        ccui.helper.seekWidgetByName(this.ccsNode, "Text_info").setString(info);

        //gmaename
        ccui.helper.seekWidgetByName(this.ccsNode, "Text_name").setString(json.name);
    }
});