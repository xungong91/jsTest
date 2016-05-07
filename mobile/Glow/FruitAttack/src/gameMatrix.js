/**
 * Created by gongxun on 16/4/28.
 */

var GameMatrix = cc.Layer.extend({
    mPatternBatchNode : null,            //存放图块
    ctor : function(){
        this._super();

    },
    onEnter : function(){
        this._super();

        cc.spriteFrameCache.addSpriteFrames("FruitAttack/res/baseResource.plist", "FruitAttack/res/baseResource.png");
        this.mPatternBatchNode = cc.SpriteBatchNode.create("FruitAttack/res/baseResource.png", this.mMatrixCol * this.mMatrixRow * 2);
        this.addChild(this.mPatternBatchNode);
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
});