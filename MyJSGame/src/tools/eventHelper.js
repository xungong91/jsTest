/**
 * Created by gongxun on 15/8/5.
 */

var eventHelper = function(){
    var that = {};

    var listenerMap = {};

    that.add = function (event, obj, callback){
        var listenerList = listenerMap[event];
        if (!listenerList){
            listenerList = listenerMap[event] = new Array();
        }

        var item = {"obj":obj, "callback":callback};

        for (var i = 0; i < listenerList.length; i++) {
            if((listenerList[i].obj == item.obj) && (listenerList[i].callback == item.callback))
                return;
        }
        listenerList.push(item);
    };

    that.dispatch = function (event){
        if(listenerMap[event])
        {
            var listeners = listenerMap[event].slice();
            for (var i = 0; i < listeners.length; i++) {
                listeners[i].callback.call(listeners[i].obj);
            }
        }
    };

    that.remove = function (obj){
        for (var p in listenerMap){
            var listeners = listenerMap[p];
            for (var i = 0; i < listeners.length; i++) {
                if (listeners[i].obj == obj){
                    listeners.splice(i, 1);
                    i--;
                    cc.log("移除1处" + obj)
                }
            }
        }
    };

    return that;
};

mo.eventHelper = new eventHelper();