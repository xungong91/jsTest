/**
 * Created by gongxun on 16/5/5.
 */

var GameHelper = function(){
    var that = {};

    that.getCCSWidget = function(node, name){
        return ccui.helper.seekWidgetByName(node, name);
    };

    that.loadTexture = function(image, file){
        image.loadTexture(file);
        var size = image.getVirtualRendererSize();
        cc.log("size width:" + size.width + "height:" + size.height);
        image.setContentSize(size);
        return size;
    };

    that.setTextString = function(text, str){
        text.setString(str);
        text.setContentSize(text.getAutoRenderSize());
    };

    that.getIsTouchEnd = function(type){
        if (type == ccui.Widget.TOUCH_BEGAN){
            mo.gameAudio.playClick();
        }
        return type == ccui.Widget.TOUCH_ENDED;
    };

    return that;
};

mo.gameHelper = new GameHelper();