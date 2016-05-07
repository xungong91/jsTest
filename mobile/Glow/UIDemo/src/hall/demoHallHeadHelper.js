/**
 * Created by gongxun on 16/5/6.
 */

var DemoHallHeadHelper = function(){
    var that = {};

    that.Panel_head = null;

    that.mHeadSprite = null;

    that.init = function(panelHead){
        that.Panel_head = panelHead;

        that.loadImageBg();
    };

    that.loadImageBg = function(){
        //var shape = new cc.DrawNode();
        //shape.drawDot(cc.p(0, 0), 10, cc.color.WHITE);
        //shape.drawCircle(cc.p(0, 0), 20, 0, 100, false, 30, cc.color.WHITE);
        var sprite = new cc.Sprite("UIDemo/res/ccs/userInfo/photoBgClipping.png");
        var clipper = new cc.ClippingNode(sprite);
        clipper.setInverted(false);
        clipper.setAlphaThreshold(0);

        var Image_headBg = mo.gameHelper.getCCSWidget(that.Panel_head, "Image_headBg");
        clipper.setPosition(Image_headBg.getContentSize().width / 2, Image_headBg.getContentSize().height / 2);
        Image_headBg.addChild(clipper);

        that.mHeadSprite = new cc.Sprite("UIDemo/res/ccs/userInfo/default_woman.png");
        that.mHeadSprite.setScale(0.3);
        clipper.addChild(that.mHeadSprite);
    };

    return that;
};