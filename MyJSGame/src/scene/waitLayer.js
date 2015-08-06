/**
 * Created by gongxun on 15/8/4.
 */

var waitLayerHelper = function(){

    var that = {};

    that.open = function (){
        if (mo.waitLayer == null){
            mo.waitLayer = new waitLayer();
            mo.mainScene.addChild(mo.waitLayer);
        }
    };

    that.close = function(){
        if (mo.waitLayer != null){
            mo.mainScene.removeChild(mo.waitLayer);
        }
    };

    return that;
};

var waitLayer = BaseTestLayer.extend({

    ctor: function () {
        this._super(cc.color(0, 0, 0, 100), cc.color(0, 0, 0, 100));

        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                return true;
            },
            onTouchMoved: function (touch, event) {
            },
            onTouchEnded: function (touch, event) {
            }
        });

        cc.eventManager.addListener(listener, this);

        var waitSprite = new cc.Sprite("res/load_image.png");
        waitSprite.x = mo.curSize.x / 2;
        waitSprite.y = mo.curSize.y / 2;
        this.addChild(waitSprite);

        var repeat = cc.rotateTo(1.5, 720).repeatForever();
        waitSprite.runAction(repeat);

        this.schedule(this.onceCallBack, 5, 1);
    },
    onceCallBack: function(){
        mo.mainScene.removeChild(this);
    },
    onEnter: function () {
        this._super();
    },
    onExit: function() {
        mo.waitLayer = null;
        this._super();
    }
});

mo.waitLayer = null;
mo.waitLayerHelper = new waitLayerHelper();
