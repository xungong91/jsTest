/**
 * A brief explanation for "project.json":
 * Here is the content of project.json file, this is the global configuration for your game, you can modify it to customize some behavior.
 * The detail of each field is under it.
 {
    "project_type": "javascript",
    // "project_type" indicate the program language of your project, you can ignore this field

    "debugMode"     : 1,
    // "debugMode" possible values :
    //      0 - No message will be printed.
    //      1 - cc.error, cc.assert, cc.warn, cc.log will print in console.
    //      2 - cc.error, cc.assert, cc.warn will print in console.
    //      3 - cc.error, cc.assert will print in console.
    //      4 - cc.error, cc.assert, cc.warn, cc.log will print on canvas, available only on web.
    //      5 - cc.error, cc.assert, cc.warn will print on canvas, available only on web.
    //      6 - cc.error, cc.assert will print on canvas, available only on web.

    "showFPS"       : true,
    // Left bottom corner fps information will show when "showFPS" equals true, otherwise it will be hide.

    "frameRate"     : 60,
    // "frameRate" set the wanted frame rate for your game, but the real fps depends on your game implementation and the running environment.

    "id"            : "gameCanvas",
    // "gameCanvas" sets the id of your canvas element on the web page, it's useful only on web.

    "renderMode"    : 0,
    // "renderMode" sets the renderer type, only useful on web :
    //      0 - Automatically chosen by engine
    //      1 - Forced to use canvas renderer
    //      2 - Forced to use WebGL renderer, but this will be ignored on mobile browsers

    "engineDir"     : "frameworks/cocos2d-html5/",
    // In debug mode, if you use the whole engine to develop your game, you should specify its relative path with "engineDir",
    // but if you are using a single engine file, you can ignore it.

    "modules"       : ["cocos2d"],
    // "modules" defines which modules you will need in your game, it's useful only on web,
    // using this can greatly reduce your game's resource size, and the cocos console tool can package your game with only the modules you set.
    // For details about modules definitions, you can refer to "../../frameworks/cocos2d-html5/modulesConfig.json".

    "jsList"        : [
    ]
    // "jsList" sets the list of js files in your game.
 }
 *
 */

//全局变量
var mo = mo || {};

//开始需要加载的资源
var loding_resources =
    [
        "res/cocostudio/ui/bg_main.png",
        "res/progress_bg.png",
        "res/progress_up1.png",
        "res/load_image.png",
        "res/moveto_msg.png"
    ];

//适配
var reWinSize = function (){
    mo.curSize = {};

    if (cc.winSize.height / cc.winSize.width > 1.5)
    {
        mo.curSize.x = 640;
        mo.curSize.y = cc.winSize.height / cc.winSize.width * 640;
    }
    else
    {
        mo.curSize.x = cc.winSize.width/ cc.winSize.height * 960;
        mo.curSize.y = 960;
    }
    cc.view.setDesignResolutionSize(mo.curSize.x, mo.curSize.y, cc.ResolutionPolicy.SHOW_ALL);

};

cc.game.onStart = function(){
    if(!cc.sys.isNative && document.getElementById("cocosLoading")) //If referenced loading.js, please remove it
        document.body.removeChild(document.getElementById("cocosLoading"));

    // Pass true to enable retina display, disabled by default to improve performance
    cc.view.enableRetina(false);
    // Adjust viewport meta
    cc.view.adjustViewPort(true);
    // Setup the resolution policy and design resolution size

    console.log(cc.winSize.width);
    console.log(cc.winSize.height);

    //auto
    reWinSize();
    //cc.view.setDesignResolutionSize(640, 960, cc.ResolutionPolicy.SHOW_ALL);

    // The game will be resized when browser size change
    cc.view.resizeWithBrowserSize(true);
    cc.view.setResizeCallback(function() {
        reWinSize();
    });
    //load resources
    cc.LoaderScene.preload(loding_resources, function () {
        //cc.director.runScene(new HelloWorldScene());
        new AssetsManagerLoaderScene().run();
    }, this);
    //new AssetsManagerLoaderScene().run();
};
cc.game.run();