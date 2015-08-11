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
        cc.log("post" + args);

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

    //注册
    that.sendReg = function (post, func, obj){
        mo.waitLayerHelper.open();
        that.sendPost(post, that.host + "/user/register/", function (xhr){
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
                    isSuccess = true;
                }
            }

            func.call(obj, isSuccess);
        });
    };

    //登录
    that.sendLogin = function (post, func, obj){
        mo.waitLayerHelper.open();
        that.sendPost(post, that.host + "/user/loginHall/", function (xhr){
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
                    mo.games = json.data.games;
                    cc.log(mo.games);

                    mo.userInfo.userId = json.data.user_number + "";
                    mo.userInfo.nickname = json.data.nickname;
                    mo.userInfo.login_name = json.data.login_name;
                    mo.userInfo.diamond = json.data.diamond;
                    mo.userInfo.head = "head" + json.data.gender + "_" + json.data.avatar;
                    isSuccess = true;

                    mo.eventHelper.dispatch("updataUserInfo");
                }
            }

            func.call(obj, isSuccess);
        });
    };

    //获取游戏用户信息
    that.sendGetUserInfo = function (post, func, obj){
        mo.waitLayerHelper.open();

        that.sendPost(post, that.host + "/gateway/", function (xhr){
            mo.waitLayerHelper.close();

            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) {
                var httpStatus = xhr.statusText;
                var response = xhr.responseText;

                var json =  JSON.parse(response);
                cc.log(httpStatus);
                cc.log(response);

                if (json.error == 0)
                {
                    func.call(obj, json.data);
                }
            }
        });
    };

    //获取游戏用户兑奖的实物
    that.sendGetUserExchangeInfo = function (post, func, obj){
        mo.waitLayerHelper.open();

        that.sendPost(post, that.host + "/user/pyExchangeHistory/", function (xhr){
            mo.waitLayerHelper.close();

            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) {
                var httpStatus = xhr.statusText;
                var response = xhr.responseText;
                cc.log(httpStatus);
                cc.log(response);

                var json =  JSON.parse(response);
                cc.log(httpStatus);
                cc.log(response);

                if (json.error == 0)
                {
                    func.call(obj, json.data);
                }
            }
        });
    };

    //获取游戏列表
    that.sendGetGameInfo = function (){
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
                    mo.serverList = json.data.servers;
                    mo.acImages = json.data.ac_images;

                    mo.eventHelper.dispatch("updataSeverList");
                }
            }
        });
    };

    return that;
};

mo.httpSessionid = "";
mo.games = null;
mo.httpRequestHelper = new httpRequestHelper();