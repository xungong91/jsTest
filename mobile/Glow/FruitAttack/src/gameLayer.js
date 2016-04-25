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

var gMaxrixCount = 3;               //消除水果连续数量 大于等于该值才能消除

var gPatternsFallTime = 0.4;		// 水果下落的时间
var gPatternsAddHeight = 400;       // 水果生成时候 增加高度
var gPatternsSwapTime = 0.17;       // 水果交换时间
var gPatternsClearTime = 0.5;       // 清除时间
var gPatternsCheckTime = 0.6;

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
    mTouchBegenPos : null,          //第一次点击位置

    mPatternTypeMax : null,         //水果类型总数 现在是7
    mMatrixRow : null,              //行
    mMatrixCol : null,              //列
    mProbabilityFreeze : null,      //冰冻几率
    mProbabilityBomb : null,        //炸弹几率
    mProbabilityStone : null,       //石头几率

    mDestroyBatchTally : 0,         //销毁编号

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

        cc.audioEngine.setEffectsVolume(0);
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
        this.stopAllActions();
        this.mPatternBatchNode.removeAllChildren();
        for (var row = 0; row < this.mMatrixRow; row++)
        {
            for (var col = 0; col < this.mMatrixCol; col++)
            {
                this.addOnePattern(row, col);
            }
        }

        //检测是否需要消除
        //this.runAction(cc.sequence(cc.delayTime(gPatternsCheckTime), cc.callFunc(this.detectionMatrix.bind(this), this)));
        this.scheduleOnce(this.detectionMatrix.bind(this), gPatternsCheckTime, "detectionMatrix");
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
                this.mTouchBegenPos = touch.getLocation();
                var sprite = this.findTouchPatternSprite(this.mTouchBegenPos);
                var isTouch = sprite && sprite.getTouchBegen();
                if (isTouch){
                    this.onCheckPattern(sprite);
                }
                return isTouch;
            }.bind(this),
            onTouchMoved: function (touch, event) {
                if (this.mTouchBegenPos != null && this.mFirstCheckPattern){
                    var localtion = touch.getLocation();
                    var offsetSize = cc.size(this.mPatternBgItemSize.width / 2, this.mPatternBgItemSize.height / 2);
                    var offsetX = localtion.x - this.mTouchBegenPos.x;
                    var offsetY = localtion.y - this.mTouchBegenPos.y;
                    if (Math.abs(offsetX) > offsetSize.width || Math.abs(offsetY) > offsetSize.height){
                        var x = -1, y = -1;
                        if (Math.abs(offsetX) > Math.abs(offsetY)){
                            x = offsetX > 0 ? 1 : -1;
                            y = 0;
                            cc.log("xxxx offset x:" + offsetX + "y:" + offsetY);
                        }else{
                            x = 0;
                            y = offsetY > 0 ? 1 : -1;
                            cc.log("yyyy offset x:" + offsetX + "y:" + offsetY);
                        }
                        var row = this.mFirstCheckPattern.mIndexRow + y;
                        var col = this.mFirstCheckPattern.mIndexCol + x;
                        if (row >= 0 && row < this.mMatrixRow && col >=0 && col < this.mMatrixCol){
                            var secondPattern = this.mPatternSprites[row][col];
                            if ( secondPattern.getIsSwap()){
                                this.swapTwoPattern(this.mFirstCheckPattern, secondPattern, false);
                                this.mFirstCheckPattern = null;
                                this.mSecondCheckPattern = null;
                                this.mCheckMarkSpr.setPosition(-1000, -1000);
                            }else{
                                this.mFirstCheckPattern = null;
                                this.mCheckMarkSpr.setPosition(-1000, -1000);
                            }
                        }
                    }
                }
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
                this.mCheckMarkSpr.setPosition(this.mPatternsPos[this.mFirstCheckPattern.mIndexRow][this.mFirstCheckPattern.mIndexCol]);
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
                    this.mSecondCheckPattern = null;
                    this.mFirstCheckPattern = pattern;
                    this.mCheckMarkSpr.setPosition(this.mPatternsPos[this.mFirstCheckPattern.mIndexRow][this.mFirstCheckPattern.mIndexCol]);
                }
            }
        }
    },

    //交换水果的位置
    swapTwoPattern : function(firstPattern, secondPattern, isRecover){
        //位置数据
        var firstRow = firstPattern.mIndexRow;
        var firstCol = firstPattern.mIndexCol;
        var secondRow = secondPattern.mIndexRow;
        var secondCol = secondPattern.mIndexCol;

        //开始交换
        firstPattern.swapTo(gPatternsSwapTime, this.mPatternsPos[secondRow][secondCol]);
        secondPattern.swapTo(gPatternsSwapTime, this.mPatternsPos[firstRow][firstCol]);

        firstPattern.mIndexRow = secondRow;
        firstPattern.mIndexCol = secondCol;
        secondPattern.mIndexRow = firstRow;
        secondPattern.mIndexCol = firstCol;
        this.mPatternSprites[firstRow][firstCol] = secondPattern;
        this.mPatternSprites[secondRow][secondCol] = firstPattern;

        var patterns = {
            "pattern1" : secondPattern,
            "pattern2" : firstPattern,
            "isRecover" : isRecover
        };
        this.runAction(cc.sequence(cc.delayTime(gPatternsSwapTime), cc.callFunc(this.onSwapFinish, this, patterns)));
    },

    //交换完水果回调
    onSwapFinish : function(that, patterns){
        var firstPattern = patterns["pattern1"];
        var secondPattern = patterns["pattern2"];
        var isRecover = patterns["isRecover"];

        firstPattern.mExtraStatus = PatternStatus.Normal;
        secondPattern.mExtraStatus = PatternStatus.Normal;

        if (isRecover){

        } else {
            var	matrixMark = mo.gameHelper.createIntArray(this.mMatrixRow, this.mMatrixCol, PatternClearStatus.Normal);

            var result1 = this.getResultByPoint(firstPattern.mIndexRow, firstPattern.mIndexCol, matrixMark);
            var result2 = this.getResultByPoint(secondPattern.mIndexRow, secondPattern.mIndexCol, matrixMark)
            if (result1 || result2){
                this.clearSomePatterns(matrixMark);
            } else {
                this.swapTwoPattern(firstPattern, secondPattern, true);
                cc.audioEngine.playEffect("FruitAttack/audio/effect_unswap.ogg");
            }
        }
    },

    //获取可以被消除的水果矩阵
    getResultByPoint : function(row, col, matriMark){
        if (this.mPatternSprites[row][col] === null){
            return false;
        }

        //状态不为普通 或者没有type不能消除
        if (this.mPatternSprites[row][col].mPatternType === -1 || this.mPatternSprites[row][col].mExtraStatus != PatternStatus.Normal){
            return false;
        }

        var result = false;
        var clearPatterns = new Array();
        var tempPatterns = new Array();
        var type = this.mPatternSprites[row][col].mPatternType;
        var i = 0;

        //纵向找
        i = row;
        while (i >= 0){
            var sprite = this.mPatternSprites[i][col];
            if (sprite && (sprite.mExtraStatus === PatternStatus.Normal) && (sprite.mPatternType == type)){
                tempPatterns.push(sprite);
            } else {
                break;
            }
            i--;
        }
        i = row + 1;
        while (i < this.mMatrixRow){
            var sprite = this.mPatternSprites[i][col];
            if (sprite && sprite.mExtraStatus === PatternStatus.Normal && sprite.mPatternType == type){
                tempPatterns.push(sprite);
            } else {
                break;
            }
            i++;
        }
        if (tempPatterns.length >= gMaxrixCount){
            //找到啦
            clearPatterns = clearPatterns.concat(tempPatterns);
            result = true;
        }

        //横向找
        tempPatterns = new Array();
        i = col;
        while (i >= 0){
            var sprite = this.mPatternSprites[row][i];
            if (sprite && sprite.mExtraStatus === PatternStatus.Normal && sprite.mPatternType == type){
                tempPatterns.push(sprite);
            } else {
                break;
            }
            i--;
        }
        i = col + 1;
        while (i < this.mMatrixRow){
            var sprite = this.mPatternSprites[row][i];
            if (sprite && sprite.mExtraStatus === PatternStatus.Normal && sprite.mPatternType == type){
                tempPatterns.push(sprite);
            } else {
                break;
            }
            i++;
        }
        if (tempPatterns.length >= gMaxrixCount){
            //找到啦
            clearPatterns = clearPatterns.concat(tempPatterns);
            result = true;
        }

        for(var i = 0; i < clearPatterns.length; i++){
            var sprite = clearPatterns[i];
            if (sprite.mExtraAttr === PatternExtraAttr.Bomb){
                for (var x = sprite.mIndexRow - 1; x <= sprite.mIndexRow + 1; x++){
                    for (var y = sprite.mIndexCol - 1; y <= sprite.mIndexCol + 1; y++){
                        if (x >=0 && x < this.mMatrixRow && y >= 0 && y < this.mMatrixCol){
                            matriMark[x][y] = PatternClearStatus.Explode;
                        }
                    }
                }
            } else if (sprite.mExtraAttr === PatternExtraAttr.Freeze){
                if (matriMark[sprite.mIndexRow][sprite.mIndexCol] != PatternClearStatus.Explode){
                    matriMark[sprite.mIndexRow][sprite.mIndexCol] = PatternClearStatus.UnFreeze;
                }
            } else {
                if (matriMark[sprite.mIndexRow][sprite.mIndexCol] === 0){
                    matriMark[sprite.mIndexRow][sprite.mIndexCol] = PatternClearStatus.Destroy;
                }
            }
        }
        return result;
    },

    // 消除掉相同的水果
    clearSomePatterns:function(matrixMark){
        var tally = 0;
        this.mDestroyBatchTally++;

        for (var row = 0; row < this.mMatrixRow; row++) {
            for (var col = 0; col < this.mMatrixCol; col++) {
                var sprite = this.mPatternSprites[row][col];
                if (!sprite){
                    continue;
                }
                if (matrixMark[row][col] == PatternClearStatus.Destroy){
                    sprite.destroyPattern();
                    sprite.mRemoveIndex = this.mDestroyBatchTally;
                    tally++;
                } else if (matrixMark[row][col] == PatternClearStatus.Explode){
                    sprite.explodePattern();
                    sprite.mRemoveIndex = this.mDestroyBatchTally;
                    tally++;
                } else if (matrixMark[row][col] == PatternClearStatus.UnFreeze){
                    sprite.unFreeze();
                }
            }
        }

        this.runAction(
            cc.sequence(
                cc.delayTime(gPatternsClearTime),
                cc.callFunc(this.onClearFinish.bind(this), this, this.mDestroyBatchTally)));

        return tally;
    },

    //消除指定index的精灵
    onClearFinish : function(that, removeIndex){

        //移除
        for (var row = 0; row < this.mMatrixRow; row++) {
            for (var col = 0; col < this.mMatrixCol; col++) {
                var sprite = this.mPatternSprites[row][col];
                if (sprite && sprite.mRemoveIndex === removeIndex) {
                    sprite.removeFromParent();
                    this.mPatternSprites[row][col] = null;
                }
            }
        }

        //如果石头下面都是空的化 移除石头
        var removeStone = new Array();
        for (var col = 0; col < this.mMatrixCol; col++) {
            for (var row = 0; row < this.mMatrixRow; row ++){
                if (this.mPatternSprites[row][col]){
                    if (this.mPatternSprites[row][col].mExtraAttr == PatternExtraAttr.Stone){
                        removeStone.push(this.mPatternSprites[row][col])
                    }else{
                        break;
                    }
                }
            }
        }
        for (var i = 0; i < removeStone.length; i++){
            removeStone[i].runAction(cc.sequence(
                cc.moveBy(gPatternsFallTime, cc.p(0, - gPatternsAddHeight)),
                cc.removeSelf(true)
            ));
            this.mPatternSprites[removeStone[i].mIndexRow][removeStone[i].mIndexCol] = null;
        }

        //移动精灵
        for (var col = 0; col < this.mMatrixCol; col++) {
            for (var row = 0; row < this.mMatrixRow; row++){
                if (this.mPatternSprites[row][col]){
                    var movoToRow = row;
                    var i = row - 1;
                    while (i >= 0){
                        if (!this.mPatternSprites[i][col]){
                            movoToRow = i;
                            i--;
                        }else {
                            break;
                        }
                    }
                    if (movoToRow != row){
                        var moveCount = row - movoToRow;
                        //var time = moveCount * this.mPatternBgItemSize.height / (gPatternsAddHeight / gPatternsFallTime);
                        var time = 0.1 + moveCount * 0.05;
                        if (this.mPatternSprites[row][col] == this.mFirstCheckPattern){
                            this.mCheckMarkSpr.setPosition(-1000, -1000);
                            this.mFirstCheckPattern = null;
                        }
                        this.mPatternSprites[row][col].runAction(cc.sequence(cc.moveTo(time, this.mPatternsPos[movoToRow][col])));
                        this.setSpriteLocation(this.mPatternSprites[row][col], movoToRow, col);
                        this.mPatternSprites[row][col] = null;
                    }
                }
            }
        }

        //添加精灵
        for(var row = 0; row < this.mMatrixRow; row++){
            for(var col = 0; col < this.mMatrixCol; col++){
                if (this.mPatternSprites[row][col] === null){
                    this.addOnePattern(row, col);
                }
            }
        }

        //检测是否需要清除
        this.scheduleOnce(this.detectionMatrix.bind(this), gPatternsCheckTime, "detectionMatrix");
        //this.runAction(cc.sequence(cc.delayTime(gPatternsCheckTime), cc.callFunc(this.detectionMatrix.bind(this), this)));
    },

    setSpriteLocation : function(sprite, row, col){
        this.mPatternSprites[row][col] = sprite;
        sprite.mIndexRow = row;
        sprite.mIndexCol = col;
    },

    //检测水果矩阵是否有需要消除的水果
    detectionMatrix : function(){
        var isClear = false;
        var matrixMark = mo.gameHelper.createIntArray(this.mMatrixRow, this.mMatrixCol, PatternClearStatus.Normal);
        for (var row = 0; row < this.mMatrixRow; row++){
            for (var col = 0; col < this.mMatrixCol; col++){
                isClear = this.getResultByPoint(row, col, matrixMark) || isClear;
            }
        }

        if (isClear){
            if (this.clearSomePatterns(matrixMark) == 0){
                //一行都没有消除
                this.runAction(cc.sequence(cc.delayTime(2), cc.callFunc(function(){
                    //TODO
                    //cc.log("reStart");
                    //this.onStart();
                }.bind(this))));
            }
        }
    }

});
