/**
 * Created by gongxun on 15/8/4.
 */

var fileHelper = function (){
    var that = {};

    var ls = null;

    that.keyIsCreate = "keyIsCreate";

    that.keyUserName = "keyUserName";

    that.keyUserPwd = "keyUserPwd";

    that.keyIsShowPwd = "keyIsShowPwd";

    that.create = function (){
        ls = cc.sys.localStorage;

        var isCreate = ls.getItem(that.keyIsCreate);
        cc.log(isCreate);
        if (isCreate == null)
        {
            //第一次打开
            ls.setItem(that.keyIsCreate, "1");
            ls.setItem(that.keyUserName, "");
            ls.setItem(that.keyUserPwd, "");
            ls.setItem(that.keyIsShowPwd, "");
        }
    };

    that.saveItem = function (key, value){
        ls.setItem(key, value);
    };

    that.readItem = function (key){
      return ls.getItem(key);
    };

    that.saveItemOther = function(key){
        var b = that.readItem(key);
        if (b){
            b = "";
        }
        else{
            b = "1";
        }
        that.saveItem(key, b);
    };

    that.saveUserLogin = function (name, pwd){
        that.saveItem(that.keyUserName, name);
        that.saveItem(that.keyUserPwd, pwd);
    };

    that.getUserLogin = function (){
        var result = {};
        result.name = that.readItem(that.keyUserName);
        result.pwd = that.readItem(that.keyUserPwd);

        cc.log(result.name);
        cc.log(result.pwd);
        return result;
    };

    return that;
};

mo.fileHelper = new fileHelper();