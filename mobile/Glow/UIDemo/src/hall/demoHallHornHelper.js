/**
 * Created by gongxun on 16/5/6.
 */

var DemoHallHornHelper = function(){
    var that = {};

    that.Image_horn = null;

    that.Text_horn = null;

    that.sizeZhezhao = null;

    that.horns = null;

    that.isHornShowStatus = null;

    that.init = function(imageHorn){
        that.Image_horn = imageHorn;
        that.horns = new Array();
        that.isHornShowStatus = false;

        //文本广播
        that.sizeZhezhao = mo.gameHelper.getCCSWidget(imageHorn, "Panel_zhezhao").getContentSize();
        that.Text_horn = mo.gameHelper.getCCSWidget(imageHorn, "Text_horn");
        that.Text_horn.setPosition(that.sizeZhezhao.width, that.sizeZhezhao.height / 2);

        //打开面板
        that.Image_horn.addTouchEventListener(that.touchEventOpen, that);
    };

    //播放喇叭
    that.playHorn = function(horns){
        that.horns = horns.concat(that.horns);
        that.startHorn();
    };

    that.startHorn = function(){
        if (that.isHornShowStatus){
            return;
        }
        that.showNextHost();

        that.isHornShowStatus = true;
        //喇叭动画
        var Sprite_horn = mo.gameHelper.getCCSWidget(that.Image_horn, "Sprite_horn");
        var animation = new cc.Animation();
        for (var i = 1; i <= 3; i++){
            animation.addSpriteFrameWithFile("UIDemo/res/ccs/horn/trumpet" + i + ".png");
        }
        animation.setDelayPerUnit(0.3);
        var action = cc.animate(animation);
        Sprite_horn.runAction(cc.repeatForever(action));
    };

    that.showNextHost = function(){
        var back = that.horns.pop();
        if (back){
            var speed = 150;
            mo.gameHelper.setTextString(that.Text_horn, back);
            var time = (that.Text_horn.getContentSize().width + that.sizeZhezhao.width) / speed;
            var toPos = cc.p(-that.Text_horn.getContentSize().width, that.sizeZhezhao.height / 2);

            that.Text_horn.setPosition(that.sizeZhezhao.width, that.sizeZhezhao.height / 2);
            that.Text_horn.runAction(cc.sequence(
                cc.moveTo(time, toPos),
                cc.callFunc(function(){
                    that.showNextHost();
                }, that)
            ));
        }else{
            that.stopHorn();
        }
    };

    that.stopHorn = function(){
        that.isHornShowStatus = false;
        mo.gameHelper.getCCSWidget(that.Image_horn, "Sprite_horn").stopAllActions();
        mo.gameHelper.getCCSWidget(that.Image_horn, "Sprite_horn").setTexture("UIDemo/res/ccs/horn/trumpet1.png");
    };

    //打开喇叭面变
    that.touchEventOpen = function(sender, type){
        if (type == ccui.Widget.TOUCH_ENDED){
            //测试播放
            var horns = [
                "系统的消息今晚有暴雨，记得回家收衣服",
                "系统消息：如果您对我们游戏有任何意见和建议欢迎反馈给我们的客服，还有可能得到神秘礼物",
                "系统消息2：如果您对我们游戏有任何意见和建议欢迎反馈给我们的客服，还有可能得到神秘礼物",
                "系统消息3：如果您对我们游戏有任何意见和建议欢迎反馈给我们的客服，还有可能得到神秘礼物",
                "系统消息4：如果您对我们游戏有任何意见和建议欢迎反馈给我们的客服，还有可能得到神秘礼物"
            ];
            that.playHorn(horns);
        }
    };

    return that;
};