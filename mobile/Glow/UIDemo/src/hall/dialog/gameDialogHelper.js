/**
 * Created by gongxun on 16/5/7.
 */

var GameDialogHelper = function(){
    var that = {};

    var showDialog = function(layer){
        cc.director.getRunningScene().addChild(layer, 5);
    };

    var showWaitLayer = function(){

    };

    return that;
};

mo.gameDialogHelper = new GameDialogHelper();