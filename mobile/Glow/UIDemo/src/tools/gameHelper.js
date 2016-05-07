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
        var size = cc.director.getTextureCache().getTextureForKey(file).getContentSize();
        image.setContentSize(size);
        return size;
    };

    that.setTextString = function(text, str){
        text.setString(str);
        text.setContentSize(text.getAutoRenderSize());
    };

    return that;
};

mo.gameHelper = new GameHelper();