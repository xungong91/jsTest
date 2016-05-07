/**
 * Created by gongxun on 16/5/5.
 */

var Defines = function(){
    var that = {};

    that.getExchangeItems = function(){
        var item1 = {id:0, name:"金币1", price:1000};
        var item2 = {id:1, name:"金币2", price:6000};
        var item3 = {id:2, name:"金币3", price:12000};
        var item4 = {id:3, name:"金币4", price:30000};
        var item5 = {id:4, name:"金币5", price:50000};
        var item6 = {id:5, name:"金币6", price:100000};
        var items = [item1, item2, item3, item4, item5, item6];
        return items;
    };

    return that;
};

mo.defines = new Defines();