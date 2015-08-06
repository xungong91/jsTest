/**
 * Created by gongxun on 15/7/16.
 */

var MyObj= function () {
    var that = new EventEmitter();

    var overloadHandlers = {};

    that.inheritOn = function (name, handler) {
        if (!that.hasOwnProperty(name)) {
            that[name] = handler;
            return;
        }
        //overloadHandlers[name]=overloadHandlers[name]||[];
        if (overloadHandlers.hasOwnProperty(name)) {
            overloadHandlers[name].push(that[name]);
        } else {
            overloadHandlers[name] = [that[name], handler];
            overloadHandlers[name].push(handler);
            that[name] = function () {
                var args = new Array(arguments.length);
                for (var i = 0; i < arguments.length; ++i) {
                    args[i] = arguments[i];
                }
                var handlerList = overloadHandlers[name], ret;
                for (var i = 0; i < handlerList.length; ++i) {
                    ret = handlerList[i].apply(that, args);
                }
                return ret;
            }
        }

    };

    return that;
};