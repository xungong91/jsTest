/**
 * Created by gongxun on 16/4/14.
 */

var SceneHlper = function(){
    var that = [];

    that.runSceneMain = function(){
        cc.loader.loadJs(["src/files.js"], function(err){
            cc.loader.loadJs(Files, function(err){
                GameLoadingLayer.preload(Resource, function () {
                    cc.director.runScene(new MainScene());
                }, this);
            });
        });
    };

    that.runSceneFruitAttack = function(){
        cc.loader.loadJs(["FruitAttack/src/files.js"], function(err){
            cc.loader.loadJs(Files, function(err){
                GameLoadingLayer.preload(Resource, function () {
                    cc.director.runScene(new GameScene());
                }, this);
            });
        });
    };

    that.runSceneUIDemo = function(){
        cc.loader.loadJs(["UIDemo/src/files.js"], function(err){
            cc.loader.loadJs(Files, function(err){
                GameLoadingLayer.preload(Resource, function () {
                    cc.director.runScene(new DemoScene());
                }, this);
            });
        });
    };

    return that;
};

mo.sceneHelper = new SceneHlper();