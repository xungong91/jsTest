/**
 * Created by gongxun on 16/4/25.
 */

exports.helloWorld = function(){
    console.log("hellow world!");
};

function Exports(){
    var mName = null;

    this.setName = function(name){
        mName = name;
    };

    this.sayHello = function(){
        console.log("hello " + mName);
    };
};

module.exports = Exports;