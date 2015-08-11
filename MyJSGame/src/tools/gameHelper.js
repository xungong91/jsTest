/**
 * Created by gongxun on 15/8/5.
 */

var gameHelper = function (){
    var that = {};

    that.checkFormatUserName = function (value){
        var patrn = /^[\w.]{6,14}$/;
        if (!patrn.exec(value)) {
            return false;
        }
        return true;
    };

    that.checkFormatNick = function (value){
        var patrn = /^[\w.\u0391-\uFFE5]+$/;
        if (!patrn.exec(value)) {
            return false;
        }
        var lenght = value.replace(/[^\x00-\xff]/g,"aa").length;
        if (lenght < 6 || lenght > 12)
        {
            return false;
        }

        return true;
    };

    that.getValueForIitems = function (id, items, items_num){
        var value = 0;
        var s1 = items.split(",");
        var s2 = items_num.split(",");

        for(var i = 0; i < s1.length; i++){
            if (s1[i] == id){
                value = s2[i];
                break;
            }
        }
        return value;
    };

    return that;
};

mo.gameHelper = new gameHelper();