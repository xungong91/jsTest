/**
 * Created by gongxun on 16/5/5.
 */

var DemoMallItem = DemoWiddgetLayer.extend({
    Image_bg : null,
    mMallItem : null,
    ctor: function (mallItem) {
        this._super();
        this.loadCCS("UIDemo/res/ccs/MallItem.json");

        this.setContentSize(this.ccsNode.getContentSize());
        this.setTouchEnabled(true);

        this.addTouchEventListener(this.touchEventItem, this);

        this.Image_bg = mo.gameHelper.getCCSWidget(this.ccsNode, "Image_bg");
        mo.loadTexture(this.Image_bg, "res/ccs/mall/item_bg.png");

        this.mMallItem = mallItem;
        this.setMallInfo();
    },
    onEnter : function(){
        this._super();
    },
    touchEventItem : function(sender, type){
        if (type == ccui.Widget.TOUCH_ENDED){
            this.Image_bg.setColor(cc.color(255, 255, 255));
            this.setScale(1);
        }else if (type == ccui.Widget.TOUCH_BEGAN){
            this.Image_bg.setColor(cc.color(200, 200, 200));
            this.setScale(0.9);
        }else if (type == ccui.Widget.TOUCH_CANCELED){
            this.Image_bg.setColor(cc.color(255, 255, 255));
            this.setScale(1);
        }
    },
    setMallInfo : function(){
        mo.gameHelper.setTextString(mo.gameHelper.getCCSWidget(this.ccsNode, "Text_name"), this.mMallItem.name);
        mo.gameHelper.setTextString(mo.gameHelper.getCCSWidget(this.ccsNode, "Text_price"), this.mMallItem.price + "金币");
    }
});