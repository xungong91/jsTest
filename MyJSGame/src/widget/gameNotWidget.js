/**
 * Created by gongxun on 15/8/5.
 */

var gameNotWidget = BaseWidget.extend({
    ctor: function () {
        this._super();

        this.setContentSize(cc.size(614, 181));

        var image = new ccui.ImageView();
        image.setAnchorPoint(cc.p(0, 0));
        image.loadTexture("res/cocostudio/bg/bg3.png");

        this.addChild(image);
    }
});