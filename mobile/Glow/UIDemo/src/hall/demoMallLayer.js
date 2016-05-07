/**
 * Created by gongxun on 16/5/7.
 */

var DemoMallLayer = HallBaseLayer.extend({
    ctor: function () {
        this._super();

        var file = "UIDemo/res/ccs/ExchangeLayer.json";
        var json = ccs.load(file);
        this.ccsNode = json.node;
        this.addChild(this.ccsNode);
        this.resetSize(this.ccsNode);

        ccui.helper.seekWidgetByName(this.ccsNode, "Button_return").addTouchEventListener(this.touchEventReturn, this);

    },
    onEnter : function(){
        this._super();

        this.showLayer();

        var ListView = ccui.helper.seekWidgetByName(this.ccsNode, "ListView");
        ListView.removeAllItems();
        var exchangeItems = mo.defines.getExchangeItems();
        for(var i = 0; i < exchangeItems.length; i++){
            var item = new DemoMallItem(exchangeItems[i]);
            ListView.pushBackCustomItem(item);
        }
    },
    touchEventReturn : function (sender, type){
        if (type == ccui.Widget.TOUCH_ENDED){
            mo.gameAudio.playReturn();
            sender.setTouchEnabled(false);
            this.hideLayer(function(){
                this.removeFromParent(true);
            }, this);
        }
    },

    //进场出场
    showLayer : function(){
        var Panel_top = ccui.helper.seekWidgetByName(this.ccsNode, "Panel_top");
        Panel_top.stopAllActions();
        Panel_top.setPositionY(mo.curSize.height + 100);
        Panel_top.runAction(cc.sequence(cc.moveTo(0.5, cc.p(Panel_top.getPosition().x, mo.curSize.height))));

        var Panel_center = ccui.helper.seekWidgetByName(this.ccsNode, "Panel_center");
        Panel_center.stopAllActions();
        Panel_center.setPositionY(-mo.curSize.height / 2);
        Panel_center.runAction(cc.sequence(cc.moveTo(0.5, cc.p(mo.curSize.width / 2, mo.curSize.height / 2))));

    },
    hideLayer : function(func, obj){
        var Panel_top = ccui.helper.seekWidgetByName(this.ccsNode, "Panel_top");
        Panel_top.stopAllActions();
        Panel_top.runAction(cc.sequence(
            cc.moveTo(0.5, cc.p(Panel_top.getPosition().x, mo.curSize.height + 100)),
            cc.callFunc(function(){
                func.call(obj);
            }, this)));

        var Panel_center = ccui.helper.seekWidgetByName(this.ccsNode, "Panel_center");
        Panel_center.stopAllActions();
        Panel_center.runAction(cc.sequence(cc.moveTo(0.5, cc.p(mo.curSize.width / 2, -mo.curSize.height / 2))));

        this.getParent().showLayer(0.5);
    }
});