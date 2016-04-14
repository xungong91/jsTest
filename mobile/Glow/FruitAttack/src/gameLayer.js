/**
 * Created by gongxun on 16/4/14.
 */


var GameScene = cc.Scene.extend({
    ctor:function () {
        this._super();
    },
    onEnter:function () {
        this._super();

        var layer = new GameLayer();
        this.addChild(layer);
    }
});

var gPatternsFallTime = 0.4;		// 水果下落的时间
var gPatternsAddHeight = 400;       // 水果生成时候 增加高度

var GameLayer = cc.Layer.extend({
    testname : null,                //test
    mGameUILayer : null,            //ui层
    mPatternsPos : null,            //图块坐标二维数组
    mPatternBatchNode : null,       //图块的batchnode 批量生成精灵
    mPatternSprites : null,         //保存图块精灵
    mPatternBgItemSize : null,      //单个图块的大小 触摸检测需要
    mTouchListener : null,          //触摸监听
    mCheckMarkSpr : null,           //选中提示
    mFirstCheckPattern:null,        //第一次点中的
    mSecondCheckPattern:null,       //第二次点中的

    mPatternTypeMax : null,         //水果类型总数 现在是7
    mMatrixRow : null,              //行
    mMatrixCol : null,              //列
    mProbabilityFreeze : null,      //冰冻几率
    mProbabilityBomb : null,        //炸弹几率
    mProbabilityStone : null,       //石头几率

    ctor:function () {
        this._super();

        this.testname = "gameLayer";

        this.mPatternTypeMax = 7;
        this.mMatrixRow = 6;
        this.mMatrixCol = 6;
        this.mProbabilityFreeze = 3;
        this.mProbabilityBomb = 6;
        this.mProbabilityStone = 3;

        this.mPatternsPos = mo.gameHelper.createIntArray(this.mMatrixRow, this.mMatrixCol, null);
        this.mPatternSprites = mo.gameHelper.createIntArray(this.mMatrixRow, this.mMatrixCol, null);

    },
    onEnter:function () {
        this._super();

        this.loadBg();

        this.loadUI();

        this.loadTouchListener();
    },
    loadBg : function(){
        //大背景
        var bg = new cc.Sprite("FruitAttack/res/background.jpg");
        bg.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
        bg.setScale(cc.winSize.width / bg.getContentSize().width, cc.winSize.height / bg.getContentSize().height);
        this.addChild(bg);

        //图块背景
        this.blackBg = new cc.RenderTexture(cc.winSize.width, cc.winSize.height);
        this.blackBg.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
        this.addChild(this.blackBg);

        var blockItem = new cc.Sprite("FruitAttack/res/PatternBg.png");
        this.mPatternBgItemSize = blockItem.getContentSize();
        var space = (cc.winSize.width - this.mPatternBgItemSize.width) / this.mMatrixRow;
        var baseX = this.mPatternBgItemSize.width / 2 + this.mPatternBgItemSize.width / 2;
        var baseY = (cc.winSize.height - this.mMatrixRow * space) / 2 + this.mPatternBgItemSize.height / 2;

        this.blackBg.begin();
        for (var row = 0; row < this.mMatrixRow; row++)
        {
            for (var col = 0; col < this.mMatrixCol; col++)
            {
                // 计算当前水果精灵的坐标点位置
                this.mPatternsPos[row][col] = cc.p(baseX + col * space, baseY + row * space);
                var item = new cc.Sprite("FruitAttack/res/PatternBg.png");
                item.setAnchorPoint(0.5,0.5);
                item.setPosition(this.mPatternsPos[row][col]);
                //cc.log("row:" + row + " col:" + col + "poins x:" + this.mPatternsPos[row][col].x + " y:" + this.mPatternsPos[row][col].y);
                item.visit();		// 深度渲染这个节点
            }
        }
        this.blackBg.end();

        //图块的batchnode
        cc.spriteFrameCache.addSpriteFrames("FruitAttack/res/baseResource.plist", "FruitAttack/res/baseResource.png");
        this.mPatternBatchNode = cc.SpriteBatchNode.create("FruitAttack/res/baseResource.png", this.mMatrixCol * this.mMatrixRow * 2);
        this.addChild(this.mPatternBatchNode);

        //提示精灵
        this.mCheckMarkSpr = new cc.Sprite("#pattern_selected.png");
        this.mCheckMarkSpr.setPosition(-1000, -1000);
        this.addChild(this.mCheckMarkSpr);
        this.mCheckMarkSpr.runAction(cc.repeatForever( cc.sequence(cc.fadeIn(1.0), cc.fadeOut(1.0)) ));
    },
    loadUI : function(){
        this.mGameUILayer = new GameUILayer(this.onStart.bind(this));
        this.addChild(this.mGameUILayer, 1)
    },
    onStart : function(){
        this.mPatternBatchNode.removeAllChildren();
        for (var row = 0; row < this.mMatrixRow; row++)
        {
            for (var col = 0; col < this.mMatrixCol; col++)
            {
                this.addOnePattern(row, col);
            }
        }
    },
    addOnePattern : function(row, col){
        var temp = parseInt(Math.random() * 10000);
        var prob = temp % 100;

        var patternType = temp % this.mPatternTypeMax;

        var patternAttr = PatternExtraAttr.Normal;
        if (prob < this.mProbabilityFreeze){
            patternAttr = PatternExtraAttr.Freeze;
        } else if (prob < this.mProbabilityFreeze + this.mProbabilityBomb){
            patternAttr = PatternExtraAttr.Bomb;
        } else if (prob < this.mProbabilityFreeze + this.mProbabilityBomb + this.mProbabilityStone){
            patternAttr = PatternExtraAttr.Stone;
        }

        this.mPatternSprites[row][col] = new GamePatternSprite(patternType, patternAttr);
        this.mPatternSprites[row][col].setPosition(this.mPatternsPos[row][col].x, this.mPatternsPos[row][col].y + gPatternsAddHeight);
        this.mPatternSprites[row][col].mIndexRow = row;
        this.mPatternSprites[row][col].mIndexCol = col;
        this.mPatternBatchNode.addChild(this.mPatternSprites[row][col]);

        this.mPatternSprites[row][col].moveTo(gPatternsFallTime, this.mPatternsPos[row][col]);
    },
    loadTouchListener : function(){
        this.mTouchListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,	// 单次点击
            swallowTouches: true,

            // 分别调用自定义方法
            onTouchBegan: function (touch, event) {
                var sprite = this.findTouchPatternSprite(touch.getLocation());
                var isTouch = sprite && sprite.getTouchBegen();
                if (isTouch){
                    this.onCheckPattern(sprite);
                }
                return isTouch;
            }.bind(this),
            onTouchMoved: function (touch, event) {
                var target = event.getCurrentTarget();
            }.bind(this),
            onTouchEnded: function (touch, event) {
                //不处理
            }
        });

        // 添加到事件管理器中去
        cc.eventManager.addListener(this.mTouchListener, this);
    },

    //找到点击位置的pattern
    findTouchPatternSprite : function(location){
        var sprite = null;
        for (var row = 0; row < this.mMatrixRow; row++)
        {
            for (var col = 0; col < this.mMatrixCol; col++)
            {
                var p = this.mPatternsPos[row][col];
                var rect = cc.rect(p.x - this.mPatternBgItemSize.width / 2, p.y - this.mPatternBgItemSize.height / 2, this.mPatternBgItemSize.width, this.mPatternBgItemSize.height);
                if (cc.rectContainsPoint(rect, location)){
                    sprite = this.mPatternSprites[row][col];
                }
            }
        }
        return sprite;
    },

    //检查被点击水果的状态
    onCheckPattern : function(pattern){
        if (pattern){
            if (this.mFirstCheckPattern === null){
                this.mFirstCheckPattern = pattern;
                var p = this.mFirstCheckPattern.getPosition();
                this.mCheckMarkSpr.setPosition(p);
            }else {
                this.mSecondCheckPattern = pattern;
                if (this.mFirstCheckPattern === pattern){
                    this.mSecondCheckPattern = null;
                    return;
                }

                // 判断两个水果精灵是否是挨着的
                var isAdjacent = false;
                if (Math.abs(this.mFirstCheckPattern.mIndexRow - this.mSecondCheckPattern.mIndexRow) === 1 &&
                    this.mFirstCheckPattern.mIndexCol === this.mSecondCheckPattern.mIndexCol){
                    isAdjacent = true;
                } else if (Math.abs(this.mFirstCheckPattern.mIndexCol - this.mSecondCheckPattern.mIndexCol) === 1 &&
                    this.mFirstCheckPattern.mIndexRow === this.mSecondCheckPattern.mIndexRow){
                    isAdjacent = true;
                }

                if (isAdjacent){
                    // 是挨着的，交换这两个水果精灵
                    this.swapTwoPattern(this.mFirstCheckPattern, this.mSecondCheckPattern, false);

                    this.mCheckMarkSpr.setPosition(-1000, -1000);
                    this.mFirstCheckPattern = null;
                    this.mSecondCheckPattern = null;
                }else{
                    // 不挨着，使新点击的水果精灵呈被选中状态
                    this.mFirstCheckPattern = null;
                    this.mSecondCheckPattern = null;
                    this.onCheckPattern(pattern);
                }
            }
        }
    },

    //交换水果的位置
    swapTwoPattern : function(firstPattern, secondPattern, isRecover){

    }
});
