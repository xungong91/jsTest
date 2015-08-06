/**
 * Created by gongxun on 15/8/4.
 */

var httpRequestHelper = function (){
    var that ={};

    that.host = "http://192.168.2.21";
    //that.host = "http://api.16youxi.com";

    //post
    that.sendPost = function (post, url, func) {
        var xhr = cc.loader.getXMLHttpRequest();

        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=UTF-8");
        xhr.onreadystatechange = function () {
            func(xhr);
        };
        var args = post;
        if (mo.httpSessionid != null)
        {
            if (args != "")
            {
                args += "&";
            }
            args += ("sessionid=" + mo.httpSessionid);
        }

        xhr.open("POST", url);
        xhr.send(args);
    };

    //get
    that.sendGet = function (url, func) {
        var xhr = cc.loader.getXMLHttpRequest();

        xhr.timeout = 20000;

        xhr.onreadystatechange = function () {
            func(xhr);
        };

        xhr.open("GET", url, true);
        xhr.send();
    };

    //登录
    that.sendLogin = function (post, func, obj){
        mo.waitLayerHelper.open();
        that.sendPost(post, that.host + "/user/login/", function (xhr){
            var isSuccess = false;
            mo.waitLayerHelper.close();

            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) {
                var httpStatus = xhr.statusText;
                var response = xhr.responseText;

                var json =  JSON.parse(response);
                cc.log(httpStatus);
                cc.log(response);

                if (json.error == 0)
                {
                    mo.httpSessionid = json.data.session_key;
                    cc.log(mo.httpSessionid);
                    isSuccess = true;
                }
            }

            func.call(obj, isSuccess);
        });
    };

    //获取信息
    that.sendGetInfo = function (){
        mo.waitLayerHelper.open();

        that.sendPost("", that.host + "/user/info/", function (xhr){
            mo.waitLayerHelper.close();

            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) {
                var httpStatus = xhr.statusText;
                var response = xhr.responseText;

                var obj =  JSON.parse(response);
                cc.log(httpStatus);
                cc.log(response);

                if (obj.error == 0)
                {
                    mo.userInfo.nickname = obj.data.nickname;
                    mo.userInfo.login_name = obj.data.login_name;
                    mo.userInfo.diamond = obj.data.profile.diamond;

                    mo.eventHelper.dispatch("updataUserInfo");
                }
            }
        });
    };

    //获取游戏列表
    that.sendGetInfo = function (){
        mo.waitLayerHelper.open();

        that.sendPost("", that.host + "/server/lists/", function (xhr){
            mo.waitLayerHelper.close();

            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) {
                var httpStatus = xhr.statusText;
                var response = xhr.responseText;

                var json =  JSON.parse(response);
                cc.log(httpStatus);
                cc.log(response);

                if (json.error == 0)
                {
                    mo.serverList = json.data;

                    mo.eventHelper.dispatch("updataSeverList");
                }
            }
        });
    };

    //下载图片
    that.sendGetImg = function (url){
        that.sendGet(url, function (xhr){
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) {
                var httpStatus = xhr.statusText;
                var response = xhr.responseText.substring(0, 100) + "...";

                cc.log(httpStatus);
                cc.log(response);


                //var bytes = cc.loader.loadBinarySync(xhr.responseText);
                //cc.log("阿弥陀佛" + bytes);

                //cc.loader.loadImg(xhr.responseText, {isCrossOrigin : false}, function(err,img){
                //    if(err){
                //        cc.log(err);
                //    }
                //    else{
                //        cc.log("ok");
                //        var texture2d = new cc.Texture2D();
                //        texture2d.initWithElement(img);
                //        texture2d.handleLoadedTexture();
                //        var logo = new cc.Sprite(texture2d);;
                //        logo.setPosition(200,330)
                //        mo.mainScene.addChild(logo, 2);
                //    }
                //});
            }
        });
    };

    return that;
};

mo.httpSessionid = "";
mo.httpRequestHelper = new httpRequestHelper();