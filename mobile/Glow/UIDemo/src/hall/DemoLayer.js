/**
 * Created by gongxun on 16/5/3.
 */

var DemoScene = cc.Scene.extend({
    ctor:function () {
        this._super();
    },
    onEnter:function () {
        this._super();

        var layer = new DemoLayer();
        this.addChild(layer);
    }
});

var DemoLayer = HallBaseLayer.extend({
    Image_bg : null,
    Image_bg2 : null,
    mDemoHallHeadHelper : null,
    mDemoHallHornHelper : null,
    ctor : function(){
        this._super();

        var file = "UIDemo/res/ccs/MainLayer.json";
        var json = ccs.load(file);
        this.ccsNode = json.node;
        this.addChild(this.ccsNode);
        this.resetSize(this.ccsNode);

        //兑换
        ccui.helper.seekWidgetByName(this.ccsNode, "Button_exchange").addTouchEventListener(this.touchEventExchange, this);
        //商城
        ccui.helper.seekWidgetByName(this.ccsNode, "Button_mall").addTouchEventListener(this.touchEventMall, this);

        this.Image_bg = ccui.helper.seekWidgetByName(this.ccsNode, "Image_bg");
        this.Image_bg2 = mo.gameHelper.getCCSWidget(this.ccsNode, "Image_bg2");
    },
    onEnter : function(){
        this._super();

        //this.showLayer();
        //加载头像控件
        this.mDemoHallHeadHelper = new DemoHallHeadHelper();
        this.mDemoHallHeadHelper.init(mo.gameHelper.getCCSWidget(this.ccsNode, "Panel_head"));

        //加载喇叭控件
        this.mDemoHallHornHelper = new DemoHallHornHelper();
        this.mDemoHallHornHelper.init(mo.gameHelper.getCCSWidget(this.ccsNode, "Image_horn"));
    },
    touchEventExchange : function (sender, type){
        if (mo.gameHelper.getIsTouchEnd(type)){
            this.hideLayer(function(){
                this.addChild(new DemoExchangeLayer());
            }, this);
        }
    },
    touchEventMall : function (sender, type){
        if (mo.gameHelper.getIsTouchEnd(type)){
            this.hideLayer(function(){
                this.addChild(new DemoMallLayer());
            }, this);
        }
    },

    //显示
    showLayer : function(delaytime){
        var delay = 0.5;

        //模糊
        this.Image_bg2.runAction(cc.sequence(cc.fadeOut(delay)));

        this.runAction(cc.sequence(cc.delayTime(delaytime), cc.callFunc(function(){
            //底部
            var Panel_btttom = ccui.helper.seekWidgetByName(this.ccsNode, "Panel_btttom");
            Panel_btttom.stopAllActions();
            Panel_btttom.setPositionY(-100);
            Panel_btttom.runAction(cc.sequence(cc.moveTo(delay, cc.p(Panel_btttom.getPosition().x, 0))));

            //顶部
            var Panel_top = mo.gameHelper.getCCSWidget(this.ccsNode, "Panel_top");
            Panel_top.stopAllActions();
            Panel_top.runAction(cc.sequence(cc.moveTo(delay, cc.p(0, mo.curSize.height))));

            //移动
            this.Image_bg.runAction(cc.sequence(cc.moveTo(delay, cc.p(0, 0))));
            this.Image_bg2.runAction(cc.sequence(cc.moveTo(delay, cc.p(0, 0))));
        }, this)));
    },

    //隐藏
    hideLayer : function(func, obj){
        var delay = 0.5;
        //底部
        var Panel_btttom = ccui.helper.seekWidgetByName(this.ccsNode, "Panel_btttom");
        Panel_btttom.stopAllActions();
        Panel_btttom.runAction(cc.sequence(
            cc.moveTo(delay, cc.p(Panel_btttom.getPosition().x, -100)),
            cc.callFunc(function(){
                //移动
                this.Image_bg.runAction(cc.sequence(cc.moveTo(delay, cc.p(mo.curSize.width - this.Image_bg.getContentSize().width, 0))));
                this.Image_bg2.runAction(cc.sequence(cc.moveTo(delay, cc.p(mo.curSize.width - this.Image_bg.getContentSize().width, 0))));
                func.call(obj);
            }, this)));

        //顶部
        var Panel_top = mo.gameHelper.getCCSWidget(this.ccsNode, "Panel_top");
        Panel_top.stopAllActions();
        Panel_top.runAction(cc.sequence(cc.moveTo(delay, cc.p(0, mo.curSize.height + 200))));

        //模糊
        this.Image_bg2.runAction(cc.sequence(cc.fadeIn(delay)));
    }
});
