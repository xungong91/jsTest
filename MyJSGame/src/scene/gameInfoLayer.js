/**
 * Created by gongxun on 15/8/6.
 */

var gameInfoLayer = BaseTestLayer.extend({
    ctor: function () {
        this._super();
        mo.runLayerName =
        {
            name : "gameInfoLayer",
            ptr : this
        };

        var file = "res/cocostudio/ccs_gameInfo.json";
        cc.log("ccs.load : %s", file);
        var json = ccs.load(file);
        this.ccsNode = json.node;
        this.addChild(this.ccsNode);
        this.resetSize(this.ccsNode);

        //back button
        var Button_back = ccui.helper.seekWidgetByName(this.ccsNode, "Button_back");
        Button_back.addTouchEventListener(this.touchBackEvent,this);
    },
    onEnter: function () {
        this._super();
    },
    onExit: function() {
        this._super();
    },
    touchBackEvent: function (sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED){
            this.getParent().removeChild(this);
        }
    },
    setGameInfo : function (json){
        //info
        var info = "版本: " + json.version + "\n" + "更新日期: " + json.update_time + "\n" + "大小: " + json.package_size + "M";
        ccui.helper.seekWidgetByName(this.ccsNode, "Text_info").setString(info);

        //gmaename
        ccui.helper.seekWidgetByName(this.ccsNode, "Text_name").setString(json.name);

        //icon
        var jsbHelper = cc.CustomClass();
        jsbHelper.loadHttpImage(ccui.helper.seekWidgetByName(this.ccsNode, "Image_icon"), json.icon, cc.size(120, 120));

        //截图
        var PageView_page = ccui.helper.seekWidgetByName(this.ccsNode, "PageView_page");
        PageView_page.removeAllPages();
        for (var i = 0; i < json.preview.length; i++) {
            var size = cc.size(546, 260);

            var layout = new ccui.Layout();

            var image = ccui.ImageView();
            image.setContentSize(size);
            image.setPosition(cc.p(273, 130));
            layout.addChild(image);

            jsbHelper.loadHttpImage(image, json.preview[i], size);

            PageView_page.addPage(layout);
        }

        //miaoshu
        jsbHelper.loadHttpImage(ccui.helper.seekWidgetByName(this.ccsNode, "Image_miaoshu"), json.desp_image, cc.size(520, 280));
    }
});