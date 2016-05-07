/**
 * Created by gongxun on 16/4/25.
 */

var events = require("events");

var eventEmitter = new events.EventEmitter();

var connectHandler = function(){
    console.log("连接成功");

    eventEmitter.emit("data", "test1", 200);
};

eventEmitter.on("data", function(arg1, arg2){
   console.log("接受到数据" + arg1 + arg2);
});

eventEmitter.on("error", function(error){
   console.error("error:" + error);
});

connectHandler();

eventEmitter.emit("error", "有个错误");

console.log("colse");