/**
 * Created by gongxun on 16/4/14.
 */

// 水果精灵的扩展属性：普通、炸弹、冰冻、石头
var PatternExtraAttr = {
    "Normal":0,
    "Bomb":1,
    "Freeze":2,
    "Stone":3
};

//水果的状态：普通、移动、销毁、爆炸
var PatternStatus = {
    "Normal":0,
    "Move":1,
    "Destroy":2,
    "Explode":3
};

//水果消除状态
var PatternClearStatus = {
    "Normal" : 0,
    "Destroy" : 1,
    "UnFreeze" : 2,
    "Explode" : 3
};

var GamePatternSprite = cc.Sprite.extend({
    mPatternType : -1,                              //水果类型，现在有7个 0开始
    mExtraAttr : PatternExtraAttr.Normal,
    mExtraAttrSprite : null,
    mExtraStatus : PatternStatus.Normal,
    mIndexRow : null,
    mIndexCol : null,
    mRemoveIndex : null,
    ctor:function (type, extraAttr) {
        this._super();
        this.setAnchorPoint(0.5, 0.5);

        this.mPatternType = type;
        this.mExtraAttr = extraAttr;
        if (extraAttr == PatternExtraAttr.Stone){
            this.mPatternType = -1;
        }

        if (this.mPatternType >= 0 && this.mPatternType <= 6){
            this.initWithSpriteFrameName("cocos" + ("00" + this.mPatternType).slice(-2) + ".png");
        }

        switch (this.mExtraAttr){
            case PatternExtraAttr.Bomb :{
                this.mExtraAttrSprite = new cc.Sprite("#pattern_mark_explode.png");
                break;
            }
            case PatternExtraAttr.Freeze :{
                this.mExtraAttrSprite = new cc.Sprite("#pattern_mark_freeze.png");
                break;
            }
            case PatternExtraAttr.Stone :{
                //this.mExtraAttrSprite = new cc.Sprite("#pattern_mark_petrifaction.png");
                this.initWithSpriteFrameName("pattern_mark_petrifaction.png");
                break;
            }
        }

        if (this.mExtraAttrSprite){
            this.mExtraAttrSprite.setPosition(this.getContentSize().width / 2, this.getContentSize().height / 2);
            this.addChild(this.mExtraAttrSprite);
        }
    },
    onEnter:function () {
        this._super();
    },
    showTestLog : function(){
        cc.log("test GamePatternSprite");
    },

    //移动
    moveTo : function(delaytime, pos){
        if (this.mExtraStatus == PatternStatus.Normal){
            this.mExtraStatus = PatternStatus.Move;

            this.runAction(cc.sequence(cc.moveTo(delaytime, pos), cc.callFunc(function(){
                this.mExtraStatus = PatternStatus.Normal;
            }.bind(this))))
        }
    },

    //交换
    swapTo : function(delaytime, pos){
        if (this.mExtraStatus == PatternStatus.Normal){
            this.mExtraStatus = PatternStatus.Move;

            this.runAction(cc.sequence(cc.moveTo(delaytime, pos)));
        }
    },

    //返回触摸是否有效
    getTouchBegen : function(){
        var result = false;
        if (this.getIsSwap()){
            result = true;
        }
        return result;
    },

    //返回是否能够交换 只有Normal和Bomb类型才能交换
    getIsSwap : function(){
        var isSwap = false;
        if (this.mExtraAttr == PatternExtraAttr.Normal || this.mExtraAttr == PatternExtraAttr.Bomb){
            isSwap = true;
        } else if (this.mExtraStatus != PatternStatus.Normal){
            isSwap = false;
        }
        return isSwap;
    },

    //销毁
    destroyPattern : function(){
        this.mExtraStatus = PatternStatus.Destroy;

        var effect = new cc.Sprite("#pattern_destroy_00.png");
        effect.setPosition(this.getContentSize().width / 2, this.getContentSize().height / 2);
        this.addChild(effect);

        var animation = new cc.Animation();
        for (var i = 0; i < 18; i++)
        {
            var frameName = cc.spriteFrameCache.getSpriteFrame("pattern_destroy_" + ("00"+i).slice(-2) + ".png");
            animation.addSpriteFrame(frameName);
        }
        animation.setDelayPerUnit(0.025);

        effect.runAction(cc.sequence(cc.animate(animation)));

        this.runAction(cc.sequence(cc.fadeOut(0.5)));

        cc.audioEngine.playEffect("FruitAttack/audio/effect_clearPattern.ogg");
    },

    //爆炸
    explodePattern : function(){
        this.mExtraStatus = PatternStatus.Explode;

        var effect = new cc.Sprite("#pattern_explode_00.png");
        effect.setPosition(this.getContentSize().width / 2, this.getContentSize().height / 2);
        this.addChild(effect);

        var animation = new cc.Animation();
        for (var i=0; i < 17; i++)
        {
            var frameName = cc.spriteFrameCache.getSpriteFrame("pattern_explode_"+("00"+i).slice(-2)+".png");
            animation.addSpriteFrame(frameName);
        }
        animation.setDelayPerUnit(0.025);

        effect.runAction(cc.sequence(cc.animate(animation)));

        this.runAction(cc.sequence(cc.fadeOut(0.5)));

        cc.audioEngine.playEffect("FruitAttack/audio/effect_bombPattern.ogg");
    },

    //解冻
    unFreeze : function(){
        if (this.mExtraAttr == PatternExtraAttr.Freeze){
            // 设置为普通属性，允许主动交换，去掉扩展属性精灵
            this.mExtraAttr = PatternExtraAttr.Normal;
            this.removeChild(this.mExtraAttrSprite, true);
            this.mExtraAttrSprite = null;
        }
    }
});