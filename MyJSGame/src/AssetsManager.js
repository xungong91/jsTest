/**
 * Created by gongxun on 15/8/2.
 */
var __failCount = 0;

var AssetsManagerLoaderScene = cc.Scene.extend({
    _am:null,
    _progress:null,
    _percent:0,
    _percentByFile:0,
    _percentTimer:null,

    run:function(){
        if (!cc.sys.isNative) {
            this.loadGame();
            return;
        }

        var layer = new cc.Layer();
        this.addChild(layer);

        var bigBg = new cc.Sprite("res/cocostudio/ui/bg_main.png");
        bigBg.x = mo.curSize.x / 2;
        bigBg.y = mo.curSize.y / 2;
        bigBg.scaleX = mo.curSize.x / bigBg.getContentSize().width;
        bigBg.scaleY = mo.curSize.y / bigBg.getContentSize().height;
        layer.addChild(bigBg);

        var timerBg = new cc.Sprite("res/progress_bg.png");
        timerBg.x = mo.curSize.x / 2;
        timerBg.y = mo.curSize.y / 2;
        layer.addChild(timerBg);

        this._percentTimer = new cc.ProgressTimer(new cc.Sprite("res/progress_up1.png"));
        this._percentTimer.type = cc.ProgressTimer.TYPE_BAR;
        this._percentTimer.midPoint = cc.p(0, 0);
        this._percentTimer.barChangeRate = cc.p(1, 0);
        this._percentTimer.x = mo.curSize.x / 2;
        this._percentTimer.y = mo.curSize.y / 2;
        layer.addChild(this._percentTimer);

        //文字
        this._progress = new cc.LabelTTF.create("0%", "Arial", 24);
        this._progress.color = cc.color(255, 255, 0, 255);
        this._progress.x = mo.curSize.x / 2;
        this._progress.y = mo.curSize.y / 2 + 50;
        this._progress.string = "正在检查更新";
        layer.addChild(this._progress);


        // android: /data/data/com.huanle.magic/files/
        var storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "./");
        cc.log("storagePath" + storagePath);

        this._am = new jsb.AssetsManager("res/project.manifest", storagePath);
        this._am.retain();

        if (!this._am.getLocalManifest().isLoaded())
        {
            cc.log("Fail to update assets, step skipped.");
            this.loadGame();
        }
        else
        {
            var that = this;
            var listener = new jsb.EventListenerAssetsManager(this._am, function(event) {
                switch (event.getEventCode()){
                    case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                        cc.log("No local manifest file found, skip assets update.");
                        that.loadGame();
                        break;
                    case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                        that._percent = event.getPercent();
                        that._percentByFile = event.getPercentByFile();
                        cc.log(that._percent + "%");

                        var msg = event.getMessage();
                        if (msg) {
                            cc.log(msg);
                        }
                        break;
                    case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
                    case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                        cc.log("Fail to download manifest file, update skipped.");
                        that.loadGame();
                        break;
                    case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                    case jsb.EventAssetsManager.UPDATE_FINISHED:
                        cc.log("Update finished.");
                        that.loadGame();
                        break;
                    case jsb.EventAssetsManager.UPDATE_FAILED:
                        cc.log("Update failed. " + event.getMessage());
                        //todo
                        that.loadGame();
                        break;
                        __failCount ++;
                        if (__failCount < 5)
                        {
                            cc.log("do downloadFailedAssets");
                            that._am.downloadFailedAssets();
                        }
                        else
                        {
                            cc.log("Reach maximum fail count, exit update process");
                            __failCount = 0;
                            that.loadGame();
                        }
                        break;
                    case jsb.EventAssetsManager.ERROR_UPDATING:
                        cc.log("Asset update error: " + event.getAssetId() + ", " + event.getMessage());
                        that.loadGame();
                        break;
                    case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                        cc.log(event.getMessage());
                        that.loadGame();
                        break;
                    default:
                        break;
                }
            });

            cc.eventManager.addListener(listener, 1);
            this._am.update();
            cc.director.runScene(this);
        }

        this.schedule(this.updateProgress, 0.5);
    },
    loadGame:function(){
        cc.loader.loadJs(["src/files.js"], function(err){
            cc.loader.loadJs(jsFiles, function(err){
                cc.LoaderScene.preload(g_resources, function () {
                    cc.director.runScene(new mainScene());
                }, this);
            });
        });
    },
    updateProgress:function(dt){
        this._progress.string = "正在更新版本" + this._percent.toFixed(2) + "%";
        this._percentTimer.setPercentage(this._percent);
    },
    onExit:function(){
        cc.log("AssetsManager::onExit");

        this._am.release();
        this._super();
    }
});