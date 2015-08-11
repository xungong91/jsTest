/**
 * Created by gongxun on 15/8/3.
 */

var layerHelper = function (){
    var that ={};

    that.intoLoginLayer = function (){
        mo.mainScene.removeAllChildren();
        mo.mainScene.addChild(new loginLayer());
    };

    that.intoRegLayer = function (){
        mo.mainScene.removeAllChildren();
        mo.mainScene.addChild(new regLayer());
    };

    that.intoMainLayer = function (){
        mo.mainScene.removeAllChildren();
        mo.mainScene.addChild(new mainLayer());
    };

    return that;
};

mo.layerHelper = new layerHelper();