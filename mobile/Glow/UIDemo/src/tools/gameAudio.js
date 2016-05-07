/**
 * Created by gongxun on 16/5/7.
 */

var GameAudio = function(){
    var that = {};

    that.playClick = function(){
        that.playEffect("UIDemo/res/audio/effect/Audio_Button_Click.ogg");
    };

    that.playReturn = function(){
        that.playEffect("UIDemo/res/audio/effect/audio_button_return.ogg");
    };

    that.playEffect = function(file){
        cc.audioEngine.playEffect(file);
    };

    return that;
};

mo.gameAudio = new GameAudio();