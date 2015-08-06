/**
 * Created by gongxun on 15/7/16.
 */

var Player = function (opt){
    var that = BaseEntity();

    that.inheritOn('bbbb', function (config)
    {
        cc.log("player");


        //
        //var s1 = new cc.Sprite("res/character_002_magdalene.png", cc.rect(0, 0, 32, 30));
        //s1.setPosition(cc.p(100, 100));
        //that.displayNode.addChild(s1);
        //
        //var animFrames = [];
        //var frame;
        //for (var i = 0; i < 6; i++) {
        //  frame = cc.SpriteFrame.createWithTexture(s1.texture, cc.rect(i * 32, 0, 32, 30));
        //  animFrames.push(frame);
        //}
        //var animation = new cc.Animation(animFrames, 0.3);
        //s1.runAction(cc.animate(animation).repeatForever());

        return true;
    });

    function func1() {
        this.a = 100;

        this.add = function () {return this.a; };
    };

    function func2(){
        this.a = 300;
    };

    that.on('showMsg',function(msg){
        cc.log("SHOWMSG:" + msg);
    });

    var f1 = new func1();
    var f2 = new func2();

    console.log("输出哦结果" + f1.add.call(f2));

    return that;
};